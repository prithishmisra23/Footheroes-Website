"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { InteractivePhoneDemo } from "./InteractivePhoneDemo";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden min-h-screen flex items-center pt-24 pb-16">
      {/* Background Video */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        preload="metadata" 
        className="absolute inset-0 -z-20 h-full w-full object-cover" 
        aria-hidden="true"
      >
        <source src="/foot-heroes-hero.mp4" type="video/mp4" />
      </video>
      
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 -z-10 bg-black/50" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-600 bg-stone-800/80 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-stone-200">
            <ShieldCheck size={14} className="text-[#FFD166]" /> 
            INDIA&apos;S GRASSROOTS FOOTBALL NETWORK
          </div>
          
          <h1 className="mt-7 font-serif text-5xl leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl text-white">
            Every match.<br />
            <span className="text-[#FFD166]">Every player.</span><br />
            One football story.
          </h1>
          
          <p className="mt-6 max-w-xl text-base leading-7 text-stone-300 sm:text-lg">
            Manage matches, players, teams, scores, stats, and tournaments from one platform. The professional tracking experience your grassroots game deserves.
          </p>
          
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href="#early-access" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F75A0A] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#F75A0A]/20 transition-all hover:bg-[#D94801] hover:shadow-xl hover:-translate-y-0.5">
              Join Early Access <ArrowRight size={18} />
            </a>
            <a href="#app-store" className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-500/50 bg-stone-800/40 backdrop-blur-md px-6 py-3.5 font-bold text-white hover:bg-stone-800/60 transition-all">
              <span className="h-2 w-2 rounded-full bg-[#FFD166] animate-pulse" />
              App Coming Soon
            </a>
          </div>
          
          <p className="mt-6 text-xs text-stone-400 font-medium tracking-wide uppercase">
            Available soon on iOS & Android
          </p>
        </motion.div>

        {/* Right Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="hidden lg:block lg:ml-auto w-full max-w-[380px] xl:max-w-[400px] shrink-0"
        >
          <InteractivePhoneDemo />
        </motion.div>
        
        {/* Mobile Phone Mockup (Visible only on smaller screens) */}
        <div className="lg:hidden mt-8 w-full max-w-[380px] mx-auto shrink-0 relative z-10">
          <InteractivePhoneDemo />
        </div>

      </div>
    </section>
  );
}
