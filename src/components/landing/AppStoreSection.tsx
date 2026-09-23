"use client";

import { Smartphone } from "lucide-react";

export function AppStoreSection() {
  return (
    <section id="app-store" className="bg-black py-16 sm:py-20 border-y border-stone-800 text-center">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        
        <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD166]/30 bg-[#FFD166]/10 px-4 py-2 text-sm font-bold text-[#FFD166]">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD166] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFD166]"></span>
          </span>
          Coming Soon on iOS & Android
        </div>

        <h2 className="mt-8 font-serif text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
          Coming Soon <br className="sm:hidden" /> to your Pocket
        </h2>
        
        <p className="mt-6 text-stone-300 max-w-xl mx-auto text-lg">
          We are currently building the native iOS and Android applications. Register for early access to be notified the moment we launch on the app stores.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex h-14 w-48 items-center justify-center gap-3 rounded-xl border border-stone-700 bg-[#171717] opacity-60 cursor-not-allowed">
            <Smartphone size={24} className="text-white" />
            <div className="text-left">
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Coming Soon</p>
              <p className="text-sm font-bold text-white">App Store</p>
            </div>
          </div>
          
          <div className="flex h-14 w-48 items-center justify-center gap-3 rounded-xl border border-stone-700 bg-[#171717] opacity-60 cursor-not-allowed">
            <Smartphone size={24} className="text-white" />
            <div className="text-left">
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Coming Soon</p>
              <p className="text-sm font-bold text-white">Google Play</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
