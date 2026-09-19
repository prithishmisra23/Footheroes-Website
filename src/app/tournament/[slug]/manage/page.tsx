"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, CalendarDays, Settings, ShieldCheck, X, Check, Search, CalendarPlus, ChevronRight } from "lucide-react";

import { mockTeams, Team } from "@/mock/teams";

type Tab = "overview" | "teams" | "fixtures" | "settings";

// Extend the base team with approval status for the dashboard
interface DashboardTeam extends Team {
  status: "PENDING" | "APPROVED" | "REJECTED";
  registeredAt: string;
}

// Initial mock state - assigning random statuses to mockTeams
const initialTeams: DashboardTeam[] = mockTeams.map((team, index) => ({
  ...team,
  status: index % 3 === 0 ? "PENDING" : (index % 5 === 0 ? "REJECTED" : "APPROVED"),
  registeredAt: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
}));

export default function TournamentManagePage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [teams, setTeams] = useState<DashboardTeam[]>(initialTeams);
  const [fixturesGenerated, setFixturesGenerated] = useState(false);
  const [fixtures, setFixtures] = useState<any[]>([]);

  const tournamentName = params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Computed stats
  const pendingCount = teams.filter(t => t.status === "PENDING").length;
  const approvedCount = teams.filter(t => t.status === "APPROVED").length;

  const handleApprove = (teamId: string) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, status: "APPROVED" } : t));
  };

  const handleReject = (teamId: string) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, status: "REJECTED" } : t));
  };

  const generateFixtures = () => {
    // A highly mocked fixture generation that pairs approved teams
    const approved = teams.filter(t => t.status === "APPROVED");
    if (approved.length < 2) return;

    const generated = [];
    let matchId = 1;
    
    // Very simple mock round-robin creation
    for (let i = 0; i < approved.length; i++) {
      for (let j = i + 1; j < approved.length; j++) {
        // limit to 8 matches for demo purposes
        if (generated.length >= 8) break;
        
        generated.push({
          id: `match-\${matchId++}`,
          homeTeam: approved[i],
          awayTeam: approved[j],
          date: new Date(Date.now() + (generated.length + 1) * 86400000).toISOString().split('T')[0],
          time: "18:00",
          status: "SCHEDULED"
        });
      }
    }

    setFixtures(generated);
    setFixturesGenerated(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row text-gray-900 dark:text-gray-50 font-inter">
      
      {/* ═══ SIDEBAR ═══ */}
      <div className="w-full md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 sticky top-0 md:h-screen z-10">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className="text-xs font-bold text-gray-400 hover:text-gray-600 mb-2 block flex items-center gap-1">
            <ChevronRight className="rotate-180" size={12} /> BACK TO HOME
          </Link>
          <h1 className="font-bebas text-2xl tracking-wider text-[#22C55E] truncate" title={tournamentName}>
            {tournamentName}
          </h1>
          <div className="text-xs font-semibold text-gray-500 uppercase">Organizer Dashboard</div>
        </div>

        <nav className="p-4 space-y-1 overflow-x-auto flex md:flex-col">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "teams", label: "Teams & Approvals", icon: Users, badge: pendingCount },
            { id: "fixtures", label: "Fixtures", icon: CalendarDays },
            { id: "settings", label: "Settings", icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold transition-colors \${
                activeTab === item.id 
                  ? "bg-[#22C55E]/10 text-[#22C55E]" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <item.icon size={18} />
              <span className="whitespace-nowrap">{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="ml-auto bg-red-500 text-white text-[0.6rem] px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          
          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Dashboard Overview</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                  <div className="text-gray-500 text-sm font-semibold mb-2">Approved Teams</div>
                  <div className="font-bebas text-4xl text-gray-900 dark:text-gray-50">{approvedCount}<span className="text-xl text-gray-400">/16</span></div>
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 relative overflow-hidden">
                  <div className="text-gray-500 text-sm font-semibold mb-2">Pending Approvals</div>
                  <div className="font-bebas text-4xl text-gray-900 dark:text-gray-50">{pendingCount}</div>
                  {pendingCount > 0 && <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full flex items-start justify-end p-2"><div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" /></div>}
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                  <div className="text-gray-500 text-sm font-semibold mb-2">Matches Scheduled</div>
                  <div className="font-bebas text-4xl text-gray-900 dark:text-gray-50">{fixtures.length}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TEAMS */}
          {activeTab === "teams" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Teams & Approvals</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="Search teams..." className="pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:border-[#22C55E]" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase text-[0.65rem] font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-3">Team Name</th>
                        <th className="px-6 py-3">Captain/Manager</th>
                        <th className="px-6 py-3">Registered On</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {teams.map(team => (
                        <tr key={team.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center font-bold text-xs">
                                {team.logoUrl ? <img src={team.logoUrl} alt="" className="w-full h-full object-contain p-1" /> : team.shortName}
                              </div>
                              <span className="font-semibold text-gray-900 dark:text-gray-50">{team.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-500">M. Sharma (Mock)</td>
                          <td className="px-6 py-4 text-gray-500">{team.registeredAt}</td>
                          <td className="px-6 py-4">
                            {team.status === "PENDING" && <span className="inline-flex items-center px-2 py-1 rounded text-[0.65rem] font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">PENDING</span>}
                            {team.status === "APPROVED" && <span className="inline-flex items-center px-2 py-1 rounded text-[0.65rem] font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">APPROVED</span>}
                            {team.status === "REJECTED" && <span className="inline-flex items-center px-2 py-1 rounded text-[0.65rem] font-bold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">REJECTED</span>}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {team.status === "PENDING" ? (
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleApprove(team.id)} className="p-1.5 bg-green-100 text-green-600 hover:bg-green-200 rounded transition-colors" title="Approve">
                                  <Check size={16} />
                                </button>
                                <button onClick={() => handleReject(team.id)} className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded transition-colors" title="Reject">
                                  <X size={16} />
                                </button>
                              </div>
                            ) : (
                              <button className="text-[0.7rem] font-bold text-gray-400 hover:text-gray-600 uppercase transition-colors">View Roster</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FIXTURES */}
          {activeTab === "fixtures" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Fixtures & Scheduling</h2>
                {!fixturesGenerated && (
                  <button 
                    onClick={generateFixtures}
                    className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                  >
                    <CalendarPlus size={16} /> Auto-Generate Schedule
                  </button>
                )}
              </div>

              {!fixturesGenerated ? (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center flex flex-col items-center">
                  <ShieldCheck size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
                  <h3 className="text-lg font-bold mb-2">No Fixtures Generated</h3>
                  <p className="text-sm text-gray-500 max-w-sm mb-6">
                    You currently have {approvedCount} approved teams. Click the button above to automatically generate a round-robin schedule for them.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {fixtures.map((match, i) => (
                    <div key={match.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col">
                      <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-4">
                        <span>MATCH {i + 1}</span>
                        <span>{match.date} • {match.time}</span>
                      </div>
                      <div className="flex items-center justify-between flex-1">
                        <div className="flex flex-col items-center gap-2 w-1/3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center p-2">
                             {match.homeTeam.logoUrl ? <img src={match.homeTeam.logoUrl} className="w-full h-full object-contain" /> : <span className="font-bebas">{match.homeTeam.shortName}</span>}
                          </div>
                          <span className="font-bold text-sm text-center line-clamp-1">{match.homeTeam.name}</span>
                        </div>
                        <div className="text-xs font-bold text-gray-400 px-2">VS</div>
                        <div className="flex flex-col items-center gap-2 w-1/3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center p-2">
                             {match.awayTeam.logoUrl ? <img src={match.awayTeam.logoUrl} className="w-full h-full object-contain" /> : <span className="font-bebas">{match.awayTeam.shortName}</span>}
                          </div>
                          <span className="font-bold text-sm text-center line-clamp-1">{match.awayTeam.name}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                        <button className="text-xs font-bold text-[#3B82F6] hover:underline">Edit Venue/Time</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
              <Settings size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Tournament Settings</h3>
              <p className="text-sm text-gray-500">Settings panel is under construction in this MVP.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

