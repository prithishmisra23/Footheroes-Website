"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import type { MatchEventType } from "@/types";

import { mockMatches, MatchEvent } from "@/mock/matches";
import { mockTeams } from "@/mock/teams";
import { mockPlayers } from "@/mock/players";
import { queueEvent, removeEventFromQueue, syncQueue } from "@/lib/offline/matchQueue";

import { GoalEventModal } from "@/components/modals/GoalEventModal";
import { CardEventModal } from "@/components/modals/CardEventModal";
import { SubEventModal } from "@/components/modals/SubEventModal";

export default function MatchScorePage({ params }: { params: { id: string } }) {
  const match = mockMatches.find(m => m.id === params.id);
  const currentMatch = match || mockMatches[0];

  const homeTeam = mockTeams.find(t => t.id === currentMatch.homeTeamId)!;
  const awayTeam = mockTeams.find(t => t.id === currentMatch.awayTeamId)!;

  const homePlayers = mockPlayers.filter(p => p.currentTeamId === homeTeam.id);
  const awayPlayers = mockPlayers.filter(p => p.currentTeamId === awayTeam.id);
  const currentMinute = currentMatch.currentMinute || "1";

  // States
  const [events, setEvents] = useState<MatchEvent[]>(currentMatch.events || []);
  const [homeScore, setHomeScore] = useState(currentMatch.homeScore);
  const [awayScore, setAwayScore] = useState(currentMatch.awayScore);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => { setIsOffline(false); syncQueue(); };
    const handleOffline = () => setIsOffline(true);
    
    setIsOffline(!navigator.onLine);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Modals state
  const [activeModal, setActiveModal] = useState<"none" | "goal" | "card" | "sub" | "other">("none");
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [eventType, setEventType] = useState<MatchEvent["type"] | null>(null);

  const isHome = (teamId: string) => teamId === homeTeam.id;

  const handleAddEvent = (event: Omit<MatchEvent, "id">) => {
    const queuedEvent = queueEvent(currentMatch.id, event);
    const newEvent = { ...event, id: queuedEvent.localId };
    setEvents(prev => [...prev, newEvent]);
    
    // Optimistic UI updates
    if (event.type === "GOAL") {
      if (isHome(event.teamId)) setHomeScore(s => s + 1);
      else setAwayScore(s => s + 1);
    }
    
    // Close modal
    setActiveModal("none");
    setActiveTeamId(null);
    setEventType(null);
    
    if (!isOffline) {
      syncQueue();
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    // If it's a local event, remove from offline queue
    if (eventId.startsWith("local-")) {
      removeEventFromQueue(eventId);
    }
    
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    setEvents(prev => prev.filter(e => e.id !== eventId));
    
    if (event.type === "GOAL") {
      if (isHome(event.teamId)) setHomeScore(s => s - 1);
      else setAwayScore(s => s - 1);
    }
  };

  const openModal = (teamId: string, type: MatchEvent["type"]) => {
    setActiveTeamId(teamId);
    setEventType(type);
    
    if (type === "GOAL") setActiveModal("goal");
    else if (type === "YELLOW_CARD" || type === "RED_CARD") setActiveModal("card");
    else if (type === "SUBSTITUTION") setActiveModal("sub");
    else setActiveModal("other");
  };

  const getPlayerName = (id?: string) => {
    if (!id) return "";
    return mockPlayers.find(p => p.id === id)?.name || "Unknown";
  };

  return (
    <div className="min-h-screen bg-[#0A1628] text-white font-inter flex flex-col">
      {/* ═══ HEADER ═══ */}
      <div className="bg-[#111D35] border-b border-[#1E3A5F] p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href={`/match/${currentMatch.id}`} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
             <span className="font-bebas text-xl tracking-wider leading-none">SCORE MATCH</span>
             <span className="text-xs text-[#94A3B8] font-mono flex items-center gap-1.5 mt-1">
               <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
               LIVE • {currentMinute}'
             </span>
          </div>
        </div>
        <button className="bg-[#EF4444] text-white font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded hover:bg-red-600 transition-colors">
          End Match
        </button>
      </div>

      {/* ═══ OFFLINE BANNER ═══ */}
      <AnimatePresence>
        {isOffline && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-yellow-500 text-yellow-950 font-bold text-xs text-center py-2 px-4 shadow-inner"
          >
            ⚠️ Offline mode — Events will sync automatically when reconnected
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ BIG SCOREBOARD ═══ */}
      <div className="p-4 sm:p-6 pb-2">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Home */}
          <div className="flex-1 flex flex-col items-center">
             <span className="font-bold text-base sm:text-lg mb-2 truncate max-w-full">{homeTeam.shortName}</span>
             <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1A2B48] rounded-xl flex items-center justify-center border border-[#1E3A5F]">
               {homeTeam.logoUrl ? <img src={homeTeam.logoUrl} alt={homeTeam.shortName} className="w-12 h-12 object-contain" /> : <span className="font-bebas text-xl text-[#94A3B8]">{homeTeam.shortName}</span>}
             </div>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center justify-center px-4">
             <div className="bg-[#050B14] px-4 py-2 rounded-lg border border-[#1E3A5F] flex items-center gap-4">
                <span className="font-mono text-4xl font-bold text-white tabular-nums">{homeScore}</span>
                <span className="text-[#94A3B8] font-mono text-2xl">-</span>
                <span className="font-mono text-4xl font-bold text-white tabular-nums">{awayScore}</span>
             </div>
          </div>

          {/* Away */}
          <div className="flex-1 flex flex-col items-center">
             <span className="font-bold text-base sm:text-lg mb-2 truncate max-w-full">{awayTeam.shortName}</span>
             <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1A2B48] rounded-xl flex items-center justify-center border border-[#1E3A5F]">
               {awayTeam.logoUrl ? <img src={awayTeam.logoUrl} alt={awayTeam.shortName} className="w-12 h-12 object-contain" /> : <span className="font-bebas text-xl text-[#94A3B8]">{awayTeam.shortName}</span>}
             </div>
          </div>
        </div>
      </div>

      {/* ═══ QUICK EVENT GRID ═══ */}
      <div className="p-4 mt-2 max-w-lg mx-auto w-full">
        {/* Massive Goal Button */}
        <button 
          onClick={() => { setActiveModal("goal"); setEventType("GOAL"); setActiveTeamId(null); }}
          className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl py-6 mb-4 font-bebas text-3xl tracking-widest flex items-center justify-center gap-3 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] transition-transform active:scale-95"
        >
          ⚽ GOAL
        </button>

        <div className="grid grid-cols-2 gap-4">
           {/* Home Controls */}
           <div className="space-y-3">
              <div className="text-center font-bold text-sm text-[#94A3B8] mb-2">{homeTeam.shortName}</div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => openModal(homeTeam.id, "YELLOW_CARD")} className="bg-[#1A2B48] border border-[#1E3A5F] rounded-lg py-3 flex justify-center hover:bg-[#111D35] active:scale-95"><div className="w-4 h-5 bg-yellow-400 rounded-sm" /></button>
                <button onClick={() => openModal(homeTeam.id, "RED_CARD")} className="bg-[#1A2B48] border border-[#1E3A5F] rounded-lg py-3 flex justify-center hover:bg-[#111D35] active:scale-95"><div className="w-4 h-5 bg-red-500 rounded-sm" /></button>
                <button onClick={() => openModal(homeTeam.id, "SUBSTITUTION")} className="bg-[#1A2B48] border border-[#1E3A5F] rounded-lg py-3 flex justify-center hover:bg-[#111D35] active:scale-95 text-lg">🔄</button>
                <button onClick={() => openModal(homeTeam.id, "CORNER")} className="bg-[#1A2B48] border border-[#1E3A5F] rounded-lg py-3 flex justify-center hover:bg-[#111D35] active:scale-95 text-lg">📍</button>
              </div>
           </div>
           
           {/* Away Controls */}
           <div className="space-y-3">
              <div className="text-center font-bold text-sm text-[#94A3B8] mb-2">{awayTeam.shortName}</div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => openModal(awayTeam.id, "YELLOW_CARD")} className="bg-[#1A2B48] border border-[#1E3A5F] rounded-lg py-3 flex justify-center hover:bg-[#111D35] active:scale-95"><div className="w-4 h-5 bg-yellow-400 rounded-sm" /></button>
                <button onClick={() => openModal(awayTeam.id, "RED_CARD")} className="bg-[#1A2B48] border border-[#1E3A5F] rounded-lg py-3 flex justify-center hover:bg-[#111D35] active:scale-95"><div className="w-4 h-5 bg-red-500 rounded-sm" /></button>
                <button onClick={() => openModal(awayTeam.id, "SUBSTITUTION")} className="bg-[#1A2B48] border border-[#1E3A5F] rounded-lg py-3 flex justify-center hover:bg-[#111D35] active:scale-95 text-lg">🔄</button>
                <button onClick={() => openModal(awayTeam.id, "CORNER")} className="bg-[#1A2B48] border border-[#1E3A5F] rounded-lg py-3 flex justify-center hover:bg-[#111D35] active:scale-95 text-lg">📍</button>
              </div>
           </div>
        </div>
      </div>

      {/* ═══ EVENTS TICKER ═══ */}
      <div className="flex-1 bg-[#111D35] rounded-t-3xl p-4 sm:p-6 overflow-hidden flex flex-col mt-4">
        <h3 className="font-bebas text-xl mb-4 text-[#94A3B8]">MATCH LOG</h3>
        <div className="flex-1 overflow-y-auto space-y-3 pb-20">
           {events.length === 0 ? (
             <div className="text-center text-[#94A3B8] text-sm py-8">No events recorded yet.</div>
           ) : (
             events.sort((a,b) => b.minute - a.minute).map(event => (
               <div key={event.id} className="bg-[#1A2B48] rounded-xl p-3 flex items-center justify-between border border-[#1E3A5F]">
                 <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#111D35] flex flex-col items-center justify-center shrink-0">
                      <span className="text-[0.6rem] font-bold text-[#94A3B8] uppercase">MIN</span>
                      <span className="font-mono font-bold leading-none">{event.minute}'</span>
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2">
                         <span className="text-lg">
                           {event.type === "GOAL" && "⚽"}
                           {event.type === "YELLOW_CARD" && "🟨"}
                           {event.type === "RED_CARD" && "🟥"}
                           {event.type === "SUBSTITUTION" && "🔄"}
                           {event.type === "CORNER" && "📍"}
                         </span>
                         <span className="font-bold text-sm truncate">
                           {event.type === "GOAL" && `GOAL - ${getPlayerName(event.playerId)}`}
                           {event.type === "YELLOW_CARD" && `Yellow - ${getPlayerName(event.playerId)}`}
                           {event.type === "RED_CARD" && `Red - ${getPlayerName(event.playerId)}`}
                           {event.type === "SUBSTITUTION" && `Sub - ${getPlayerName(event.playerId)} on`}
                           {event.type === "CORNER" && `Corner - ${isHome(event.teamId) ? homeTeam.shortName : awayTeam.shortName}`}
                         </span>
                       </div>
                       {event.assistPlayerId && (
                         <div className="text-xs text-[#94A3B8] mt-0.5 truncate">Assist: {getPlayerName(event.assistPlayerId)}</div>
                       )}
                       {event.type === "GOAL" && (
                         <div className="text-xs font-bold text-[#22C55E] mt-0.5">Score updated</div>
                       )}
                    </div>
                 </div>
                 <button 
                   onClick={() => handleDeleteEvent(event.id)}
                   className="p-2 text-[#94A3B8] hover:text-[#EF4444] transition-colors shrink-0"
                 >
                   <X size={18} />
                 </button>
               </div>
             ))
           )}
        </div>
      </div>
      
      {/* Modals will go here, conditionally rendered */}
      <GoalEventModal 
        isOpen={activeModal === "goal"} 
        onClose={() => setActiveModal("none")} 
        teamId={activeTeamId} 
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homePlayers={homePlayers}
        awayPlayers={awayPlayers}
        onSubmit={(data) => handleAddEvent({ 
          matchId: currentMatch.id, 
          teamId: data.teamId, 
          eventType: "GOAL",
          type: "GOAL", 
          playerId: data.playerId, 
          assistPlayerId: data.assistPlayerId, 
          minute: data.minute, 
          isHomeTeam: isHome(data.teamId)
        })} 
        currentMinute={currentMinute.toString()} 
      />

      <CardEventModal 
        isOpen={activeModal === "card"} 
        onClose={() => setActiveModal("none")} 
        teamId={activeTeamId || homeTeam.id} 
        players={activeTeamId && isHome(activeTeamId) ? homePlayers : awayPlayers} 
        defaultType={eventType === "YELLOW_CARD" ? "YELLOW_CARD" : "RED_CARD"}
        onSubmit={(data) => handleAddEvent({ 
          matchId: currentMatch.id,
          teamId: activeTeamId || homeTeam.id,
          eventType: data.type as MatchEventType,
          type: data.type,
          playerId: data.playerId,
          minute: data.minute,
          isHomeTeam: activeTeamId ? isHome(activeTeamId) : true
        })} 
        currentMinute={currentMinute.toString()} 
      />

      <SubEventModal 
        isOpen={activeModal === "sub"} 
        onClose={() => setActiveModal("none")} 
        teamId={activeTeamId || homeTeam.id} 
        players={activeTeamId && isHome(activeTeamId) ? homePlayers : awayPlayers} 
        onSubmit={(data) => handleAddEvent({ 
          matchId: currentMatch.id,
          teamId: activeTeamId || homeTeam.id,
          eventType: "SUB_ON",
          type: "SUBSTITUTION",
          playerId: data.playerOnId,
          secondaryPlayerId: data.playerOffId,
          minute: data.minute,
          isHomeTeam: activeTeamId ? isHome(activeTeamId) : true
        })} 
        currentMinute={currentMinute.toString()} 
      />
      
    </div>
  );
}
