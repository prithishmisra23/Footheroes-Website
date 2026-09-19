"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, MoreVertical, MapPin, Calendar, Trophy, Activity } from "lucide-react";
import Link from "next/link";

import { mockMatches } from "@/mock/matches";
import { mockTeams } from "@/mock/teams";
import { mockTournaments } from "@/mock/tournaments";
import { mockPlayers } from "@/mock/players";
import { mockVenues } from "@/mock/venues";
import { MatchEvent } from "@/types";

import { Tabs } from "@/components/ui/Tabs";
import { ShareModal } from "@/components/modals/ShareModal";
import { EmptyState } from "@/components/common/EmptyState";

export default function MatchScorecard({ params }: { params: { id: string } }) {
  const match = mockMatches.find(m => m.id === params.id);
  // Default to a mock match if not found to avoid crashing the demo since we link to match-123
  const currentMatch = match || mockMatches[0];
  const homeTeam = mockTeams.find(t => t.id === currentMatch.homeTeamId)!;
  const awayTeam = mockTeams.find(t => t.id === currentMatch.awayTeamId)!;
  const tournament = mockTournaments.find(t => t.id === currentMatch.tournamentId)!;
  const venue = currentMatch.venueId ? mockVenues.find(v => v.id === currentMatch.venueId) : null;

  const [activeTab, setActiveTab] = useState("Summary");
  const [shareOpen, setShareOpen] = useState(false);
  const [lineupView, setLineupView] = useState<string>(homeTeam.id);

  const homePlayers = mockPlayers.filter(p => p.currentTeamId === homeTeam.id);
  const awayPlayers = mockPlayers.filter(p => p.currentTeamId === awayTeam.id);

  const isLive = currentMatch.status === "LIVE" || currentMatch.status === "HALF_TIME";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 font-inter pb-24">
      
      {/* ═══ HEADER ═══ */}
      <div className="bg-gray-900 text-white sticky top-0 z-50 shadow-sm transition-colors">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:bg-white/10 p-1.5 rounded-full transition-colors -ml-1.5">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-tight truncate max-w-[200px]">{tournament.name}</span>
              <span className="text-[0.65rem] text-white/80 font-mono flex items-center gap-1">
                {isLive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                {isLive ? `LIVE • ${currentMatch.currentMinute || "1st Half"}` : "FULL TIME"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShareOpen(true)} className="hover:bg-white/10 p-1.5 rounded-full transition-colors"><Share2 size={18} /></button>
            <button className="hover:bg-white/10 p-1.5 rounded-full transition-colors"><MoreVertical size={18} /></button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        
        {/* ═══ BIG SCOREBOARD ═══ */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black via-transparent to-transparent" />
          
          <div className="px-4 py-8">
            <div className="flex items-center justify-between">
              
              {/* Home Team */}
              <div className="flex-1 flex flex-col items-center">
                <Link href={`/team/${homeTeam.slug}`}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-900 font-bebas text-2xl sm:text-3xl mb-3 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {homeTeam.logoUrl ? <img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-full h-full object-contain p-1" /> : <span className="dark:text-gray-400">{homeTeam.shortName}</span>}
                  </div>
                </Link>
                <span className="font-bold text-sm sm:text-base text-center line-clamp-2 dark:text-gray-50">{homeTeam.name}</span>
              </div>

              {/* Score */}
              <div className="flex-shrink-0 px-4 sm:px-8 flex flex-col items-center justify-center">
                <div className="bg-gray-900 rounded-xl px-4 py-2 flex items-center gap-3 sm:gap-4 shadow-inner">
                  <span className="font-mono text-3xl sm:text-4xl font-bold text-white tabular-nums">{currentMatch.homeScore}</span>
                  <span className="text-gray-500 font-mono text-xl sm:text-2xl">-</span>
                  <span className="font-mono text-3xl sm:text-4xl font-bold text-white tabular-nums">{currentMatch.awayScore}</span>
                </div>
                {isLive && (
                  <span className="mt-3 text-xs font-mono font-bold text-[#EF4444] bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded border border-red-100 dark:border-red-900/50 uppercase tracking-wider">
                    {currentMatch.currentMinute || "Live"}
                  </span>
                )}
              </div>

              {/* Away Team */}
              <div className="flex-1 flex flex-col items-center">
                <Link href={`/team/${awayTeam.slug}`}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-900 font-bebas text-2xl sm:text-3xl mb-3 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {awayTeam.logoUrl ? <img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-full h-full object-contain p-1" /> : <span className="dark:text-gray-400">{awayTeam.shortName}</span>}
                  </div>
                </Link>
                <span className="font-bold text-sm sm:text-base text-center line-clamp-2 dark:text-gray-50">{awayTeam.name}</span>
              </div>
              
            </div>
          </div>
        </div>

        {/* ═══ TABS ═══ */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-14 z-40 px-4">
          <Tabs 
            tabs={[
              { id: "Summary", label: "Summary" },
              { id: "Lineups", label: "Lineups" },
              { id: "Stats", label: "Stats" },
              { id: "Info", label: "Info" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* ═══ TAB CONTENT ═══ */}
        <div className="p-4">
          
          {/* SUMMARY TAB (TIMELINE) */}
          {activeTab === "Summary" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 relative overflow-hidden">
              {!(currentMatch.events && currentMatch.events.length > 0) ? (
                <EmptyState icon={Activity} title="Timeline Unavailable" description={currentMatch.homeScore > 0 || currentMatch.awayScore > 0 ? "Historical match timeline is not available for this game." : "No match events have been recorded yet."} />
              ) : (
                <>
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-100 dark:bg-gray-800 -translate-x-1/2" />
                  
                  <div className="space-y-6 relative py-2">
                    {(currentMatch.events || []).sort((a, b) => a.minute - b.minute).map((event) => {
                      const isHome = event.teamId === homeTeam.id;
                      const player = mockPlayers.find(p => p.id === event.playerId);
                      const assistPlayer = event.assistPlayerId ? mockPlayers.find(p => p.id === event.assistPlayerId) : null;
                      
                      return (
                        <div key={event.id} className={`flex items-center w-full ${isHome ? "justify-start" : "justify-end"}`}>
                          {/* Left Side (Home) */}
                          <div className={`w-1/2 ${isHome ? "pr-6 text-right" : "pl-6 text-left opacity-0"}`}>
                            {isHome && (
                              <>
                                <div className="font-bold text-sm text-gray-900 dark:text-gray-50">{player?.name || "Unknown"}</div>
                                {assistPlayer && <div className="text-[0.65rem] text-gray-400">Ast: {assistPlayer.name}</div>}
                              </>
                            )}
                          </div>
                          
                          {/* Center Icon */}
                          <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 flex items-center justify-center z-10 text-[0.6rem] font-bold">
                            {event.type === "GOAL" && "⚽"}
                            {event.type === "YELLOW_CARD" && <div className="w-2.5 h-3.5 bg-yellow-400 rounded-sm" />}
                            {event.type === "RED_CARD" && <div className="w-2.5 h-3.5 bg-red-500 rounded-sm" />}
                            {event.type === "SUBSTITUTION" && "🔄"}
                          </div>
                          
                          {/* Minute Marker */}
                          <div className={`absolute left-1/2 -translate-x-1/2 -mt-7 text-[0.6rem] font-mono font-bold text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 px-1`}>
                            {event.minute}'
                          </div>

                          {/* Right Side (Away) */}
                          <div className={`w-1/2 ${!isHome ? "pl-6 text-left" : "pr-6 text-right opacity-0"}`}>
                            {!isHome && (
                              <>
                                <div className="font-bold text-sm text-gray-900 dark:text-gray-50">{player?.name || "Unknown"}</div>
                                {assistPlayer && <div className="text-[0.65rem] text-gray-400">Ast: {assistPlayer.name}</div>}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* STATS TAB */}
          {activeTab === "Stats" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 space-y-5">
              {!currentMatch.homeStats ? (
                 <EmptyState icon={Activity} title="No stats" description="Match stats are not available yet." />
              ) : (
                <>
                  {/* Possession */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-900 dark:text-gray-50 mb-2">
                      <span>{currentMatch.homeStats.possessionPct}%</span>
                      <span className="text-gray-400 uppercase tracking-wider text-[0.65rem]">Possession</span>
                      <span>{currentMatch.awayStats.possessionPct}%</span>
                    </div>
                    <div className="flex h-2 w-full rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <div className="h-full bg-[#22C55E]" style={{ width: `${currentMatch.homeStats.possessionPct}%` }} />
                      <div className="h-full bg-[#F59E0B]" style={{ width: `${currentMatch.awayStats.possessionPct}%` }} />
                    </div>
                  </div>

                  {/* Stats Bars */}
                  {[
                    { label: "Shots", h: currentMatch.homeStats.shots, a: currentMatch.awayStats.shots },
                    { label: "On Target", h: currentMatch.homeStats.shotsOnTarget, a: currentMatch.awayStats.shotsOnTarget },
                    { label: "Corners", h: currentMatch.homeStats.corners, a: currentMatch.awayStats.corners },
                    { label: "Fouls", h: currentMatch.homeStats.fouls, a: currentMatch.awayStats.fouls },
                    { label: "Yellow Cards", h: currentMatch.homeStats.yellowCards, a: currentMatch.awayStats.yellowCards },
                    { label: "Red Cards", h: currentMatch.homeStats.redCards, a: currentMatch.awayStats.redCards },
                  ].map((stat) => {
                    const total = stat.h + stat.a || 1;
                    const hPct = (stat.h / total) * 100;
                    const aPct = (stat.a / total) * 100;
                    return (
                      <div key={stat.label}>
                        <div className="flex justify-between text-xs font-bold text-gray-900 dark:text-gray-50 mb-1.5">
                          <span>{stat.h}</span>
                          <span className="text-gray-400 uppercase tracking-wider text-[0.65rem]">{stat.label}</span>
                          <span>{stat.a}</span>
                        </div>
                        <div className="flex justify-between h-1.5 w-full gap-2">
                          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-l-full overflow-hidden flex justify-end">
                            <div className="h-full bg-[#22C55E]" style={{ width: `${hPct}%` }} />
                          </div>
                          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-r-full overflow-hidden">
                            <div className="h-full bg-[#F59E0B]" style={{ width: `${aPct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </motion.div>
          )}

          {/* LINEUPS TAB */}
          {activeTab === "Lineups" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              
              {/* Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setLineupView(homeTeam.id)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${lineupView === homeTeam.id ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}
                >
                  {homeTeam.shortName}
                </button>
                <button
                  onClick={() => setLineupView(awayTeam.id)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${lineupView === awayTeam.id ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}
                >
                  {awayTeam.shortName}
                </button>
              </div>

              {/* Roster List */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-950 px-4 py-2 text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider flex justify-between border-b border-gray-100 dark:border-gray-800">
                  <span>Squad</span>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {(lineupView === homeTeam.id ? homePlayers : awayPlayers).map((player, i) => (
                    <Link href={`/player/${player.slug}`} key={player.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-xs shrink-0 overflow-hidden">
                          {player.avatarUrl ? <img src={player.avatarUrl} alt="" className="w-full h-full object-cover" /> : player.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-gray-900 dark:text-gray-50">{player.name}</div>
                          <div className="text-[0.65rem] text-gray-500 dark:text-gray-400">{player.position}</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {(currentMatch.events || [])
                          .filter((event: MatchEvent) => event.playerId === player.id && event.type === "GOAL")
                          .map((_, index: number) => <span key={index} className="text-xs">⚽</span>)}
                        {(currentMatch.events || [])
                          .filter((event: MatchEvent) => event.playerId === player.id && event.type === "YELLOW_CARD")
                          .map((_, index: number) => <div key={index} className="w-2.5 h-3.5 bg-yellow-400 rounded-sm mt-0.5" />)}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* INFO TAB */}
          {activeTab === "Info" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 uppercase tracking-wider mb-4">Match Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Trophy size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Tournament</div>
                      <Link href={`/tournament/${tournament.slug}`} className="font-medium text-sm text-gray-900 dark:text-gray-50 hover:text-[#22C55E]">{tournament.name}</Link>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Date & Time</div>
                      <div className="font-medium text-sm text-gray-900 dark:text-gray-50">{new Date(currentMatch.date).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Venue</div>
                      {venue ? (
                        <Link href={`/venues/${venue.slug}`} className="font-medium text-sm text-gray-900 dark:text-gray-50 hover:text-[#22C55E]">{venue.name}</Link>
                      ) : (
                        <div className="font-medium text-sm text-gray-900 dark:text-gray-50">TBD</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* FLOATING ACTION BUTTON (FOR ADMINS/SCORERS) */}
      {isLive && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Link href={`/match/${params.id}/score`} className="bg-green-500 text-white font-bold text-sm uppercase tracking-wider px-6 py-3.5 rounded-full flex items-center gap-2 hover:bg-green-600 transition-colors shadow-lg">
            <Activity size={16} /> Score Match
          </Link>
        </div>
      )}

      <ShareModal 
        isOpen={shareOpen} 
        onClose={() => setShareOpen(false)} 
        title={`Check out ${homeTeam.shortName} vs ${awayTeam.shortName} on Foot Heroes!`} 
        url={typeof window !== "undefined" ? window.location.href : ""} 
      />
    </div>
  );
}
