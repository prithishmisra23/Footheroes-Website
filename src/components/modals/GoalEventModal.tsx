import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { Player, Team } from "@/types";

interface GoalEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId?: string | null;
  homeTeam: Team;
  awayTeam: Team;
  homePlayers: Player[];
  awayPlayers: Player[];
  onSubmit: (data: { teamId: string; playerId: string; assistPlayerId?: string; isPenalty: boolean; isOwnGoal: boolean; minute: number }) => void;
  currentMinute: string;
}

export function GoalEventModal({ isOpen, onClose, teamId, homeTeam, awayTeam, homePlayers, awayPlayers, onSubmit, currentMinute }: GoalEventModalProps) {
  const [step, setStep] = useState<0 | 1 | 2>(teamId ? 1 : 0); // 0: Team, 1: Scorer, 2: Assist & details
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teamId || "");
  const [playerId, setPlayerId] = useState<string>("");
  const [assistPlayerId, setAssistPlayerId] = useState<string>("");
  const [isPenalty, setIsPenalty] = useState(false);
  const [isOwnGoal, setIsOwnGoal] = useState(false);
  const [minute, setMinute] = useState(currentMinute);

  useEffect(() => {
    if (isOpen) {
      setStep(teamId ? 1 : 0);
      setSelectedTeamId(teamId || "");
      setPlayerId("");
      setAssistPlayerId("");
      setIsPenalty(false);
      setIsOwnGoal(false);
      setMinute(currentMinute);
    }
  }, [isOpen, teamId, currentMinute]);

  const reset = () => {
    setStep(teamId ? 1 : 0);
    setSelectedTeamId(teamId || "");
    setPlayerId("");
    setAssistPlayerId("");
    setIsPenalty(false);
    setIsOwnGoal(false);
    setMinute(currentMinute);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedTeamId || !playerId) return;
    onSubmit({
      teamId: selectedTeamId,
      playerId,
      assistPlayerId: assistPlayerId || undefined,
      isPenalty,
      isOwnGoal,
      minute: parseInt(minute) || parseInt(currentMinute) || 1,
    });
    handleClose();
  };

  const players = selectedTeamId === homeTeam.id ? homePlayers : awayPlayers;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-xl sm:rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-950">
            <h2 className="font-bebas text-2xl tracking-wide flex items-center gap-2 text-gray-900 dark:text-white">
              <span className="text-[#22C55E]">⚽ GOAL</span>
              <span className="text-gray-500 text-lg">- Step {step === 0 ? 1 : step}/2</span>
            </h2>
            <button onClick={handleClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full text-gray-500">
              <X size={20} />
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            {step === 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-500 text-sm uppercase">Which Team?</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => { setSelectedTeamId(homeTeam.id); setStep(1); }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center gap-4 hover:border-green-500 transition-colors"
                  >
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center p-2">
                       {homeTeam.logoUrl ? <img src={homeTeam.logoUrl} className="w-full h-full object-contain" /> : <span className="font-bebas text-xl">{homeTeam.shortName}</span>}
                    </div>
                    <div className="font-bold">{homeTeam.shortName}</div>
                  </button>
                  <button
                    onClick={() => { setSelectedTeamId(awayTeam.id); setStep(1); }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center gap-4 hover:border-green-500 transition-colors"
                  >
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center p-2">
                       {awayTeam.logoUrl ? <img src={awayTeam.logoUrl} className="w-full h-full object-contain" /> : <span className="font-bebas text-xl">{awayTeam.shortName}</span>}
                    </div>
                    <div className="font-bold">{awayTeam.shortName}</div>
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-500 text-sm uppercase">Who Scored?</h3>
                <div className="grid grid-cols-2 gap-2">
                  {players.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { setPlayerId(p.id); setStep(2); }}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        playerId === p.id
                          ? 'bg-green-50 dark:bg-green-500/10 border-green-500 text-green-700 dark:text-green-500'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                        {p.avatarUrl ? <img src={p.avatarUrl} className="w-full h-full object-cover" /> : p.name.charAt(0)}
                      </div>
                      <div className="truncate font-semibold text-sm">{p.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-500 text-sm uppercase">Assist? (Optional)</h3>
                  <select 
                    value={assistPlayerId} 
                    onChange={e => setAssistPlayerId(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 appearance-none"
                  >
                    <option value="">No Assist</option>
                    {players.filter(p => p.id !== playerId).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setIsPenalty(!isPenalty)}
                    className={`p-3 rounded-xl border font-bold text-sm transition-colors ${isPenalty ? 'bg-green-500/20 border-green-500 text-green-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}
                  >
                    Penalty
                  </button>
                  <button 
                    onClick={() => setIsOwnGoal(!isOwnGoal)}
                    className={`p-3 rounded-xl border font-bold text-sm transition-colors ${isOwnGoal ? 'bg-red-500/20 border-red-500 text-red-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}
                  >
                    Own Goal
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-gray-500 text-sm uppercase">Minute</h3>
                  <input 
                    type="number" 
                    value={minute} 
                    onChange={e => setMinute(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 font-mono text-xl"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex gap-3">
            {step === 2 && (
              <button 
                onClick={() => setStep(1)}
                className="px-6 py-4 rounded-xl bg-gray-200 dark:bg-gray-800 font-bold text-gray-700 dark:text-gray-200 uppercase"
              >
                Back
              </button>
            )}
            <button 
              onClick={step === 1 ? () => { if(playerId) setStep(2) } : handleSubmit}
              disabled={step === 1 && !playerId}
              className={`flex-1 py-4 rounded-xl font-bebas text-2xl tracking-wider flex items-center justify-center gap-2 ${
                (step === 1 && playerId) || step === 2 
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
            >
              {step === 1 ? 'Next' : 'SUBMIT EVENT'}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
