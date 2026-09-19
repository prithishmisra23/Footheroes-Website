"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ArrowLeft, Shield, Sparkles, Trophy } from "lucide-react";

import { mockMatches } from "@/mock/matches";
import { mockPlayers } from "@/mock/players";
import { mockTeams } from "@/mock/teams";
import { mockTournaments } from "@/mock/tournaments";
import { Match, Player } from "@/types";

type AnalyticsType = "player" | "team" | "tournament";

interface AnalyticsDetailClientProps {
  type: AnalyticsType;
  slug: string;
}

const chartPalette = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

const formatDateLabel = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const getPlayerPerformanceShift = (entry: Player["formGuide"][number]) => {
  switch (entry) {
    case "G":
      return { goals: 1, assists: 0, ratingShift: 0.45 };
    case "A":
      return { goals: 0, assists: 1, ratingShift: 0.25 };
    case "W":
      return { goals: 0, assists: 0, ratingShift: 0.1 };
    case "L":
      return { goals: 0, assists: 0, ratingShift: -0.45 };
    default:
      return { goals: 0, assists: 0, ratingShift: -0.05 };
  }
};

const getResultForTeam = (teamId: string, match: Match) => {
  if (match.homeScore === match.awayScore) {
    return "D";
  }

  const won =
    (match.homeTeamId === teamId && match.homeScore > match.awayScore) ||
    (match.awayTeamId === teamId && match.awayScore > match.homeScore);

  return won ? "W" : "L";
};

