import { NextResponse } from "next/server";
import { mockPlayers } from "@/mock/players";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const q = searchParams.get("q")?.toLowerCase() || "";
    const position = searchParams.get("position");
    const minAge = searchParams.get("minAge");
    const maxAge = searchParams.get("maxAge");
    const state = searchParams.get("state");
    const minGoals = searchParams.get("minGoals");
    const minMatches = searchParams.get("minMatches");
    const minRating = searchParams.get("minRating");
    const foot = searchParams.get("foot");
    
    let filteredPlayers = mockPlayers;

    // Apply filters
    if (q) {
      filteredPlayers = filteredPlayers.filter(p => 
        p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q)
      );
    }
    
    if (position) {
      const positions = position.split(",");
      filteredPlayers = filteredPlayers.filter(p => positions.includes(p.position));
    }
    
    if (minAge) {
      filteredPlayers = filteredPlayers.filter(p => p.age >= parseInt(minAge));
    }
    
    if (maxAge) {
      filteredPlayers = filteredPlayers.filter(p => p.age <= parseInt(maxAge));
    }
    
    if (state) {
      const states = state.split(",");
      filteredPlayers = filteredPlayers.filter(p => states.includes(p.state));
    }
    
    if (foot) {
      filteredPlayers = filteredPlayers.filter(p => p.preferredFoot.toLowerCase() === foot.toLowerCase());
    }

    if (minGoals) {
      filteredPlayers = filteredPlayers.filter(p => p.stats.careerGoals >= parseInt(minGoals));
    }
    
    if (minMatches) {
      filteredPlayers = filteredPlayers.filter(p => p.stats.careerMatches >= parseInt(minMatches));
    }
    
    if (minRating) {
      filteredPlayers = filteredPlayers.filter(p => (p.stats.currentSeasonRating || 0) >= parseFloat(minRating));
    }

    // Sort by rating desc
    filteredPlayers.sort((a, b) => (b.stats.currentSeasonRating || 0) - (a.stats.currentSeasonRating || 0));

    // Limit to 20
    const finalData = filteredPlayers.slice(0, 20);

    return NextResponse.json({ 
      success: true, 
      count: finalData.length, 
      total: filteredPlayers.length, 
      data: finalData 
    }, { status: 200 });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

