"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { label: "Matches", href: "/matches" },
  { label: "Tournaments", href: "/tournaments" },
  { label: "Players", href: "/discover" },
  { label: "Venues", href: "/venues" },
  { label: "Early access", href: "/early-access" },
];

export function AppHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image src="/foot-heroes-logo.png" alt="Foot Heroes" width={48} height={48} className="h-11 w-11 rounded-full border-2 border-black bg-white object-cover" priority />
          <span className="font-bebas text-xl tracking-[0.14em] text-gray-900 dark:text-white">FOOT HEROES</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return <Link key={link.href} href={link.href} className={`rounded-md px-3 py-2 text-sm font-medium ${active ? "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300" : "text-gray-600 hover:bg-amber-50 dark:text-gray-300 dark:hover:bg-gray-900"}`}>{link.label}</Link>;
          })}
          <Link href="/dashboard" className="ml-2 rounded-md bg-[#F75A0A] px-3 py-2 text-sm font-semibold text-white hover:bg-[#D94801]">My profile</Link>
        </nav>

        <button type="button" aria-label="Open menu" className="rounded-md p-2 text-gray-600 dark:text-gray-300 md:hidden" onClick={() => setOpen((value) => !value)}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {open && <nav className="border-t border-gray-100 bg-white px-4 py-2 dark:border-gray-800 dark:bg-gray-950 md:hidden">
        {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-900">{link.label}</Link>)}
        <Link href="/dashboard" onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm font-semibold text-orange-700 dark:text-orange-400">My profile</Link>
      </nav>}
    </header>
  );
}
