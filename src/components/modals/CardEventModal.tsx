import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Player } from "@/types";

interface CardEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  players: Player[];
  defaultType: "YELLOW_CARD" | "RED_CARD";
  onSubmit: (data: { playerId: string; type: "YELLOW_CARD" | "RED_CARD" | "SECOND_YELLOW"; minute: number }) => void;
  currentMinute: string;
}

export function CardEventModal({ isOpen, onClose, teamId, players, defaultType, onSubmit, currentMinute }: CardEventModalProps) {
  const [playerId, setPlayerId] = useState<string>("");
  const [type, setType] = useState<"YELLOW_CARD" | "RED_CARD" | "SECOND_YELLOW">(defaultType);
  const [minute, setMinute] = useState(currentMinute);

  useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      setMinute(currentMinute);
      setPlayerId("");
    }
  }, [isOpen, defaultType, currentMinute]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    if (!playerId) return;
    onSubmit({
      playerId,
      type,
      minute: parseInt(minute) || parseInt(currentMinute) || 1,
    });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-950">
            <h2 className="font-bebas text-2xl tracking-wide flex items-center gap-2 text-gray-900 dark:text-white">
              <span className={type === "YELLOW_CARD" ? "text-yellow-400" : "text-red-500"}>
                {type === "YELLOW_CARD" ? "🟨 YELLOW CARD" : "🟥 RED CARD"}
              </span>
            </h2>
            <button onClick={handleClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full text-gray-500">
              <X size={20} />
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1 space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-500 text-sm uppercase">Which Player?</h3>
              <div className="grid grid-cols-2 gap-2">
                {players.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPlayerId(p.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      playerId === p.id
                        ? type === "YELLOW_CARD" ? 'bg-yellow-50 border-yellow-500 text-yellow-700' : 'bg-red-50 border-red-500 text-red-700'
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

            <div className="grid grid-cols-3 gap-2">
               <button 
                 onClick={() => setType("YELLOW_CARD")}
                 className={`p-3 rounded-xl border font-bold text-xs uppercase transition-colors flex flex-col items-center gap-2 ${type === "YELLOW_CARD" ? 'bg-yellow-50 border-yellow-500 text-yellow-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}
               >
                 <div className="w-4 h-6 bg-yellow-400 rounded-sm" />
                 Yellow
               </button>
               <button 
                 onClick={() => setType("SECOND_YELLOW")}
                 className={`p-3 rounded-xl border font-bold text-xs uppercase transition-colors flex flex-col items-center gap-2 ${type === "SECOND_YELLOW" ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}
               >
                 <div className="flex gap-1"><div className="w-3 h-5 bg-yellow-400 rounded-sm" /><div className="w-3 h-5 bg-red-500 rounded-sm" /></div>
                 2nd Yellow
               </button>
               <button 
                 onClick={() => setType("RED_CARD")}
                 className={`p-3 rounded-xl border font-bold text-xs uppercase transition-colors flex flex-col items-center gap-2 ${type === "RED_CARD" ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}
               >
                 <div className="w-4 h-6 bg-red-500 rounded-sm" />
                 Red
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

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex gap-3">
            <button 
              onClick={handleSubmit}
              disabled={!playerId}
              className={`flex-1 py-4 rounded-xl font-bebas text-2xl tracking-wider flex items-center justify-center gap-2 ${
                playerId 
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
            >
              SUBMIT EVENT
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
