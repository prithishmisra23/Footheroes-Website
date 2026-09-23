"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, CalendarDays, Trophy, Users, User, Shield, ArrowRight } from "lucide-react";

import { InteractivePhoneDemo } from "./InteractivePhoneDemo";

export function ProductPreviewSection() {
  const [activeTab, setActiveTab] = useState<"home" | "matches" | "stats" | "teams" | "profile">("home");

  const tabs = [
    { id: "home", label: "Home", icon: <Activity size={18} /> },
    { id: "matches", label: "Matches", icon: <CalendarDays size={18} /> },
    { id: "stats", label: "Stats", icon: <Trophy size={18} /> },
    { id: "teams", label: "Teams", icon: <Shield size={18} /> },
    { id: "profile", label: "Profile", icon: <User size={18} /> },
  ] as const;

  return (
    <section id="app-preview" className="bg-[#111111] py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F75A0A]">
            Product Preview
          </p>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl text-white leading-tight">
            See The App in Action
          </h2>
          <p className="mt-4 text-lg text-stone-400">
            A sneak peek at the experience we are building for the football community.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 xl:gap-24">
          
          {/* External Controls */}
          <div className="w-full lg:w-auto -mx-5 px-5 lg:mx-0 lg:px-0">
            <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto pb-6 lg:pb-0 scrollbar-hide snap-x snap-mandatory">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-4 px-6 py-5 rounded-2xl transition-all whitespace-nowrap min-w-[140px] snap-center outline-none ${
                    activeTab === tab.id 
                      ? "bg-[#252525] text-white border-2 border-stone-600 shadow-xl" 
                      : "text-stone-400 hover:text-stone-200 hover:bg-[#1f1f1f] border-2 border-transparent"
                  }`}
                >
                  <div className={`${activeTab === tab.id ? "text-[#F75A0A]" : "opacity-60"}`}>
                    {tab.icon}
                  </div>
                  <span className={`text-lg ${activeTab === tab.id ? "font-bold" : "font-medium"}`}>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div layoutId="active-indicator" className="ml-auto hidden lg:block">
                      <ArrowRight size={20} className="text-[#FFD166]" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Unified Phone Mockup */}
          <div className="w-full max-w-[360px] sm:max-w-[400px] lg:w-[420px] lg:max-w-none shrink-0 relative">
            <div className="absolute -inset-4 rounded-[4rem] bg-gradient-to-b from-[#F75A0A] to-[#FFD166] opacity-10 blur-3xl" />
            <InteractivePhoneDemo activeTab={activeTab} showBottomNav={false} />
          </div>

        </div>
      </div>
    </section>
  );
}
