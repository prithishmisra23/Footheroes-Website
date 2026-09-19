"use client";

import { CalendarDays, Home, Search, Trophy, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show bottom nav on match scoring or very specific deep pages if needed, but for now show everywhere
  const NAV_ITEMS = [
    { label: "Home", href: "/", icon: Home },
    { label: "Matches", href: "/matches", icon: CalendarDays },
    { label: "Players", href: "/discover", icon: Search },
    { label: "Tourneys", href: "/tournaments", icon: Trophy },
    { label: "Profile", href: "/dashboard", icon: User },
  ];

  return (
    <>
      {/* Spacer to prevent content from hiding behind the fixed bottom nav */}
      <div className="h-16 block sm:hidden"></div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 sm:hidden">
        <div className="flex items-center justify-around h-16">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center w-full h-full space-y-1"
              >
                <Icon
                  size={24}
                  className={`transition-colors ${
                    isActive ? "text-[#F75A0A]" : "text-gray-400"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`text-[0.65rem] font-semibold transition-colors ${
                    isActive ? "text-[#F75A0A]" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
