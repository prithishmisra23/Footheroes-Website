import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowDown, ArrowUp } from "lucide-react";
import { Player } from "@/types";

interface SubEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  players: Player[];
  onSubmit: (data: { playerOffId: string; playerOnId: string; minute: number }) => void;
  currentMinute: string;
}

export function SubEventModal({ isOpen, onClose, teamId, players, onSubmit, currentMinute }: SubEventModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [playerOffId, setPlayerOffId] = useState<string>("");
  const [playerOnId, setPlayerOnId] = useState<string>("");
  const [minute, setMinute] = useState(currentMinute);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPlayerOffId("");
      setPlayerOnId("");
      setMinute(currentMinute);
    }
  }, [isOpen, currentMinute]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    if (!playerOffId || !playerOnId) return;
    onSubmit({
      playerOffId,
      playerOnId,
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
          className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-xl sm:rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-950">
            <h2 className="font-bebas text-2xl tracking-wide flex items-center gap-2">
              <span className="text-gray-900 dark:text-white flex items-center gap-2">🔄 SUBSTITUTION</span>
              <span className="text-gray-500 text-lg">- Step {step}/2</span>
            </h2>
            <button onClick={handleClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full text-gray-500">
              <X size={20} />
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-bold text-[#EF4444] text-sm uppercase flex items-center gap-1"><ArrowDown size={16}/> Who is coming OFF?</h3>
                <div className="grid grid-cols-2 gap-2">
                  {players.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { setPlayerOffId(p.id); setStep(2); }}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-500 transition-colors text-left"
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
                <div className="space-y-4">
                  <h3 className="font-bold text-[#22C55E] text-sm uppercase flex items-center gap-1"><ArrowUp size={16}/> Who is coming ON?</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {players.filter(p => p.id !== playerOffId).map(p => (
                      <button
                        key={p.id}
                        onClick={() => setPlayerOnId(p.id)}
                        className={`bg-white dark:bg-gray-800 border rounded-xl p-3 flex items-center gap-3 transition-colors text-left ${playerOnId === p.id ? 'border-green-500 bg-green-50 dark:bg-green-500/10' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                      >
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                          {p.avatarUrl ? <img src={p.avatarUrl} className="w-full h-full object-cover" /> : p.name.charAt(0)}
                        </div>
                        <div className="truncate font-semibold text-sm">{p.name}</div>
                      </button>
                    ))}
                  </div>
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
              onClick={step === 1 ? () => { if(playerOffId) setStep(2) } : handleSubmit}
              disabled={(step === 1 && !playerOffId) || (step === 2 && !playerOnId)}
              className={`flex-1 py-4 rounded-xl font-bebas text-2xl tracking-wider flex items-center justify-center gap-2 ${
                (step === 1 && playerOffId) || (step === 2 && playerOnId)
                ? 'bg-blue-600 text-white hover:bg-blue-700'
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
