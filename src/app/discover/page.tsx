"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Radar, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";

import { PlayerCard } from "@/components/player/PlayerCard";
import { Button } from "@/components/ui/Button";
import { mockTeams } from "@/mock/teams";
import type { Player } from "@/types";

type Position =
  | "goalkeeper"
  | "centre_back"
  | "right_back"
  | "left_back"
  | "defensive_midfielder"
  | "central_midfielder"
  | "attacking_midfielder"
  | "right_winger"
  | "left_winger"
  | "striker"
  | "centre_forward";

interface Filters {
  q: string;
  position: Position[];
  minAge: string;
  maxAge: string;
  state: string;
  minGoals: string;
  minMatches: string;
  minRating: string;
  foot: string;
}

const defaultFilters: Filters = {
  q: "",
  position: [],
  minAge: "",
  maxAge: "",
  state: "",
  minGoals: "",
  minMatches: "",
  minRating: "",
  foot: "",
};

const PRESETS: Array<{ label: string; filters: Partial<Filters> }> = [
  { label: "U17 Goalkeepers in Kerala", filters: { position: ["goalkeeper"], maxAge: "17", state: "Kerala" } },
  { label: "U21 Strikers with 20+ goals", filters: { position: ["striker", "centre_forward"], maxAge: "21", minGoals: "20" } },
  { label: "Defenders in West Bengal", filters: { position: ["centre_back", "right_back", "left_back"], state: "West Bengal" } },
  { label: "Top Rated Midfielders", filters: { position: ["central_midfielder", "attacking_midfielder", "defensive_midfielder"], minRating: "8.5" } },
];

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const POSITIONS: Array<{ value: Position; label: string }> = [
  { value: "goalkeeper", label: "Goalkeeper" },
  { value: "centre_back", label: "Centre Back" },
  { value: "right_back", label: "Right Back" },
  { value: "left_back", label: "Left Back" },
  { value: "defensive_midfielder", label: "Defensive Midfielder" },
  { value: "central_midfielder", label: "Central Midfielder" },
  { value: "attacking_midfielder", label: "Attacking Midfielder" },
  { value: "right_winger", label: "Right Winger" },
  { value: "left_winger", label: "Left Winger" },
  { value: "striker", label: "Striker" },
  { value: "centre_forward", label: "Centre Forward" },
];

