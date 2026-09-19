import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck, Smartphone, Trophy, Users } from "lucide-react";

const platformItems = ["Player profiles", "Live match tracking", "Tournaments", "Football venues"];

export default function Home() {
  return <div className="min-h-screen bg-[#171717] text-white">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/foot-heroes-logo.png" alt="Foot Heroes logo" width={64} height={64} className="h-14 w-14 rounded-full border-2 border-[#FFD166] bg-white object-cover" priority />
        <div><p className="font-bebas text-2xl tracking-[0.14em]">FOOT HEROES</p><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FFD166]">Slogan here</p></div>
      </Link>
      <nav className="hidden items-center gap-6 lg:flex">
        <a href="#platform" className="text-sm font-medium text-stone-300 hover:text-white">Platform</a>
        <Link href="/matches" className="text-sm font-medium text-stone-300 hover:text-white">Matches</Link>
        <Link href="/tournaments" className="text-sm font-medium text-stone-300 hover:text-white">Tournaments</Link>
        <Link href="/discover" className="text-sm font-medium text-stone-300 hover:text-white">Players</Link>
        <Link href="/early-access" className="rounded-full border border-[#FFD166] bg-[#FFD166] px-4 py-2 text-sm font-bold text-black hover:bg-[#ffe09a]">Early access</Link>
      </nav>
      <Link href="/early-access" className="rounded-full bg-[#F75A0A] px-4 py-2 text-sm font-bold text-white lg:hidden">Register</Link>
    </header>

    <main>
      <section className="relative isolate overflow-hidden">
        <video autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 -z-20 h-full w-full object-cover" aria-hidden="true">
          <source src="/foot-heroes-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 -z-10 bg-[#171717]/85" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#171717] via-[#171717]/80 to-[#171717]/45" />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:pb-24 lg:pt-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-600 bg-stone-800 px-3 py-1.5 text-xs font-semibold text-stone-200"><ShieldCheck size={14} className="text-[#FFD166]" /> INDIA&apos;S GRASSROOTS FOOTBALL NETWORK</div>
          <h1 className="mt-7 font-serif text-5xl leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">Every match.<br /><span className="text-[#FFD166]">Every player.</span><br />One football story.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-stone-300 sm:text-lg">Foot Heroes gives grassroots football a proper home: verified player records, live scores, teams, tournaments, and the places where the game is played.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/early-access" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F75A0A] px-6 py-3.5 font-bold text-white hover:bg-[#D94801]">Register early <ArrowRight size={18} /></Link><Link href="#platform" className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-500 bg-stone-800 px-6 py-3.5 font-bold text-white hover:bg-stone-700"><Smartphone size={18} /> See the platform</Link></div>
          <p className="mt-5 text-xs text-stone-400">Early members get priority access when Foot Heroes launches.</p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
          <div className="absolute -right-4 top-8 h-36 w-36 rounded-full bg-[#F75A0A] opacity-20 blur-3xl" />
          <div className="absolute -left-5 bottom-12 h-32 w-32 rounded-full bg-[#FFD166] opacity-15 blur-3xl" />
          <div className="relative mx-auto max-w-sm rounded-[2.5rem] border-[7px] border-stone-700 bg-black p-2 shadow-2xl">
            <div className="overflow-hidden rounded-[2rem] bg-[#F7F4EE] p-5 text-black">
              <div className="flex items-center justify-between"><span className="text-xs font-bold">9:41</span><span className="text-xs">5G ▰</span></div>
              <div className="mt-5 flex items-center gap-2"><Image src="/foot-heroes-logo.png" alt="" width={32} height={32} className="h-8 w-8 rounded-full border border-black bg-white object-cover" /><span className="text-xs font-bold tracking-wider">FOOT HEROES</span></div>
              <h2 className="mt-3 text-2xl font-bold leading-tight">Your next match<br />starts here.</h2>
              <div className="mt-5 rounded-2xl bg-[#FFD166] p-4"><div className="flex items-center justify-between text-xs font-bold"><span>PLAYER PROFILE</span><span className="rounded-full bg-black px-2 py-1 text-white">Verified</span></div><p className="mt-5 text-sm">Career rating</p><p className="text-5xl font-bold">8.6<span className="text-lg">/10</span></p><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/70"><div className="h-full w-[86%] bg-[#F75A0A]" /></div></div>
              <div className="mt-4 grid grid-cols-3 gap-2"><div className="rounded-xl bg-white p-3 text-center shadow-sm"><Trophy size={18} className="mx-auto text-[#F75A0A]" /><b className="mt-1 block">12</b><span className="text-[10px] text-stone-500">Goals</span></div><div className="rounded-xl bg-white p-3 text-center shadow-sm"><Users size={18} className="mx-auto" /><b className="mt-1 block">28</b><span className="text-[10px] text-stone-500">Matches</span></div><div className="rounded-xl bg-white p-3 text-center shadow-sm"><MapPin size={18} className="mx-auto text-[#F75A0A]" /><b className="mt-1 block">4</b><span className="text-[10px] text-stone-500">Venues</span></div></div>
              <div className="mt-4 rounded-xl bg-[#171717] p-3 text-white"><div className="flex justify-between text-xs"><span>LIVE NOW</span><span className="text-[#FFD166]">67&apos;</span></div><p className="mt-2 text-sm font-bold">Delhi FC <span className="mx-2 text-[#F75A0A]">2 — 1</span> Chennai United</p></div>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section id="platform" className="border-y border-stone-800 bg-[#111111]"><div className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD166]">Built for the football community</p><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{platformItems.map((item, index) => <Link key={item} href={index === 0 ? "/discover" : index === 1 ? "/matches" : index === 2 ? "/tournaments" : "/venues"} className="rounded-xl border border-stone-700 bg-[#202020] p-5 transition-colors hover:border-[#F75A0A]"><span className="text-sm font-bold text-[#FFD166]">0{index + 1}</span><h2 className="mt-6 text-lg font-bold">{item}</h2><p className="mt-2 text-sm text-stone-400">Built for real people and real football.</p></Link>)}</div></div></section>
    </main>
  </div>;
}
