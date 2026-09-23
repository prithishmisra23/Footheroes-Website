import Image from "next/image";
import Link from "next/link";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { EcosystemSection } from "@/components/landing/EcosystemSection";
import { ProductPreviewSection } from "@/components/landing/ProductPreviewSection";
import { VisionSection } from "@/components/landing/VisionSection";
import { EarlyAccessSection } from "@/components/landing/EarlyAccessSection";
import { AppStoreSection } from "@/components/landing/AppStoreSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#171717] text-white selection:bg-[#F75A0A] selection:text-white">
      
      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/foot-heroes-logo.png" 
              alt="Foot Heroes logo" 
              width={48} 
              height={48} 
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-[#FFD166] bg-white object-cover" 
              priority 
            />
            <div>
              <p className="font-bebas text-xl sm:text-2xl tracking-[0.14em]">FOOT HEROES</p>
              <p className="text-[8px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FFD166]">The Football Network</p>
            </div>
          </Link>
          
          <nav className="hidden items-center gap-8 lg:flex">
            <a href="#features" className="text-sm font-semibold text-stone-300 hover:text-white transition-colors">Features</a>
            <a href="#app-preview" className="text-sm font-semibold text-stone-300 hover:text-white transition-colors">App Preview</a>
            <a href="#early-access" className="rounded-full border border-[#FFD166] bg-[#FFD166] px-5 py-2.5 text-sm font-bold text-black hover:bg-[#ffe09a] transition-colors shadow-lg shadow-[#FFD166]/20">
              Early access
            </a>
          </nav>
          
          <a href="#early-access" className="rounded-full bg-[#F75A0A] px-5 py-2.5 text-sm font-bold text-white lg:hidden shadow-lg shadow-[#F75A0A]/20">
            Register
          </a>
        </div>
      </header>

      <main>
        <HeroSection />
        <FeaturesSection />
        <EcosystemSection />
        <ProductPreviewSection />
        <VisionSection />
        <AppStoreSection />
        <EarlyAccessSection />
      </main>

      <LandingFooter />
    </div>
  );
}
