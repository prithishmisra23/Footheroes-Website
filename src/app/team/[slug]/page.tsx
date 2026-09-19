"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, MoreVertical, MapPin, Calendar, Shield, Trophy, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { mockTeams } from "@/mock/teams";
import { mockPlayers } from "@/mock/players";
import { mockMatches } from "@/mock/matches";
import { mockTournaments } from "@/mock/tournaments";

import { Tabs } from "@/components/ui/Tabs";
import { StatCard } from "@/components/common/StatCard";
import { EmptyState } from "@/components/common/EmptyState";
import { MatchCard } from "@/components/match/MatchCard";
import { ShareModal } from "@/components/modals/ShareModal";

const FORM_COLOR: Record<string, string> = { W: "bg-[#22C55E]", G: "bg-[#22C55E]", D: "bg-[#F59E0B]", L: "bg-[#EF4444]" };

export default function TeamProfile({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState("Info");
  const [shareOpen, setShareOpen] = useState(false);

  const team = mockTeams.find((t) => t.slug === params.slug);
  if (!team) return notFound();

  const squad = mockPlayers.filter(p => p.currentTeamId === team.id);
  const recentMatches = mockMatches.filter(m => m.homeTeamId === team.id || m.awayTeamId === team.id).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 font-inter pb-20">
      
      {/* ═══ HEADER ═══ */}
      <div className="bg-[#1e293b] text-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:bg-white/10 p-1.5 rounded-full transition-colors -ml-1.5">
              <ArrowLeft size={20} />
            </Link>
            <span className="font-semibold text-lg truncate max-w-[200px]">{team.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShareOpen(true)} className="hover:bg-white/10 p-1.5 rounded-full transition-colors"><Share2 size={18} /></button>
            <button className="hover:bg-white/10 p-1.5 rounded-full transition-colors"><MoreVertical size={18} /></button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        
        {/* ═══ TEAM BASIC INFO ═══ */}
        <div className="bg-white dark:bg-gray-900 px-4 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-4 mb-5">
            {/* Logo */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-white font-bebas text-3xl sm:text-4xl shadow-md border-4 border-white dark:border-gray-900 overflow-hidden">
                {team.logoUrl ? <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain p-1" /> : <span className="text-gray-400 font-bebas">{team.shortName}</span>}
              </div>
              {team.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-0.5">
                  <ShieldCheck size={20} className="text-[#3B82F6]" />
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1 pt-1 min-w-0">
              <h1 className="font-bold text-xl text-gray-900 dark:text-gray-50 flex items-center gap-1.5 truncate">
                {team.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-2">{team.type}</p>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><MapPin size={12} /> {team.city}, {team.state}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> Est. {team.foundedYear}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-2 bg-gray-50 dark:bg-gray-950 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
            <div className="text-center border-r border-gray-200 dark:border-gray-800">
              <div className="font-mono text-lg font-bold text-gray-900 dark:text-gray-50">{team.stats.totalMatches}</div>
              <div className="text-[0.6rem] text-gray-400 uppercase font-semibold">Matches</div>
            </div>
            <div className="text-center border-r border-gray-200 dark:border-gray-800">
              <div className="font-mono text-lg font-bold text-[#22C55E]">{team.stats.wins}</div>
              <div className="text-[0.6rem] text-gray-400 uppercase font-semibold">Won</div>
            </div>
            <div className="text-center border-r border-gray-200 dark:border-gray-800">
              <div className="font-mono text-lg font-bold text-gray-500">{team.stats.draws}</div>
              <div className="text-[0.6rem] text-gray-400 uppercase font-semibold">Drawn</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-lg font-bold text-[#EF4444]">{team.stats.losses}</div>
              <div className="text-[0.6rem] text-gray-400 uppercase font-semibold">Lost</div>
            </div>
          </div>
        </div>

        {/* ═══ TABS ═══ */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-14 z-40 px-4">
          <Tabs 
            tabs={[
              { id: "Info", label: "Info" },
              { id: "Squad", label: "Squad" },
              { id: "Matches", label: "Matches" },
              { id: "Stats", label: "Stats" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* ═══ TAB CONTENT ═══ */}
        <div className="p-4">
          
          {/* INFO TAB */}
          {activeTab === "Info" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              
              {/* Club Details */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 uppercase tracking-wider mb-3">Club Details</h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <span className="block text-xs text-gray-400 mb-0.5">Type</span>
                    <span className="font-medium text-gray-900 dark:text-gray-50">{team.type}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 mb-0.5">Founded</span>
                    <span className="font-medium text-gray-900 dark:text-gray-50">{team.foundedYear}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 mb-0.5">Location</span>
                    <span className="font-medium text-gray-900 dark:text-gray-50">{team.city}, {team.state}</span>
                  </div>
                </div>
              </div>

              {/* Form & Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recent Form</span>
                  <div className="flex items-center gap-1.5">
                    {team.formGuide.map((f, i) => (
                      <span key={i} className={`w-5 h-5 rounded-full flex items-center justify-center text-[0.55rem] font-bold text-white ${FORM_COLOR[f] || "bg-gray-400"}`}>{f}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">Win Rate</span>
                  <div className="font-mono text-xl font-bold text-[#22C55E]">
                    {team.stats.totalMatches > 0 ? Math.round((team.stats.wins / team.stats.totalMatches) * 100) : 0}%
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SQUAD TAB */}
          {activeTab === "Squad" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {squad.length === 0 ? (
                <EmptyState icon={Users} title="No players found" description="There are no registered players in this squad yet." />
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="bg-gray-50 dark:bg-gray-950 px-4 py-2 text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider grid grid-cols-[1fr_3rem_3rem] border-b border-gray-100 dark:border-gray-800">
                    <span>Player</span>
                    <span className="text-center">Mat</span>
                    <span className="text-center">Gls</span>
                  </div>
                  <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {squad.map((player) => (
                      <Link href={`/player/${player.slug}`} key={player.id} className="px-4 py-3 grid grid-cols-[1fr_3rem_3rem] items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 font-bold text-xs shrink-0 overflow-hidden">
                            {player.avatarUrl ? <img src={player.avatarUrl} alt={player.name} className="w-full h-full object-cover" /> : player.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-50 truncate">{player.name}</h4>
                            <p className="text-[0.65rem] text-gray-500 dark:text-gray-400 truncate">{player.position}</p>
                          </div>
                        </div>
                        <div className="text-center font-mono text-sm text-gray-500">{player.stats.careerMatches}</div>
                        <div className="text-center font-mono text-sm font-bold text-gray-900 dark:text-gray-50">{player.stats.careerGoals}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* MATCHES TAB */}
          {activeTab === "Matches" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {recentMatches.length === 0 ? (
                <EmptyState icon={Calendar} title="No matches found" description="This team hasn't played any recorded matches yet." />
              ) : (
                recentMatches.map((m) => {
                  const homeTeam = mockTeams.find(t => t.id === m.homeTeamId)!;
                  const awayTeam = mockTeams.find(t => t.id === m.awayTeamId)!;
                  const tournament = mockTournaments.find(t => t.id === m.tournamentId)!;
                  return (
                    <MatchCard key={m.id} match={m} homeTeam={homeTeam} awayTeam={awayTeam} tournament={tournament} />
                  );
                })
              )}
            </motion.div>
          )}

          {/* STATS TAB */}
          {activeTab === "Stats" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <StatCard label="Goals Scored" value={team.stats.goalsFor} />
              <StatCard label="Goals Conceded" value={team.stats.goalsAgainst} />
              <StatCard label="Clean Sheets" value={team.stats.cleanSheets} />
            </motion.div>
          )}

        </div>
      </div>

      <ShareModal 
        isOpen={shareOpen} 
        onClose={() => setShareOpen(false)} 
        title={`Check out ${team.name} on Foot Heroes!`} 
        url={typeof window !== "undefined" ? window.location.href : ""} 
      />
    </div>
  );
}