const SectionCard = ({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) => (
  <div className="section-shell p-5">
    <p className="text-xs uppercase tracking-[0.2em] text-text-muted">{eyebrow}</p>
    <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
    <div className="mt-5">{children}</div>
  </div>
);

const HeroMetric = ({ label, value, tone = "white" }: { label: string; value: string | number; tone?: "white" | "green" | "blue" | "amber" }) => {
  const toneClass = tone === "green" ? "text-primary" : tone === "blue" ? "text-secondary" : tone === "amber" ? "text-amber-300" : "text-white";
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-background/50 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-text-muted">{label}</p>
      <p className={`mt-3 text-2xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
};

export default function AnalyticsDetailClient({ type, slug }: AnalyticsDetailClientProps) {
  const player = type === "player" ? mockPlayers.find((item) => item.slug === slug) : null;
  const team = type === "team" ? mockTeams.find((item) => item.slug === slug) : null;
  const tournament = type === "tournament" ? mockTournaments.find((item) => item.slug === slug) : null;

  const entityMissing = (type === "player" && !player) || (type === "team" && !team) || (type === "tournament" && !tournament);

  const playerCharts = useMemo(() => {
    if (!player) {
      return null;
    }

    const matches = mockMatches.filter((match) => match.homeTeamId === player.currentTeamId || match.awayTeamId === player.currentTeamId);
    const monthlyPerformance = matches.map((match, index) => {
      const event = player.formGuide[index % player.formGuide.length];
      const performance = getPlayerPerformanceShift(event);
      const opponentId = match.homeTeamId === player.currentTeamId ? match.awayTeamId : match.homeTeamId;
      const opponent = mockTeams.find((item) => item.id === opponentId);

      return {
        label: formatDateLabel(match.date),
        opponent: opponent?.name || "Opponent",
        goals: performance.goals,
        assists: performance.assists,
        rating: Number((player.stats.currentSeasonRating + performance.ratingShift).toFixed(1))
      };
    });

    const tournamentPerformance = mockTournaments
      .filter((item) => item.teamsParticipating?.includes(player.currentTeamId || ""))
      .map((item, index) => ({
        name: item.name,
        rating: Number((player.stats.currentSeasonRating - 0.35 + index * 0.18).toFixed(1)),
        goals: Math.max(1, Math.round(player.stats.careerGoals / Math.max(6, mockTournaments.length + index + 2)))
      }));

    const opponentBreakdown = monthlyPerformance.map((item, index) => ({
      opponent: item.opponent.split(" ")[0],
      contributions: item.goals + item.assists,
      shots: item.goals + 2 + index
    }));

    return { monthlyPerformance, tournamentPerformance, opponentBreakdown };
  }, [player]);

  const teamCharts = useMemo(() => {
    if (!team) {
      return null;
    }

    const fixtures = mockMatches.filter((match) => match.homeTeamId === team.id || match.awayTeamId === team.id);
    const squad = mockPlayers.filter((playerItem) => playerItem.currentTeamId === team.id);

    const resultMix = [
      { name: "Wins", value: team.stats.wins },
      { name: "Draws", value: team.stats.draws },
      { name: "Losses", value: team.stats.losses }
    ];

    const goalsFlow = fixtures.map((match) => {
      const isHome = match.homeTeamId === team.id;
      const opponentId = isHome ? match.awayTeamId : match.homeTeamId;
      const opponent = mockTeams.find((item) => item.id === opponentId);
      return {
        match: opponent?.shortName || "OPP",
        scored: isHome ? match.homeScore : match.awayScore,
        conceded: isHome ? match.awayScore : match.homeScore
      };
    });

    const topScorers = [...squad]
      .sort((left, right) => right.stats.careerGoals - left.stats.careerGoals)
      .slice(0, 4)
      .map((playerItem) => ({
        name: playerItem.name.split(" ")[0],
        goals: playerItem.stats.careerGoals
      }));

    const tournamentBreakdown = mockTournaments
      .filter((item) => item.teamsParticipating?.includes(team.id))
      .map((item) => ({
        name: item.name,
        points: Math.min(21, item.matchesPlayed > 0 ? Math.round((team.stats.wins / Math.max(1, team.stats.totalMatches)) * 21) : 0),
        goals: Math.min(24, Math.round((team.stats.goalsFor / Math.max(1, team.stats.totalMatches)) * 10))
      }));

    const positionCoverage = [
      { role: "Attack", count: squad.filter((playerItem) => /Winger|Striker|Forward/i.test(playerItem.position)).length || 1 },
      { role: "Midfield", count: squad.filter((playerItem) => /Midfielder/i.test(playerItem.position)).length || 1 },
      { role: "Defence", count: squad.filter((playerItem) => /Back/i.test(playerItem.position)).length || 1 },
      { role: "Goal", count: squad.filter((playerItem) => /Goalkeeper/i.test(playerItem.position)).length || 1 }
    ];

    const radar = [
      { subject: "Pressing", value: 77 },
      { subject: "Attack", value: 82 },
      { subject: "Defence", value: 74 },
      { subject: "Depth", value: 68 },
      { subject: "Discipline", value: 63 }
    ];

    const formStrip = fixtures.map((match) => ({
      fixture: formatDateLabel(match.date),
      result: getResultForTeam(team.id, match)
    }));

    return { resultMix, goalsFlow, topScorers, tournamentBreakdown, positionCoverage, radar, formStrip };
  }, [team]);

  const tournamentCharts = useMemo(() => {
    if (!tournament) {
      return null;
    }

    const fixtures = mockMatches.filter((match) => match.tournamentId === tournament.id);
    const participatingTeams = mockTeams.filter((teamItem) => tournament.teamsParticipating?.includes(teamItem.id));
    const participatingPlayers = mockPlayers.filter((playerItem) => participatingTeams.some((teamItem) => teamItem.id === playerItem.currentTeamId));

    const timeline = fixtures.map((match) => {
      const home = mockTeams.find((teamItem) => teamItem.id === match.homeTeamId);
      const away = mockTeams.find((teamItem) => teamItem.id === match.awayTeamId);
      return {
        fixture: `${home?.shortName || "H"}-${away?.shortName || "A"}`,
        totalGoals: match.homeScore + match.awayScore,
        cards: match.homeStats.yellowCards + match.awayStats.yellowCards
      };
    });

    const performers = participatingPlayers
      .map((playerItem) => ({
        name: playerItem.name,
        slug: playerItem.slug,
        position: playerItem.position,
        goals: playerItem.stats.careerGoals,
        assists: playerItem.stats.careerAssists,
        rating: playerItem.stats.currentSeasonRating
      }))
      .sort((left, right) => right.goals - left.goals)
      .slice(0, 5);

    const cardPressure = participatingTeams.map((teamItem, index) => ({
      team: teamItem.shortName,
      yellows: Math.max(1, Math.round(teamItem.stats.losses + index + 1)),
      reds: Math.min(3, Math.max(0, teamItem.stats.losses - index))
    }));

    const comparisonRadar = participatingTeams.slice(0, 3).map((teamItem) => ({
      team: teamItem.shortName,
      attack: Math.min(100, Math.round((teamItem.stats.goalsFor / Math.max(1, teamItem.stats.totalMatches)) * 40)),
      defence: Math.min(100, Math.round((teamItem.stats.cleanSheets / Math.max(1, teamItem.stats.totalMatches)) * 100)),
      form: teamItem.formGuide.filter((entry) => entry === "W").length * 20,
      discipline: Math.max(40, 90 - teamItem.stats.losses * 8)
    }));

    return { timeline, performers, cardPressure, comparisonRadar, participatingTeams };
  }, [tournament]);

  if (entityMissing) {
    return (
      <div className="min-h-screen bg-background px-4 py-12 text-white">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-text-muted">Analytics</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">We couldn&apos;t find that dashboard.</h1>
          <p className="mt-4 text-sm text-text-muted">Try returning to the analytics hub and opening one of the available profiles.</p>
          <Link
            href="/analytics"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-slate-950"
          >
            <ArrowLeft size={16} />
            Back to analytics hub
          </Link>
        </div>
      </div>
    );
  }

  const title = player?.name || team?.name || tournament?.name || "Analytics";
  const subheading =
    type === "player"
      ? `${player?.position} • ${player?.city}, ${player?.state}`
      : type === "team"
        ? `${team?.type} • ${team?.city}, ${team?.state}`
        : `${tournament?.format} • ${tournament?.city}, ${tournament?.state}`;

  return (
    <div className="min-h-screen bg-background pb-24 text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_22%)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/analytics" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
            <ArrowLeft size={16} />
            Back to analytics hub
          </Link>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                {type === "player" ? <Sparkles size={14} /> : type === "team" ? <Shield size={14} /> : <Trophy size={14} />}
                {type} analytics
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">{title}</h1>
              <p className="mt-4 text-base text-text-muted sm:text-lg">{subheading}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {type === "player" && player && (
                <>
                  <HeroMetric label="Goals" value={player.stats.careerGoals} tone="green" />
                  <HeroMetric label="Assists" value={player.stats.careerAssists} tone="blue" />
                  <HeroMetric label="Matches" value={player.stats.careerMatches} />
                  <HeroMetric label="Rating" value={player.stats.currentSeasonRating.toFixed(1)} tone="amber" />
                </>
              )}
              {type === "team" && team && (
                <>
                  <HeroMetric label="Wins" value={team.stats.wins} tone="green" />
                  <HeroMetric label="Draws" value={team.stats.draws} tone="blue" />
                  <HeroMetric label="Losses" value={team.stats.losses} />
                  <HeroMetric label="Goals For" value={team.stats.goalsFor} tone="amber" />
                </>
              )}
              {type === "tournament" && tournament && (
                <>
                  <HeroMetric label="Teams" value={tournament.teamsCount} tone="green" />
                  <HeroMetric label="Matches" value={tournament.matchesPlayed} tone="blue" />
                  <HeroMetric label="Goals" value={tournament.totalGoals} tone="amber" />
                  <HeroMetric label="Level" value={tournament.level} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {type === "player" && player && playerCharts && (
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <SectionCard eyebrow="Trend line" title="Goals and rating by match">
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={playerCharts.monthlyPerformance}>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tickLine={false} axisLine={false} domain={[6.5, 10]} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px" }} />
                    <Line yAxisId="left" type="monotone" dataKey="goals" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard eyebrow="Form guide" title="Last matches snapshot">
              <div className="space-y-3">
                {playerCharts.monthlyPerformance.map((item, index) => (
                  <div key={`${item.label}-${index}`} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">vs {item.opponent}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-text-muted">{item.label}</p>
                      </div>
                      <div className="rounded-full border border-white/10 bg-background/60 px-3 py-1 text-sm font-semibold text-amber-300">
                        {item.rating}
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2 text-xs text-text-muted">
                      <span className="rounded-full border border-white/10 px-3 py-1">{item.goals} goals</span>
                      <span className="rounded-full border border-white/10 px-3 py-1">{item.assists} assists</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard eyebrow="Opponents" title="Who this player hurts the most">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={playerCharts.opponentBreakdown}>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="opponent" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px" }} />
                    <Bar dataKey="contributions" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="shots" fill="#22c55e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard eyebrow="Tournament output" title="Performance by competition">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={playerCharts.tournamentPerformance}>
                    <defs>
                      <linearGradient id="playerGoals" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px" }} />
                    <Area type="monotone" dataKey="goals" stroke="#22c55e" fill="url(#playerGoals)" strokeWidth={3} />
                    <Line type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>
        )}

        {type === "team" && team && teamCharts && (
          <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
            <SectionCard eyebrow="Result profile" title="Win, draw, loss mix">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={teamCharts.resultMix} innerRadius={70} outerRadius={105} paddingAngle={4} dataKey="value">
                      {teamCharts.resultMix.map((entry, index) => (
                        <Cell key={entry.name} fill={chartPalette[index]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {teamCharts.resultMix.map((entry, index) => (
                  <div key={entry.name} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-3 text-center">
                    <p className="text-xs uppercase tracking-[0.16em] text-text-muted">{entry.name}</p>
                    <p className="mt-2 text-xl font-semibold" style={{ color: chartPalette[index] }}>
                      {entry.value}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard eyebrow="Goal flow" title="Scored versus conceded">
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={teamCharts.goalsFlow}>
                    <defs>
                      <linearGradient id="teamScored" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="teamConceded" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="match" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px" }} />
                    <Area type="monotone" dataKey="scored" stroke="#22c55e" fill="url(#teamScored)" strokeWidth={3} />
                    <Area type="monotone" dataKey="conceded" stroke="#ef4444" fill="url(#teamConceded)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard eyebrow="Contributors" title="Top scorers in the squad">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamCharts.topScorers} layout="vertical" margin={{ left: 12 }}>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} width={80} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px" }} />
                    <Bar dataKey="goals" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard eyebrow="Tournament footprint" title="Performance by competition">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamCharts.tournamentBreakdown}>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px" }} />
                    <Bar dataKey="points" fill="#22c55e" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="goals" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard eyebrow="Identity" title="Squad shape and form">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={teamCharts.positionCoverage} innerRadius={46} outerRadius={82} dataKey="count">
                        {teamCharts.positionCoverage.map((entry, index) => (
                          <Cell key={entry.role} fill={chartPalette[index]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  <div className="h-[170px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={teamCharts.radar}>
                        <PolarGrid stroke="rgba(148,163,184,0.2)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                        <Radar dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.35} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {teamCharts.formStrip.map((item) => (
                      <span
                        key={item.fixture}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                          item.result === "W"
                            ? "bg-primary text-slate-950"
                            : item.result === "D"
                              ? "bg-slate-500 text-white"
                              : "bg-red-500 text-white"
                        }`}
                        title={item.fixture}
                      >
                        {item.result}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        )}

        {type === "tournament" && tournament && tournamentCharts && (
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <SectionCard eyebrow="Timeline" title="Goals and cards by fixture">
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tournamentCharts.timeline}>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="fixture" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px" }} />
                    <Bar dataKey="totalGoals" fill="#22c55e" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="cards" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard eyebrow="Top performers" title="Who is changing the tournament">
              <div className="space-y-3">
                {tournamentCharts.performers.map((performer, index) => (
                  <Link
                    key={performer.slug}
                    href={`/player/${performer.slug}`}
                    className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-lg font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{performer.name}</p>
                        <p className="mt-1 text-sm text-text-muted">{performer.position}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-text-muted">
                      <p className="font-semibold text-white">{performer.goals} G / {performer.assists} A</p>
                      <p className="mt-1 text-amber-300">{performer.rating.toFixed(1)} rating</p>
                    </div>
                  </Link>
                ))}
              </div>
            </SectionCard>

            <SectionCard eyebrow="Discipline" title="Cards by team">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tournamentCharts.cardPressure}>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="team" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px" }} />
                    <Bar dataKey="yellows" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="reds" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard eyebrow="Team form" title="Comparative strength radar">
              <div className="grid gap-4 lg:grid-cols-2">
                {tournamentCharts.comparisonRadar.map((teamProfile, index) => (
                  <div key={teamProfile.team} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">{teamProfile.team}</h3>
                      <span className="text-xs uppercase tracking-[0.18em] text-text-muted">Team {index + 1}</span>
                    </div>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                          data={[
                            { subject: "Attack", value: teamProfile.attack },
                            { subject: "Defence", value: teamProfile.defence },
                            { subject: "Form", value: teamProfile.form },
                            { subject: "Discipline", value: teamProfile.discipline }
                          ]}
                        >
                          <PolarGrid stroke="rgba(148,163,184,0.2)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                          <Radar dataKey="value" stroke={chartPalette[index]} fill={chartPalette[index]} fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}
      </section>
    </div>
  );
}
