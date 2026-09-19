import { NextResponse } from "next/server";
import { z } from "zod";

const TournamentCreateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  
  format: z.enum(["LEAGUE", "KNOCKOUT", "GROUP_KNOCKOUT"]),
  matchesPerTeam: z.number().min(1),
  playerFormat: z.enum(["5v5", "7v7", "11v11"]),
  
  entryFee: z.number().min(0),
  registrationDeadline: z.string().min(1, "Registration deadline is required"),
  maxTeams: z.number().min(2),
  prizePool: z.number().min(0),
  
  matchDuration: z.number().min(10),
  pointsForWin: z.number().default(3),
  pointsForDraw: z.number().default(1),
  subsAllowed: z.number().min(0),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = TournamentCreateSchema.parse(body);

    console.log("Mock API received tournament creation:", validatedData);

    // In a real app, this would insert into the Supabase database
    // and generate a unique slug based on the name + random hash
    const generatedSlug = validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 1000);

    return NextResponse.json({ 
      success: true, 
      slug: generatedSlug,
      message: "Tournament created successfully!"
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    
    console.error("Tournament creation API error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
