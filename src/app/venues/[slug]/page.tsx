"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { ArrowLeft, CalendarDays, MapPin, Navigation, ShieldCheck, Sparkles, Trophy, Users } from "lucide-react";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/Badge";
import { mockMatches } from "@/mock/matches";
import { mockTeams } from "@/mock/teams";
import { mockTournaments } from "@/mock/tournaments";
import { mockVenues } from "@/mock/venues";

const VenueMap = dynamic(
  () => import("@/components/venues/VenueMap").then((module) => module.VenueMap),
  { ssr: false, loading: () => <div className="h-[360px] animate-pulse rounded-[1.75rem] bg-surface/70" /> }
);

const formatMatchDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function VenueProfile({ params }: { params: { slug: string } }) {
  const venue = mockVenues.find((item) => item.slug === params.slug);

  if (!venue) {
    notFound();
  }

  const venueMatches = useMemo(
    () =>
      mockMatches
        .filter((match) => match.venueId === venue.id)
        .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime()),
    [venue.id]
  );

  const hostTeams = useMemo(() => {
    const teamIds = new Set<string>();
    venueMatches.forEach((match) => {
      teamIds.add(match.homeTeamId);
      teamIds.add(match.awayTeamId);
    });
    return mockTeams.filter((team) => teamIds.has(team.id));
  }, [venueMatches]);

  const hostedTournamentIds = new Set(venueMatches.map((match) => match.tournamentId));
  const hostedTournaments = mockTournaments.filter((tournament) => hostedTournamentIds.has(tournament.id));

  return (
    <div className="min-h-screen bg-background pb-24 text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.03),_transparent_72%)]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/venues" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-primary/30 hover:text-primary">
              <ArrowLeft size={16} />
              Back to venues
            </Link>
            {venue.isVerified && (
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <ShieldCheck size={14} />
                Verified venue
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="section-shell overflow-hidden">
              <div className="relative h-full min-h-[320px] overflow-hidden p-6 sm:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(255,255,255,0.02))]" />
                <div className="relative flex h-full flex-col justify-between">
                  <div>
                    <Badge variant="secondary" className="border-white/10 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-text-muted">
                      {venue.surface || "Football Venue"}
                    </Badge>
                    <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl">{venue.name}</h1>
                    <p className="mt-4 flex items-center gap-2 text-sm text-text-muted sm:text-base">
                      <MapPin size={16} />
                      {venue.address}
                    </p>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1.5rem] border border-white/10 bg-background/55 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Capacity</p>
                      <p className="mt-3 text-2xl font-semibold text-white">{venue.capacity ? venue.capacity.toLocaleString() : "TBD"}</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-background/55 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Matches hosted</p>
                      <p className="mt-3 text-2xl font-semibold text-primary">{venueMatches.length}</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-background/55 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Tournaments</p>
                      <p className="mt-3 text-2xl font-semibold text-secondary">{hostedTournaments.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="section-shell p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Facility mix</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {venue.facilities.map((facility) => (
                    <span
                      key={facility}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              <div className="section-shell p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Quick actions</p>
                <div className="mt-4 grid gap-3">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${venue.name} ${venue.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-slate-950"
                  >
                    <Navigation size={16} />
                    Open in Google Maps
                  </a>
                  <Link
                    href="/tournament/create"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
                  >
                    <Sparkles size={16} />
                    Register tournament here
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div className="space-y-6">
          <div className="section-shell p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Location</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Ground map</h2>
              </div>
              <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-text-muted sm:flex">
                {venue.city}, {venue.state}
              </div>
            </div>
            <VenueMap venues={[venue]} selectedVenueId={venue.id} heightClassName="h-[360px]" />
          </div>

          <div className="section-shell p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Fixture history</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Recent matches at this venue</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-text-muted">
                <CalendarDays size={14} />
                {venueMatches.length} logged fixtures
              </div>
            </div>

            <div className="space-y-3">
              {venueMatches.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-text-muted">
                  No tournament fixtures have been attached to this venue yet.
                </div>
              ) : (
                venueMatches.map((match) => {
                  const homeTeam = mockTeams.find((team) => team.id === match.homeTeamId);
                  const awayTeam = mockTeams.find((team) => team.id === match.awayTeamId);
                  const tournament = mockTournaments.find((item) => item.id === match.tournamentId);

                  if (!homeTeam || !awayTeam || !tournament) {
                    return null;
                  }

                  return (
                    <Link
                      key={match.id}
                      href={`/match/${match.id}`}
                      className="block rounded-[1.5rem] border border-white/10 bg-surface/65 p-4 transition-colors hover:border-primary/30"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">{tournament.name}</p>
                          <h3 className="mt-2 text-lg font-semibold text-white">
                            {homeTeam.name} vs {awayTeam.name}
                          </h3>
                          <p className="mt-2 text-sm text-text-muted">{formatMatchDate(match.date)}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-center">
                          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">{match.status}</p>
                          <p className="mt-2 text-2xl font-semibold text-white">
                            {match.homeScore} - {match.awayScore}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="section-shell p-5">
            <div className="mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-primary" />
              <h2 className="text-xl font-semibold text-white">Tournament history</h2>
            </div>
            <div className="space-y-3">
              {hostedTournaments.length === 0 ? (
                <p className="text-sm text-text-muted">Tournament history will appear as organizers log fixtures here.</p>
              ) : (
                hostedTournaments.map((tournament) => (
                  <Link
                    key={tournament.id}
                    href={`/tournament/${tournament.slug}`}
                    className="block rounded-[1.5rem] border border-white/10 bg-white/5 p-4 transition-colors hover:border-primary/30"
                  >
                    <p className="text-sm font-semibold text-white">{tournament.name}</p>
                    <p className="mt-2 text-sm text-text-muted">
                      {tournament.city}, {tournament.state} • {tournament.format}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="section-shell p-5">
            <div className="mb-4 flex items-center gap-2">
              <Users size={18} className="text-secondary" />
              <h2 className="text-xl font-semibold text-white">Teams that know this ground</h2>
            </div>
            <div className="space-y-3">
              {hostTeams.length === 0 ? (
                <p className="text-sm text-text-muted">Home teams and repeat visitors will show up once more fixtures are played.</p>
              ) : (
                hostTeams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/team/${team.slug}`}
                    className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/5 p-4 transition-colors hover:border-primary/30"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{team.name}</p>
                      <p className="mt-1 text-sm text-text-muted">
                        {team.city}, {team.state}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-background/60 px-3 py-1 text-xs uppercase tracking-[0.16em] text-text-muted">
                      {team.type}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
