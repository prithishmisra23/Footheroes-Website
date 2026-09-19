"use client";

import { User, Shield, Trophy, Activity, Settings, ChevronRight, LogOut, FileText, Bell, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { mockPlayers } from "@/mock/players";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

export default function Dashboard() {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const userPlayer = mockPlayers[0]; // mock logged-in user

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 font-inter pb-24">
      
      {/* ═══ HEADER ═══ */}
      <div className="bg-[#171717] text-white sticky top-0 z-50 shadow-sm border-b-4 border-[#F75A0A]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bebas text-xl tracking-widest">MY DASHBOARD</span>
          <button className="hover:bg-white/10 p-1.5 rounded-full transition-colors">
            <Bell size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        
        {/* ═══ USER PROFILE SUMMARY ═══ */}
        <div className="bg-white dark:bg-gray-900 px-4 py-6 border-b border-gray-100 dark:border-gray-800 shadow-sm mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#F75A0A] flex items-center justify-center text-white font-bebas text-2xl shadow-sm border-2 border-white dark:border-gray-900 overflow-hidden">
              {userPlayer.avatarUrl ? <img src={userPlayer.avatarUrl} alt="" className="w-full h-full object-cover" /> : userPlayer.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-lg text-gray-900 dark:text-gray-50 leading-tight truncate">{userPlayer.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">+91 98765 43210</p>
              <Link href={`/player/${userPlayer.slug}`} className="text-xs font-bold text-[#F75A0A] uppercase tracking-wider hover:underline">
                View Public Profile
              </Link>
            </div>
          </div>
        </div>

        {/* ═══ MENU SECTIONS ═══ */}
        
        {/* Manage Section */}
        <div className="mb-4">
          <div className="px-4 py-2 text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider">
            Manage
          </div>
          <div className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
            
            <Link href={`/player/${userPlayer.slug}`} className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#F75A0A] flex items-center justify-center">
                  <User size={18} />
                </div>
                <span className="font-semibold text-sm text-gray-900 dark:text-gray-50">Edit Player Profile</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
            </Link>

            <Link href="/team/delhi-fc" className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <span className="font-semibold text-sm text-gray-900 dark:text-gray-50">My Teams</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
            </Link>

            <Link href="/tournament/dpl" className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center">
                  <Trophy size={18} />
                </div>
                <span className="font-semibold text-sm text-gray-900 dark:text-gray-50">My Tournaments</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
            </Link>

          </div>
        </div>

        {/* Organizer Section */}
        <div className="mb-4">
          <div className="px-4 py-2 text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider">
            Organizer Tools
          </div>
          <div className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
            <Link href="#" className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <Activity size={18} />
                </div>
                <div>
                  <span className="block font-semibold text-sm text-gray-900 dark:text-gray-50">Score a Match</span>
                  <span className="block text-[0.65rem] text-gray-500 dark:text-gray-400">Live scoring interface</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
            </Link>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="mb-6">
          <div className="px-4 py-2 text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider">
            Preferences & Support
          </div>
          <div className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
            <Link href="#" className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center">
                  <Settings size={18} />
                </div>
                <span className="font-semibold text-sm text-gray-900 dark:text-gray-50">Account Settings</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
            </Link>
            
            <Link href="#" className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center">
                  <HelpCircle size={18} />
                </div>
                <span className="font-semibold text-sm text-gray-900 dark:text-gray-50">Help & Support</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
            </Link>

            <Link href="#" className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <span className="font-semibold text-sm text-gray-900 dark:text-gray-50">Terms & Privacy</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
            </Link>
          </div>
        </div>

        {/* Logout */}
        <div className="px-4 mb-10">
          <button 
            onClick={() => setLogoutOpen(true)}
            className="w-full bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/50 text-red-500 font-bold text-sm py-3.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <LogOut size={18} /> Log Out
          </button>
          <div className="text-center mt-4 text-[0.65rem] text-gray-400 font-mono">
            Foot Heroes v1.0.0
          </div>
        </div>

      </div>

      <ConfirmationModal 
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => setLogoutOpen(false)}
        title="Log Out"
        description="Are you sure you want to log out of Foot Heroes? You will need to sign in again to access your profile."
        confirmText="Log Out"
        isDestructive={true}
      />
    </div>
  );
}