export default function DiscoverPage() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Player[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState("rating");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const fetchResults = useCallback(async () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (filters.q) params.append("q", filters.q);
    if (filters.position.length > 0) params.append("position", filters.position.join(","));
    if (filters.minAge) params.append("minAge", filters.minAge);
    if (filters.maxAge) params.append("maxAge", filters.maxAge);
    if (filters.state) params.append("state", filters.state);
    if (filters.minGoals) params.append("minGoals", filters.minGoals);
    if (filters.minMatches) params.append("minMatches", filters.minMatches);
    if (filters.minRating) params.append("minRating", filters.minRating);
    if (filters.foot) params.append("foot", filters.foot);

    try {
      const response = await fetch(`/api/discover/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = (await response.json()) as { data: Player[]; total: number };
      setResults(data.data);
      setTotalCount(data.total);
    } catch (error) {
      console.error(error);
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchResults();
  }, [fetchResults]);

  const sortedResults = useMemo(() => {
    const items = [...results];
    if (sortBy === "goals") {
      items.sort((a, b) => b.stats.careerGoals - a.stats.careerGoals);
    } else if (sortBy === "matches") {
      items.sort((a, b) => b.stats.careerMatches - a.stats.careerMatches);
    } else {
      items.sort((a, b) => b.stats.currentSeasonRating - a.stats.currentSeasonRating);
    }
    return items;
  }, [results, sortBy]);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const togglePosition = (position: Position) => {
    setFilters((current) => ({
      ...current,
      position: current.position.includes(position)
        ? current.position.filter((item) => item !== position)
        : [...current.position, position],
    }));
  };

  const activeFilterCount =
    filters.position.length +
    [filters.minAge, filters.maxAge, filters.state, filters.minGoals, filters.minMatches, filters.minRating, filters.foot].filter(Boolean).length;

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-primary">Filters</p>
          <h2 className="mt-2 font-bebas text-3xl tracking-[0.08em] text-white">Scout Logic</h2>
        </div>
        <button
          type="button"
          onClick={() => setFilters(defaultFilters)}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted transition-colors hover:text-white"
        >
          Reset
        </button>
      </div>

      <div>
        <h3 className="mb-3 text-[11px] uppercase tracking-[0.24em] text-text-muted">Position</h3>
        <div className="flex flex-wrap gap-2">
          {POSITIONS.map((position) => {
            const isSelected = filters.position.includes(position.value);
            return (
              <button
                key={position.value}
                type="button"
                onClick={() => togglePosition(position.value)}
                className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-white/10 bg-white/5 text-text-muted hover:border-primary/40 hover:text-white"
                }`}
              >
                {position.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <h3 className="mb-2 text-[11px] uppercase tracking-[0.24em] text-text-muted">Min Age</h3>
          <input
            type="number"
            value={filters.minAge}
            onChange={(event) => updateFilter("minAge", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-text-muted focus:border-primary/40"
            placeholder="15"
          />
        </div>
        <div>
          <h3 className="mb-2 text-[11px] uppercase tracking-[0.24em] text-text-muted">Max Age</h3>
          <input
            type="number"
            value={filters.maxAge}
            onChange={(event) => updateFilter("maxAge", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-text-muted focus:border-primary/40"
            placeholder="21"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-[11px] uppercase tracking-[0.24em] text-text-muted">State</h3>
        <select
          value={filters.state}
          onChange={(event) => updateFilter("state", event.target.value)}
          className="w-full appearance-none rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary/40"
        >
          <option value="">All States</option>
          {STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <h3 className="mb-2 text-[11px] uppercase tracking-[0.24em] text-text-muted">Goals</h3>
          <input
            type="number"
            value={filters.minGoals}
            onChange={(event) => updateFilter("minGoals", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary/40"
            placeholder="10"
          />
        </div>
        <div>
          <h3 className="mb-2 text-[11px] uppercase tracking-[0.24em] text-text-muted">Matches</h3>
          <input
            type="number"
            value={filters.minMatches}
            onChange={(event) => updateFilter("minMatches", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary/40"
            placeholder="8"
          />
        </div>
        <div>
          <h3 className="mb-2 text-[11px] uppercase tracking-[0.24em] text-text-muted">Rating</h3>
          <input
            type="number"
            step="0.1"
            value={filters.minRating}
            onChange={(event) => updateFilter("minRating", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary/40"
            placeholder="7.5"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[11px] uppercase tracking-[0.24em] text-text-muted">Preferred Foot</h3>
        <div className="grid grid-cols-3 gap-2">
          {["Left", "Right", "Both"].map((foot) => (
            <button
              key={foot}
              type="button"
              onClick={() => updateFilter("foot", filters.foot === foot ? "" : foot)}
              className={`rounded-2xl border px-3 py-3 text-xs font-semibold transition-colors ${
                filters.foot === foot
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-white/10 bg-white/5 text-text-muted hover:border-primary/40 hover:text-white"
              }`}
            >
              {foot}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent pb-20 text-text">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.2),_transparent_30%),linear-gradient(135deg,_rgba(17,29,53,0.95),_rgba(10,22,40,0.98))] px-5 py-8 shadow-card sm:px-8 sm:py-10">
          <div className="absolute inset-0 pitch-grid opacity-20" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-primary">
                <Sparkles size={13} />
                Verified Discovery
              </div>
              <h1 className="font-bebas text-5xl tracking-[0.08em] text-white sm:text-6xl">DISCOVERY ENGINE</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
                Search India&apos;s grassroots football network by role, location, age, production, and form. This surface is built for scouting, not casual browsing.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:w-auto">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center">
                <div className="font-bebas text-3xl tracking-[0.08em] text-white">{totalCount || 12}</div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-text-muted">Results</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center">
                <div className="font-bebas text-3xl tracking-[0.08em] text-white">{activeFilterCount}</div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-text-muted">Filters</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center">
                <div className="flex justify-center text-primary">
                  <Radar size={28} />
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.24em] text-text-muted">Scout Mode</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-surface/70 p-4 shadow-card backdrop-blur-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={filters.q}
                onChange={(event) => updateFilter("q", event.target.value)}
                placeholder="Search by player name, city, or scouting context..."
                className="w-full rounded-2xl border border-white/10 bg-background/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-text-muted focus:border-primary/40"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="appearance-none rounded-2xl border border-white/10 bg-background/70 px-4 py-3 pr-10 text-sm text-white outline-none transition-colors focus:border-primary/40"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="goals">Most Goals</option>
                  <option value="matches">Most Matches</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted" />
              </div>

              <button
                type="button"
                onClick={() => setShowMobileFilters(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-primary/40 hover:bg-primary/10 md:hidden"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setFilters({ ...defaultFilters, ...preset.filters });
                  setShowMobileFilters(false);
                }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-text-muted transition-colors hover:border-primary/40 hover:text-white"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row">
          <aside className="hidden w-80 shrink-0 lg:block">
            <div className="sticky top-28 rounded-[2rem] border border-white/10 bg-surface/70 p-5 shadow-card backdrop-blur-sm">
              <FilterPanel />
            </div>
          </aside>

          <section className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted">Result Set</p>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  {loading ? "Searching players..." : `${totalCount} Players Found`}
                </h2>
              </div>
              <p className="hidden text-sm text-text-muted sm:block">Optimized for verified scouting filters and mobile review.</p>
            </div>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-64 rounded-[1.75rem] border border-white/10 bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : sortedResults.length === 0 ? (
              <div className="rounded-[2rem] border border-white/10 bg-surface/70 p-10 text-center shadow-card">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-text-muted">
                  <Search size={28} />
                </div>
                <h3 className="mt-6 font-bebas text-4xl tracking-[0.08em] text-white">NO PLAYERS FOUND</h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-text-muted">
                  Broaden the scouting filters or try a different state, role, or performance threshold to expand the search pool.
                </p>
                <Button variant="primary" className="mt-6 rounded-full px-6" onClick={() => setFilters(defaultFilters)}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {sortedResults.map((player) => {
                  const team = player.currentTeamId ? mockTeams.find((item) => item.id === player.currentTeamId) : undefined;
                  return <PlayerCard key={player.id} player={player} teamName={team?.name} />;
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-[90] flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto border-l border-white/10 bg-surface px-5 py-5 shadow-card"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-primary">Filters</p>
                  <h2 className="mt-2 font-bebas text-3xl tracking-[0.08em] text-white">Scout View</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-text-muted"
                >
                  <X size={18} />
                </button>
              </div>

              <FilterPanel />

              <Button variant="primary" className="mt-6 w-full rounded-2xl py-3" onClick={() => setShowMobileFilters(false)}>
                Show Results
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
