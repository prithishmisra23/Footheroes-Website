"use client";

import { useState } from "react";
import { Search, Filter, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { mockPlayers } from "@/mock/players";
import { mockTeams } from "@/mock/teams";

import { PlayerCard } from "@/components/player/PlayerCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const FILTERS = {
  roles: ["All Roles", "Striker", "Midfielder", "Defender", "Goalkeeper"],
  ages: ["Any Age", "U15", "U17", "U19", "U21", "Senior"],
  sort: ["Rating (High to Low)", "Goals (High to Low)", "Matches (High to Low)"]
};

export default function ScoutEngine() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeRole, setActiveRole] = useState("All Roles");
  const [activeSort, setActiveSort] = useState("Rating (High to Low)");

  const filteredPlayers = mockPlayers.filter(p => {
    if (activeRole !== "All Roles" && !p.position.includes(activeRole)) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 font-inter pb-20">
      
      {/* ═══ HEADER ═══ */}
      <div className="bg-[#22C55E] text-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bebas text-xl tracking-widest flex items-center gap-2">
            <span>⚽</span> FOOT HEROES
          </Link>
          <div className="text-[0.65rem] font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">
            Scout Engine
          </div>
        </div>
        
        {/* Search Bar Area */}
        <div className="max-w-3xl mx-auto px-4 pb-4">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search players by name or location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 text-sm rounded-lg pl-10 pr-12 py-3 outline-none shadow-inner placeholder:text-gray-400 dark:placeholder:text-gray-500 border border-transparent focus:border-white/20 transition-colors"
            />
            <button 
              onClick={() => setShowFilters(true)}
              className="absolute right-2 p-1.5 text-gray-400 hover:text-[#22C55E] transition-colors"
            >
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ ACTIVE FILTERS BAR (Desktop/Tablet) ═══ */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-[104px] z-40 hidden sm:block">
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center gap-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filters:</span>
          <select 
            value={activeRole} 
            onChange={(e) => setActiveRole(e.target.value)}
            className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md px-3 py-1.5 outline-none cursor-pointer"
          >
            {FILTERS.roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select 
            value={activeSort} 
            onChange={(e) => setActiveSort(e.target.value)}
            className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md px-3 py-1.5 outline-none cursor-pointer"
          >
            {FILTERS.sort.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* ═══ MOBILE FILTER MODAL ═══ */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 sm:hidden flex flex-col justify-end"
            onClick={() => setShowFilters(false)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-gray-900 rounded-t-2xl p-5"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-50">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X size={20} /></button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Position</label>
                  <div className="flex flex-wrap gap-2">
                    {FILTERS.roles.map(r => (
                      <button 
                        key={r}
                        onClick={() => setActiveRole(r)}
                        className={`text-xs font-semibold px-4 py-2 rounded-full border ${activeRole === r ? "bg-[#22C55E] text-white border-[#22C55E]" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800"}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sort By</label>
                  <div className="grid grid-cols-1 gap-2">
                    {FILTERS.sort.map(s => (
                      <button 
                        key={s}
                        onClick={() => setActiveSort(s)}
                        className={`text-sm font-semibold px-4 py-3 rounded-lg border text-left flex justify-between items-center ${activeSort === s ? "bg-[#22C55E]/5 dark:bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800"}`}
                      >
                        {s}
                        {activeSort === s && <CheckCircle2 size={16} className="text-[#22C55E]" />}
                      </button>
                    ))}
                  </div>
                </div>
                <Button 
                  onClick={() => setShowFilters(false)}
                  className="w-full"
                >
                  Show Results
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto p-4">
        
        {/* Results Info */}
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Showing {filteredPlayers.length} players</span>
          <button className="text-xs font-bold text-[#22C55E] sm:hidden flex items-center gap-1" onClick={() => setShowFilters(true)}>
            <Filter size={12} /> Filters
          </button>
        </div>

        {/* ═══ PLAYER FEED ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlayers.map((p) => {
            const team = p.currentTeamId ? mockTeams.find(t => t.id === p.currentTeamId) : null;
            return <PlayerCard key={p.id} player={p} teamName={team?.name} isScoutView={true} />;
          })}
        </div>
      </div>
    </div>
  );
}
