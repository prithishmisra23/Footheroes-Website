"use client";

import { motion } from "framer-motion";
import { History, Share2, Award, Zap } from "lucide-react";
import Image from "next/image";

export function VisionSection() {
  return (
    <section className="bg-[#111111] py-24 sm:py-32 overflow-hidden border-y border-stone-800">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD166]">
              The Long-Term Vision
            </p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl text-white leading-tight">
              Your Football Journey, <br />
              <span className="text-stone-400">Tracked Forever.</span>
            </h2>
            <p className="mt-6 text-lg text-stone-300">
              Imagine looking back in 5 years and seeing every goal, every assist, and every team you played for. We are building the permanent digital home for your amateur football career.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1 h-10 w-10 rounded-full bg-[#171717] flex items-center justify-center border border-stone-800">
                  <History size={18} className="text-[#F75A0A]" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Historical Record</h4>
                  <p className="text-sm text-stone-400 mt-1">A verifiable record of all your appearances across different local leagues and tournaments.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1 h-10 w-10 rounded-full bg-[#171717] flex items-center justify-center border border-stone-800">
                  <Share2 size={18} className="text-[#FFD166]" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Shareable CV</h4>
                  <p className="text-sm text-stone-400 mt-1">Moving to a new city? Share your Foot Heroes profile to easily find a team that matches your level.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1 h-10 w-10 rounded-full bg-[#171717] flex items-center justify-center border border-stone-800">
                  <Award size={18} className="text-[#F75A0A]" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Unlock Achievements</h4>
                  <p className="text-sm text-stone-400 mt-1">Earn digital badges for milestones like 50 goals, hat-tricks, or winning your local division.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-[#F75A0A]/20 to-[#FFD166]/20 blur-3xl" />
            <div className="rounded-[2rem] border-2 border-stone-800 bg-[#171717] p-8 relative overflow-hidden shadow-2xl">
              
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Zap size={140} />
              </div>

              <div className="flex items-center gap-5 border-b border-stone-800/50 pb-6">
                <div className="h-16 w-16 rounded-full bg-white border-2 border-stone-600 flex items-center justify-center overflow-hidden shrink-0">
                  <Image 
                    src="/foot-heroes-logo.png" 
                    alt="Foot Heroes" 
                    width={64} 
                    height={64} 
                    className="h-full w-full object-contain p-1" 
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Career Overview</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-[#FFD166]/10 text-[#FFD166] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border border-[#FFD166]/20">Pro Member</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6 relative z-10">
                <div className="bg-[#222222] rounded-2xl p-5 border border-stone-800/50">
                  <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest mb-1">Goals</p>
                  <p className="text-4xl font-bold text-white">142</p>
                </div>
                <div className="bg-[#222222] rounded-2xl p-5 border border-stone-800/50">
                  <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest mb-1">Matches</p>
                  <p className="text-4xl font-bold text-white">205</p>
                </div>
                <div className="bg-[#222222] rounded-2xl p-5 border border-stone-800/50">
                  <p className="text-[11px] font-bold text-[#FFD166]/70 uppercase tracking-widest mb-1">Trophies</p>
                  <p className="text-4xl font-bold text-[#FFD166]">8</p>
                </div>
                <div className="bg-[#222222] rounded-2xl p-5 border border-stone-800/50">
                  <p className="text-[11px] font-bold text-[#F75A0A]/70 uppercase tracking-widest mb-1">MOTM</p>
                  <p className="text-4xl font-bold text-[#F75A0A]">24</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-stone-800/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">City Ranking</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD166]">Top 5%</span>
                </div>
                <div className="h-2 w-full bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                  <div className="h-full bg-gradient-to-r from-[#F75A0A] to-[#FFD166] w-[95%]" />
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>

      </div>
    </section>
  );
}
