import Link from "next/link";
import Image from "next/image";

export function LandingFooter() {
  return (
    <footer className="bg-[#111111] py-12 border-t border-stone-800">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/foot-heroes-logo.png" 
                alt="Foot Heroes logo" 
                width={48} 
                height={48} 
                className="h-12 w-12 rounded-full border border-[#FFD166] bg-white object-cover" 
              />
              <div>
                <p className="font-bebas text-xl tracking-[0.14em] text-white">FOOT HEROES</p>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#FFD166]">The Football Network</p>
              </div>
            </Link>
            <p className="mt-4 text-sm text-stone-400 max-w-xs">
              Giving grassroots football a proper home. Verified records, live scores, and tournament management.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#app-preview" className="hover:text-white transition-colors">See the App</a></li>
              <li><Link href="#early-access" className="hover:text-white transition-colors">Early Access</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><a href="#" className="hover:text-white transition-colors">Twitter (X)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Foot Heroes. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-stone-300">Privacy Policy</a>
            <a href="#" className="hover:text-stone-300">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
