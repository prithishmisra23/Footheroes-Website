"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, CalendarDays, Trophy, Shield, User, ChevronRight, Goal, Users, Zap, Award, Flame } from "lucide-react";

type TabId = "home" | "matches" | "stats" | "teams" | "profile";

interface InteractivePhoneDemoProps {
  activeTab?: TabId;
  onTabChange?: (tab: TabId) => void;
  showBottomNav?: boolean;
}

export function InteractivePhoneDemo({ 
  activeTab: externalTab, 
  onTabChange, 
  showBottomNav = true 
}: InteractivePhoneDemoProps) {
  
  const [internalTab, setInternalTab] = useState<TabId>("home");
  const activeTab = externalTab || internalTab;

  const handleTabChange = (tab: TabId) => {
    if (onTabChange) onTabChange(tab);
    else setInternalTab(tab);
  };

  const [leaderboardCategory, setLeaderboardCategory] = useState<"goals" | "assists" | "matches" | "rating">("goals");

  return (
    <div className="relative w-full mx-auto">
      {/* Decorative Glow Effects - only show if no external tab is controlling it (e.g. Hero) */}
      {!externalTab && (
        <>
          <div className="absolute -right-4 top-8 h-36 w-36 rounded-full bg-[#F75A0A] opacity-20 blur-3xl" />
          <div className="absolute -left-5 bottom-12 h-32 w-32 rounded-full bg-[#FFD166] opacity-15 blur-3xl" />
        </>
      )}
      
      {/* Phone Hardware Frame - STRICT fixed aspect ratio based on width */}
      <div className="relative mx-auto rounded-[2.5rem] sm:rounded-[3rem] border-[6px] sm:border-[8px] border-[#171717] bg-black shadow-2xl aspect-[360/720] w-full max-w-[380px] sm:max-w-[420px] overflow-hidden">
        
        {/* Inner Phone Display (App Shell) - STRICT flex column, 100% size of the hardware frame */}
        <div className="absolute inset-1.5 sm:inset-2 flex flex-col overflow-hidden rounded-[2rem] sm:rounded-[2.4rem] bg-[#F7F4EE] text-[#171717]">
          
          {/* iOS Status Bar (Fixed height, shrink-0) */}
          <div className="flex items-center justify-between px-6 pt-3 pb-2 shrink-0 z-20 bg-[#F7F4EE]">
            <span className="text-[13px] font-bold">12:00</span>
            <span className="text-[11px]">5G ▰</span>
          </div>

          {/* Dynamic Content Area (ScreenViewport) - Flex-1, scrollable internally ONLY */}
          <div className="relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide z-10 bg-[#F7F4EE]">
            <div className="px-4 sm:px-5 pb-6">
              <AnimatePresence mode="wait">
                
                {/* HOME SCREEN */}
                {activeTab === "home" && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <div className="py-4">
                      <h3 className="text-xl font-semibold text-stone-500">Welcome back,</h3>
                      <h2 className="text-4xl font-bold tracking-tight">Alex</h2>
                    </div>
                    
                    {/* Next Match Card */}
                    <div className="mt-2 rounded-3xl bg-[#171717] p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-5"><Zap size={120} /></div>
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                        <span className="text-stone-400">NEXT MATCH</span>
                        <span className="text-[#FFD166]">Tomorrow</span>
                      </div>
                      <p className="mt-5 text-2xl font-bold leading-tight">Kickers FC <br/><span className="text-stone-400 text-base font-normal">vs</span> Local Lads</p>
                      <div className="mt-5 flex items-center gap-2 text-sm text-stone-400 font-medium">
                        <CalendarDays size={16} />
                        <span>18:00 • Central Pitch</span>
                      </div>
                    </div>

                    {/* Compact Stats */}
                    <div className="mt-5 grid grid-cols-4 gap-2">
                      <div className="rounded-2xl bg-white p-3 sm:p-4 text-center shadow-sm border border-stone-100 flex flex-col justify-center">
                        <b className="text-2xl block text-[#171717]">42</b>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide mt-1">Matches</span>
                      </div>
                      <div className="rounded-2xl bg-white p-3 sm:p-4 text-center shadow-sm border border-stone-100 flex flex-col justify-center">
                        <b className="text-2xl block text-[#171717]">14</b>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide mt-1">Goals</span>
                      </div>
                      <div className="rounded-2xl bg-white p-3 sm:p-4 text-center shadow-sm border border-stone-100 flex flex-col justify-center">
                        <b className="text-2xl block text-[#171717]">8</b>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide mt-1">Assists</span>
                      </div>
                      <div className="rounded-2xl bg-[#FFD166] p-3 sm:p-4 text-center shadow-sm flex flex-col justify-center">
                        <b className="text-2xl block text-[#171717]">8.4</b>
                        <span className="text-[10px] font-bold text-[#171717] uppercase tracking-wide mt-1">Rating</span>
                      </div>
                    </div>

                    {/* Recent Performance */}
                    <h3 className="mt-6 text-[12px] font-bold text-stone-400 uppercase tracking-widest mb-3">Recent Performance</h3>
                    <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl">W</div>
                        <div>
                          <p className="text-base font-bold text-[#171717]">Kickers 3 - 0 United</p>
                          <p className="text-xs font-medium text-stone-500 mt-0.5">1 Goal • 8.8 Rating</p>
                        </div>
                      </div>
                      <Flame size={24} className="text-[#F75A0A]" />
                    </div>
                  </motion.div>
                )}

                {/* MATCHES SCREEN */}
                {activeTab === "matches" && (
                  <motion.div
                    key="matches"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <h2 className="text-3xl font-bold py-4 tracking-tight">Match Centre</h2>
                    <div className="space-y-3">
                      {[
                        { status: "FT", league: "Sunday League Div 1", home: "Kickers FC", score: "2 - 1", away: "Local Lads", live: false },
                        { status: "67'", league: "City Cup", home: "United FC", score: "3 - 3", away: "City Athletic", live: true },
                        { status: "FT", league: "Sunday League Div 1", home: "Red Devils", score: "1 - 0", away: "Warriors FC", live: false },
                        { status: "20:00", league: "Friendly", home: "Northside FC", score: "vs", away: "Eagles", live: false },
                        { status: "FT", league: "Friendly", home: "Southside FC", score: "0 - 0", away: "Eagles", live: false },
                      ].map((match, i) => (
                        <div key={i} className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-stone-100">
                          <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-3">
                            <span className={match.live ? "text-[#F75A0A] animate-pulse" : ""}>{match.status}</span>
                            <span>{match.league}</span>
                          </div>
                          <div className="flex justify-between items-center font-bold text-base">
                            <span className="w-[30%] text-right truncate leading-tight">{match.home}</span>
                            <span className={`text-base px-3 py-1.5 rounded-lg ${match.score === 'vs' ? 'bg-stone-100 text-stone-500' : 'bg-[#171717] text-white'}`}>{match.score}</span>
                            <span className="w-[30%] text-left truncate leading-tight">{match.away}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STATS SCREEN */}
                {activeTab === "stats" && (
                  <motion.div
                    key="stats"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <h2 className="text-3xl font-bold py-4 tracking-tight">Leaderboards</h2>
                    
                    {/* Segmented Control */}
                    <div className="rounded-xl bg-[#EBE7DF] p-1.5 shadow-inner border border-stone-200 mb-5 flex">
                      {(["goals", "assists", "matches", "rating"] as const).map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setLeaderboardCategory(cat)}
                          className={`flex-1 rounded-lg py-2.5 text-[11px] uppercase tracking-wider font-bold transition-all relative ${
                            leaderboardCategory === cat ? "text-[#171717] shadow-sm" : "text-stone-500 hover:text-stone-700"
                          }`}
                        >
                          {leaderboardCategory === cat && (
                            <motion.div 
                              layoutId="stats-segment" 
                              className="absolute inset-0 bg-white rounded-lg shadow-sm" 
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          <span className="relative z-10">{cat}</span>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2.5">
                      {[
                        { name: "John Doe", team: "Kickers FC", goals: 14, assists: 4, matches: 15, rating: "8.7" },
                        { name: "Alex Smith", team: "Local Lads", goals: 12, assists: 8, matches: 14, rating: "8.4" },
                        { name: "Mike Johnson", team: "United FC", goals: 10, assists: 2, matches: 16, rating: "7.9" },
                        { name: "Sam Davis", team: "Red Devils", goals: 8, assists: 9, matches: 15, rating: "8.1" },
                        { name: "Tom Wilson", team: "Eagles", goals: 6, assists: 11, matches: 16, rating: "8.2" },
                      ].sort((a, b) => {
                        if (leaderboardCategory === "goals") return b.goals - a.goals;
                        if (leaderboardCategory === "assists") return b.assists - a.assists;
                        if (leaderboardCategory === "matches") return b.matches - a.matches;
                        return parseFloat(b.rating) - parseFloat(a.rating);
                      }).map((player, i) => (
                        <motion.div 
                          layout
                          key={player.name}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-4 rounded-2xl bg-white p-3.5 shadow-sm border border-stone-100"
                        >
                          <span className="font-bold text-stone-300 w-5 text-center text-base">{i + 1}</span>
                          <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 border border-stone-200" />
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-bold truncate text-[#171717]">{player.name}</p>
                            <p className="text-xs font-medium text-stone-500 truncate">{player.team}</p>
                          </div>
                          <span className="font-bold text-2xl text-[#171717]">
                            {player[leaderboardCategory]}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* TEAMS SCREEN */}
                {activeTab === "teams" && (
                  <motion.div
                    key="teams"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <h2 className="text-3xl font-bold py-4 tracking-tight">My Teams</h2>
                    
                    <div className="rounded-3xl bg-[#171717] p-6 sm:p-7 text-white shadow-xl mb-5 relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#F75A0A] rounded-full opacity-20 blur-2xl" />
                      <div className="flex items-start justify-between relative z-10">
                        <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                          <Shield size={32} className="text-white" />
                        </div>
                        <span className="bg-[#FFD166] text-[#171717] px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold">CAPTAIN</span>
                      </div>
                      <h3 className="mt-6 text-3xl font-bold tracking-tight">Kickers FC</h3>
                      <p className="text-base font-medium text-stone-400 mt-1">Sunday League Div 1</p>
                      
                      <div className="mt-8 flex items-center gap-6 border-t border-white/10 pt-5">
                        <div>
                          <p className="text-[11px] text-stone-400 uppercase tracking-widest font-bold">Pos</p>
                          <p className="text-2xl font-bold mt-1">3rd</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-stone-400 uppercase tracking-widest font-bold">Form</p>
                          <p className="text-2xl font-bold mt-1">W D W</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-white p-6 sm:p-7 shadow-sm border border-stone-100 mb-4">
                      <div className="flex items-start justify-between">
                        <div className="h-14 w-14 rounded-2xl bg-stone-100 flex items-center justify-center border border-stone-200">
                          <Shield size={28} className="text-stone-400" />
                        </div>
                        <span className="bg-stone-100 text-stone-500 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold">PLAYER</span>
                      </div>
                      <h3 className="mt-5 text-xl font-bold tracking-tight">5-a-side Lads</h3>
                      <p className="text-sm font-medium text-stone-500 mt-1">Thursday Night League</p>
                    </div>
                  </motion.div>
                )}

                {/* PROFILE SCREEN */}
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <div className="pt-8 pb-6 text-center">
                      <div className="mx-auto h-28 w-28 rounded-full bg-gradient-to-tr from-[#F75A0A] to-[#FFD166] p-1.5 shadow-lg">
                        <div className="h-full w-full rounded-full bg-white border-4 border-white overflow-hidden relative">
                           {/* Placeholder for avatar */}
                           <div className="absolute inset-0 bg-stone-200" />
                           <User className="absolute inset-0 m-auto text-stone-400" size={48} />
                        </div>
                      </div>
                      <h2 className="mt-5 text-3xl font-bold tracking-tight">Alex Smith</h2>
                      <p className="text-sm font-bold text-[#F75A0A] mt-1.5 uppercase tracking-widest">Midfielder</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="rounded-3xl bg-white p-5 shadow-sm border border-stone-100 flex flex-col items-center">
                        <p className="text-[11px] text-stone-400 font-bold uppercase tracking-widest">Matches</p>
                        <p className="text-3xl font-bold text-[#171717] mt-1">42</p>
                      </div>
                      <div className="rounded-3xl bg-[#171717] p-5 shadow-sm flex flex-col items-center">
                        <p className="text-[11px] text-stone-400 font-bold uppercase tracking-widest">Rating</p>
                        <p className="text-3xl font-bold text-[#FFD166] mt-1">8.4</p>
                      </div>
                    </div>

                    <h3 className="text-[12px] font-bold text-stone-400 uppercase tracking-widest mb-3">Career Totals</h3>
                    <div className="rounded-3xl bg-white p-5 shadow-sm border border-stone-100 space-y-5">
                      <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                        <div className="flex items-center gap-3 text-base font-bold text-stone-600">
                          <Goal size={20} /> Goals
                        </div>
                        <span className="font-bold text-2xl text-[#171717]">14</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                        <div className="flex items-center gap-3 text-base font-bold text-stone-600">
                          <Users size={20} /> Assists
                        </div>
                        <span className="font-bold text-2xl text-[#171717]">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 text-base font-bold text-stone-600">
                          <Award size={20} /> MOTM
                        </div>
                        <span className="font-bold text-2xl text-[#171717]">5</span>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Navigation (Fixed height, shrink-0) */}
          {showBottomNav && (
            <div className="shrink-0 flex justify-between items-center bg-[#F7F4EE]/90 backdrop-blur-md border-t border-stone-200 px-6 pt-3 pb-6 relative z-20">
              <button 
                onClick={() => handleTabChange("home")}
                className={`flex flex-col items-center gap-1.5 ${activeTab === "home" ? "text-[#F75A0A]" : "text-stone-400"}`}
              >
                <Activity size={24} className={activeTab === "home" ? "fill-[#F75A0A]/20" : ""} />
                <span className="text-[10px] font-bold">Home</span>
              </button>
              <button 
                onClick={() => handleTabChange("matches")}
                className={`flex flex-col items-center gap-1.5 ${activeTab === "matches" ? "text-[#F75A0A]" : "text-stone-400"}`}
              >
                <CalendarDays size={24} className={activeTab === "matches" ? "fill-[#F75A0A]/20" : ""} />
                <span className="text-[10px] font-bold">Matches</span>
              </button>
              <button 
                onClick={() => handleTabChange("stats")}
                className={`flex flex-col items-center gap-1.5 ${activeTab === "stats" ? "text-[#F75A0A]" : "text-stone-400"}`}
              >
                <Trophy size={24} className={activeTab === "stats" ? "fill-[#F75A0A]/20" : ""} />
                <span className="text-[10px] font-bold">Stats</span>
              </button>
              <button 
                onClick={() => handleTabChange("teams")}
                className={`flex flex-col items-center gap-1.5 ${activeTab === "teams" ? "text-[#F75A0A]" : "text-stone-400"}`}
              >
                <Shield size={24} className={activeTab === "teams" ? "fill-[#F75A0A]/20" : ""} />
                <span className="text-[10px] font-bold">Teams</span>
              </button>
              <button 
                onClick={() => handleTabChange("profile")}
                className={`flex flex-col items-center gap-1.5 ${activeTab === "profile" ? "text-[#F75A0A]" : "text-stone-400"}`}
              >
                <User size={24} className={activeTab === "profile" ? "fill-[#F75A0A]/20" : ""} />
                <span className="text-[10px] font-bold">Profile</span>
              </button>
              
              {/* iOS Home Indicator */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[35%] h-1 bg-[#171717] rounded-full" />
            </div>
          )}
          
          {/* Fallback iOS Home Indicator if no bottom nav */}
          {!showBottomNav && (
            <div className="shrink-0 h-4 bg-[#F7F4EE] relative z-20">
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[35%] h-1 bg-[#171717] rounded-full" />
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
