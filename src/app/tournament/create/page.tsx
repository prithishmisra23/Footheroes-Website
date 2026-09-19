"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, ChevronLeft, Upload, Trophy, MapPin, Calendar, Clock, DollarSign, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/Button";

type TournamentFormat = "LEAGUE" | "KNOCKOUT" | "GROUP_KNOCKOUT";
type PlayerFormat = "5v5" | "7v7" | "11v11";

interface WizardState {
  name: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  
  format: TournamentFormat;
  matchesPerTeam: number;
  playerFormat: PlayerFormat;
  
  entryFee: number;
  registrationDeadline: string;
  maxTeams: number;
  prizePool: number;
  
  matchDuration: number;
  pointsForWin: number;
  pointsForDraw: number;
  subsAllowed: number;
}

const STEPS = [
  { id: 1, title: "Basic Info", icon: Trophy },
  { id: 2, title: "Format", icon: Settings },
  { id: 3, title: "Registration", icon: DollarSign },
  { id: 4, title: "Rules", icon: Clock },
  { id: 5, title: "Review", icon: Check },
];

export default function CreateTournamentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<WizardState>({
    name: "",
    city: "",
    state: "",
    startDate: "",
    endDate: "",
    
    format: "LEAGUE",
    matchesPerTeam: 3,
    playerFormat: "11v11",
    
    entryFee: 0,
    registrationDeadline: "",
    maxTeams: 16,
    prizePool: 0,
    
    matchDuration: 90,
    pointsForWin: 3,
    pointsForDraw: 1,
    subsAllowed: 5,
  });

  const updateField = (field: keyof WizardState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    // Basic validation per step
    if (currentStep === 1 && (!formData.name || !formData.city || !formData.state || !formData.startDate || !formData.endDate)) {
      setError("Please fill out all basic information fields.");
      return;
    }
    if (currentStep === 3 && !formData.registrationDeadline) {
      setError("Please provide a registration deadline.");
      return;
    }

    setError(null);
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tournament/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.errors?.[0]?.message || "Failed to create tournament");
      }

      // Redirect to the organizer dashboard
      router.push(`/tournament/${data.slug}/manage`);
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 font-inter py-8 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-bebas text-4xl tracking-wider text-[#22C55E]">CREATE TOURNAMENT</h1>
          <p className="text-gray-500 dark:text-gray-400">Set up your tournament in 5 easy steps.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-10" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#22C55E] -z-10 transition-all duration-300"
            style={{ width: `\${((currentStep - 1) / 4) * 100}%` }}
          />
          
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors \${
                    isActive ? "bg-[#22C55E] text-white ring-4 ring-[#22C55E]/20" : 
                    isCompleted ? "bg-[#22C55E] text-white" : 
                    "bg-gray-200 dark:bg-gray-800 text-gray-400"
                  }`}
                >
                  {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                </div>
                <span className={`text-xs font-semibold hidden sm:block \${isActive ? "text-[#22C55E]" : "text-gray-400"}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 sm:p-8">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-semibold flex items-center gap-2">
              <Check className="rotate-45" size={16} /> {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* ═══ STEP 1: BASIC INFO ═══ */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 border-b border-gray-100 dark:border-gray-800 pb-2">1. Basic Information</h2>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Tournament Name *</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="e.g., Summer Super League"
                      className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22C55E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">City *</label>
                      <input 
                        type="text" 
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        placeholder="e.g., Mumbai"
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22C55E]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">State *</label>
                      <input 
                        type="text" 
                        value={formData.state}
                        onChange={(e) => updateField("state", e.target.value)}
                        placeholder="e.g., Maharashtra"
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22C55E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Start Date *</label>
                      <input 
                        type="date" 
                        value={formData.startDate}
                        onChange={(e) => updateField("startDate", e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22C55E]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">End Date *</label>
                      <input 
                        type="date" 
                        value={formData.endDate}
                        onChange={(e) => updateField("endDate", e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22C55E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Tournament Logo (Optional)</label>
                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-950/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer">
                      <Upload size={24} className="mb-2" />
                      <span className="text-sm font-semibold">Click to upload logo</span>
                      <span className="text-xs mt-1">PNG, JPG up to 2MB</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ STEP 2: FORMAT ═══ */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 border-b border-gray-100 dark:border-gray-800 pb-2">2. Format & Structure</h2>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Tournament Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "LEAGUE", label: "League", desc: "Round robin format" },
                        { id: "KNOCKOUT", label: "Knockout", desc: "Single elimination" },
                        { id: "GROUP_KNOCKOUT", label: "Group + Knockout", desc: "Groups followed by playoffs" }
                      ].map(type => (
                        <div 
                          key={type.id}
                          onClick={() => updateField("format", type.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-colors \${
                            formData.format === type.id 
                              ? "border-[#22C55E] bg-[#22C55E]/10" 
                              : "border-gray-200 dark:border-gray-800 hover:border-[#22C55E]/50"
                          }`}
                        >
                          <div className="font-bold text-sm mb-1">{type.label}</div>
                          <div className="text-xs text-gray-500">{type.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Player Format</label>
                      <select 
                        value={formData.playerFormat}
                        onChange={(e) => updateField("playerFormat", e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22C55E]"
                      >
                        <option value="5v5">5v5</option>
                        <option value="7v7">7v7</option>
                        <option value="11v11">11v11</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Matches per team (Guaranteed)</label>
                      <input 
                        type="number" 
                        value={formData.matchesPerTeam}
                        onChange={(e) => updateField("matchesPerTeam", parseInt(e.target.value))}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22C55E]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ STEP 3: REGISTRATION ═══ */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 border-b border-gray-100 dark:border-gray-800 pb-2">3. Registration & Fees</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Max Teams Allowed</label>
                      <input 
                        type="number" 
                        value={formData.maxTeams}
                        onChange={(e) => updateField("maxTeams", parseInt(e.target.value))}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22C55E]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Registration Deadline *</label>
                      <input 
                        type="date" 
                        value={formData.registrationDeadline}
                        onChange={(e) => updateField("registrationDeadline", e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22C55E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Entry Fee (₹)</label>
                      <input 
                        type="number" 
                        value={formData.entryFee}
                        onChange={(e) => updateField("entryFee", parseInt(e.target.value))}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22C55E]"
                      />
                      <p className="text-xs text-gray-500 mt-1">Set to 0 if free</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Total Prize Pool (₹)</label>
                      <input 
                        type="number" 
                        value={formData.prizePool}
                        onChange={(e) => updateField("prizePool", parseInt(e.target.value))}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22C55E]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ STEP 4: RULES ═══ */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 border-b border-gray-100 dark:border-gray-800 pb-2">4. Match Rules</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Match Duration (mins)</label>
                      <input 
                        type="number" 
                        value={formData.matchDuration}
                        onChange={(e) => updateField("matchDuration", parseInt(e.target.value))}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22C55E]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Substitutions Allowed</label>
                      <input 
                        type="number" 
                        value={formData.subsAllowed}
                        onChange={(e) => updateField("subsAllowed", parseInt(e.target.value))}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22C55E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Points for Win</label>
                      <input 
                        type="number" 
                        value={formData.pointsForWin}
                        onChange={(e) => updateField("pointsForWin", parseInt(e.target.value))}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22C55E]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Points for Draw</label>
                      <input 
                        type="number" 
                        value={formData.pointsForDraw}
                        onChange={(e) => updateField("pointsForDraw", parseInt(e.target.value))}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22C55E]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ STEP 5: REVIEW ═══ */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 border-b border-gray-100 dark:border-gray-800 pb-2">5. Review & Launch</h2>
                  
                  <div className="bg-gray-50 dark:bg-gray-950 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                    <h3 className="font-bebas text-2xl mb-4 text-[#22C55E]">{formData.name}</h3>
                    
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div>
                        <span className="text-gray-500 block mb-1">Location</span>
                        <span className="font-semibold">{formData.city}, {formData.state}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">Dates</span>
                        <span className="font-semibold">{formData.startDate} to {formData.endDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">Format</span>
                        <span className="font-semibold">{formData.format} ({formData.playerFormat})</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">Max Teams</span>
                        <span className="font-semibold">{formData.maxTeams} Teams</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">Entry Fee</span>
                        <span className="font-semibold">₹{formData.entryFee}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">Match Rules</span>
                        <span className="font-semibold">{formData.matchDuration} mins, {formData.subsAllowed} subs</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center">
                    By clicking Launch, your tournament will be live and open for team registrations.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1 || loading}
              className="gap-2"
            >
              <ChevronLeft size={16} /> Back
            </Button>
            
            {currentStep < 5 ? (
              <Button onClick={nextStep} className="gap-2">
                Continue <ChevronRight size={16} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white">
                {loading ? "Launching..." : "Launch Tournament"} <Check size={16} />
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

