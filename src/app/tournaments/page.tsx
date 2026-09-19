import Link from "next/link";
import { Plus } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { mockTournaments } from "@/mock/tournaments";

export default function TournamentsPage() {
  const active = mockTournaments.filter((tournament) => tournament.status !== "COMPLETED");
  const completed = mockTournaments.filter((tournament) => tournament.status === "COMPLETED");
  return <div className="min-h-screen bg-gray-50 pb-24 dark:bg-gray-950"><AppHeader /><main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-orange-700 dark:text-orange-400">Competition hub</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Tournaments</h1><p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Find competitions, follow progress, or run your own.</p></div><Link href="/tournament/create" className="inline-flex items-center gap-2 rounded-md bg-[#F75A0A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#D94801]"><Plus size={17} /> Create tournament</Link></div>
    <section className="mt-8"><h2 className="text-lg font-bold text-gray-900 dark:text-white">Active and upcoming</h2><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{active.map((tournament) => <TournamentCard key={tournament.id} tournament={tournament} />)}</div></section>
    <section className="mt-8"><h2 className="text-lg font-bold text-gray-900 dark:text-white">Past tournaments</h2><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{completed.map((tournament) => <TournamentCard key={tournament.id} tournament={tournament} />)}</div></section>
  </main></div>;
}
