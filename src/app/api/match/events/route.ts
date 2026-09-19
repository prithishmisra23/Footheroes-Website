import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { matchEventsLimiter } from "@/lib/security/rateLimiter";
import { logAuditAction } from "@/lib/security/auditLogger";

const EventSchema = z.object({
  matchId: z.string().min(1),
  teamId: z.string().min(1),
  type: z.enum([
    "GOAL", "YELLOW_CARD", "RED_CARD", "SECOND_YELLOW", 
    "SUBSTITUTION", "CORNER", "INJURY", "SAVE"
  ]),
  playerId: z.string().min(1),
  secondaryPlayerId: z.string().optional(),
  assistPlayerId: z.string().optional(),
  minute: z.number().min(1).max(120),
  isHomeTeam: z.boolean(),
  isPenalty: z.boolean().optional(),
  isOwnGoal: z.boolean().optional(),
});

function mapEventType(type: string, isPenalty?: boolean, isOwnGoal?: boolean) {
  if (type === "GOAL") {
    if (isPenalty) return "penalty_scored";
    if (isOwnGoal) return "own_goal";
    return "goal";
  }
  if (type === "YELLOW_CARD") return "yellow_card";
  if (type === "RED_CARD") return "red_card";
  if (type === "SECOND_YELLOW") return "second_yellow";
  if (type === "SUBSTITUTION") return "substitution_on"; // simplified for now
  if (type === "CORNER") return "corner";
  if (type === "INJURY") return "injury";
  if (type === "SAVE") return "save";
  return type.toLowerCase();
}

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { success: rateLimitSuccess } = await matchEventsLimiter.limit(ip);
    if (!rateLimitSuccess) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429, headers: { 'Retry-After': '60' } });
    }

    const body = await req.json();
    const validatedData = EventSchema.parse(body);

    const supabase = createClient();

    // 2. Verify User Authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 3. Verify match is LIVE and User is Assigned Scorer
    const { data: matchData, error: matchError } = await supabase
      .from('matches')
      .select('status, scorer_user_id')
      .eq('id', validatedData.matchId)
      .single();

    if (matchError || !matchData) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    if (matchData.status !== 'live') {
      return NextResponse.json({ error: "Events can only be added to live matches" }, { status: 400 });
    }

    if (matchData.scorer_user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden: You are not the assigned scorer for this match" }, { status: 403 });
    }

    const eventType = mapEventType(validatedData.type, validatedData.isPenalty, validatedData.isOwnGoal);

    // 4. Insert event into Supabase `match_events` table
    const { data, error } = await supabase
      .from('match_events')
      .insert({
        match_id: validatedData.matchId,
        team_id: validatedData.teamId,
        event_type: eventType,
        player_id: validatedData.playerId,
        secondary_player_id: validatedData.assistPlayerId || validatedData.secondaryPlayerId,
        minute: validatedData.minute,
        is_home_team: validatedData.isHomeTeam,
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // 5. Audit Logging
    await logAuditAction({
      action: 'match_event_add',
      userId: user.id,
      resourceId: data.id,
      resourceType: 'match_event',
      metadata: {
        matchId: validatedData.matchId,
        eventType,
        minute: validatedData.minute
      },
      ipAddress: ip,
      userAgent: req.headers.get("user-agent") || undefined,
    });

    // TODO: Trigger DB functions or edge functions for complex stats (if not using triggers)
    // Supabase Realtime will automatically broadcast this insertion if RLS policies and channel configs allow.

    return NextResponse.json({ success: true, event: data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    
    console.error("Match event API error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
