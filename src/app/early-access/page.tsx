"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";

export default function EarlyAccessPage() {
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState("Player");

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSubmitted(true); }

  return <main className="min-h-screen bg-[#171717] px-5 py-8 text-white sm:px-8"><div className="mx-auto max-w-5xl">
    <Link href="/" className="inline-flex items-center gap-3"><Image src="/foot-heroes-logo.png" alt="Foot Heroes logo" width={72} height={72} className="h-16 w-16 rounded-full border-2 border-[#FFD166] bg-white object-cover" /><span className="font-bebas text-3xl tracking-[0.14em]">FOOT HEROES</span></Link>
    <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><section><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD166]">Founding members</p><h1 className="mt-5 font-serif text-5xl leading-[0.95] sm:text-6xl">Get on the pitch early.</h1><p className="mt-6 max-w-md text-lg leading-7 text-stone-300">Join the first wave of players, teams, organizers, and scouts building a better record for grassroots football.</p><div className="mt-8 space-y-4 text-sm text-stone-200"><p className="flex items-center gap-3"><CheckCircle2 className="text-[#FFD166]" size={20} /> Priority access at launch</p><p className="flex items-center gap-3"><CheckCircle2 className="text-[#FFD166]" size={20} /> Create your verified football profile</p><p className="flex items-center gap-3"><CheckCircle2 className="text-[#FFD166]" size={20} /> Early product updates and feedback access</p></div></section>
      <section className="rounded-2xl bg-[#F7F4EE] p-6 text-black shadow-2xl sm:p-8">{submitted ? <div className="py-10 text-center"><CheckCircle2 className="mx-auto text-[#F75A0A]" size={52} /><h2 className="mt-5 text-2xl font-bold">You&apos;re on the list.</h2><p className="mt-2 text-stone-600">We&apos;ll let you know when Foot Heroes is ready for you.</p><Link href="/" className="mt-6 inline-block font-bold text-[#D94801]">Back to Foot Heroes →</Link></div> : <><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F75A0A]">Early access</p><h2 className="mt-2 text-3xl font-bold">Register your interest</h2><p className="mt-2 text-sm text-stone-600">No payment or commitment required.</p><form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm font-semibold">Full name<input required className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-3 outline-none focus:border-[#F75A0A]" placeholder="Your name" /></label><label className="block text-sm font-semibold">Email address<input required type="email" className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-3 outline-none focus:border-[#F75A0A]" placeholder="you@example.com" /></label><div><p className="text-sm font-semibold">I&apos;m joining as a</p><div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">{["Player", "Coach", "Organizer", "Scout"].map((item) => <button type="button" onClick={() => setRole(item)} key={item} className={`rounded-lg border px-2 py-2 text-xs font-bold ${role === item ? "border-[#F75A0A] bg-[#F75A0A] text-white" : "border-stone-300 bg-white text-stone-700"}`}>{item}</button>)}</div></div><button className="w-full rounded-lg bg-[#F75A0A] py-3.5 font-bold text-white hover:bg-[#D94801]">Join early access</button></form></>}</section>
    </div>
  </div></main>;
}
