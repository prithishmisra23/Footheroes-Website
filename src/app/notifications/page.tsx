"use client";

import { ArrowLeft, Bell, Calendar, Trophy, Users, CheckCircle2, ChevronRight, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { mockNotifications } from "@/mock/notifications";
import { EmptyState } from "@/components/common/EmptyState";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredNotifications = mockNotifications.filter(n => {
    if (activeTab === "Unread") return !n.read;
    return true;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case "MATCH_UPDATE": return <Calendar size={18} className="text-[#3B82F6]" />;
      case "TEAM_INVITE": return <Users size={18} className="text-[#F59E0B]" />;
      case "TOURNAMENT_ALERT": return <Trophy size={18} className="text-[#22C55E]" />;
      case "SYSTEM": return <Bell size={18} className="text-gray-500" />;
      default: return <Bell size={18} className="text-gray-500" />;
    }
  };

  const getBgForType = (type: string) => {
    switch (type) {
      case "MATCH_UPDATE": return "bg-[#3B82F6]/10";
      case "TEAM_INVITE": return "bg-[#F59E0B]/10";
      case "TOURNAMENT_ALERT": return "bg-[#22C55E]/10";
      case "SYSTEM": return "bg-gray-100 dark:bg-gray-800";
      default: return "bg-gray-100 dark:bg-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 font-inter pb-20">
      
      {/* ═══ HEADER ═══ */}
      <div className="bg-[#1e293b] text-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:bg-white/10 p-1.5 rounded-full transition-colors -ml-1.5">
              <ArrowLeft size={20} />
            </Link>
            <span className="font-semibold text-lg">Notifications</span>
          </div>
          <button className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
            Mark All Read
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        
        {/* ═══ TABS ═══ */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-14 z-40 px-4 pt-2">
          <div className="flex w-full min-w-max gap-4">
            {["All", "Unread"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-semibold py-3 border-b-2 transition-colors ${
                  activeTab === tab ? "text-[#22C55E] border-[#22C55E]" : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ═══ FEED ═══ */}
        <div className="p-4">
          {filteredNotifications.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="All caught up!" description="You don't have any new notifications." />
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden divide-y divide-gray-50 dark:divide-gray-800/50">
              {filteredNotifications.map((notif) => (
                <div key={notif.id} className={`p-4 flex gap-4 transition-colors ${!notif.read ? 'bg-[#22C55E]/5 dark:bg-[#22C55E]/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                  
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getBgForType(notif.type)}`}>
                    {getIconForType(notif.type)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h3 className={`text-sm ${!notif.read ? 'font-bold text-gray-900 dark:text-gray-50' : 'font-semibold text-gray-800 dark:text-gray-200'} leading-tight`}>
                        {notif.title}
                      </h3>
                      <span className="text-[0.65rem] text-gray-400 whitespace-nowrap mt-0.5">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug mb-2">
                      {notif.message}
                    </p>
                    
                    {/* Action Button (Optional) */}
                    {notif.actionUrl && (
                      <Link href={notif.actionUrl} className="inline-flex items-center gap-1 text-xs font-bold text-[#22C55E] uppercase tracking-wider hover:underline">
                        View Details <ChevronRight size={14} />
                      </Link>
                    )}
                  </div>

                  {/* Unread dot */}
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
