"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, MapPin, Search, ShieldCheck, Sparkles, X } from "lucide-react";

import { VenueCard } from "@/components/venue/VenueCard";
import { mockMatches } from "@/mock/matches";
import { mockVenues } from "@/mock/venues";

const VenueMap = dynamic(
  () => import("@/components/venues/VenueMap").then((module) => module.VenueMap),
  { ssr: false, loading: () => <div className="h-[420px] animate-pulse rounded-[1.75rem] bg-surface/70" /> }
);

const surfaceOptions = ["All", "Artificial Turf", "Natural Grass"];
const facilityOptions = ["Floodlights", "Parking", "Stands", "Locker Rooms", "Changing Rooms", "Medical Room"];

export default function VenuesHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSurface, setActiveSurface] = useState("All");
  const [activeFacility, setActiveFacility] = useState("All");
  const [activeState, setActiveState] = useState("All");
  const [view, setView] = useState<"map" | "list">("map");
  const [showFilters, setShowFilters] = useState(false);

  const states = useMemo(
    () => ["All", ...Array.from(new Set(mockVenues.map((venue) => venue.state))).sort()],
    []
  );

  const filteredVenues = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return mockVenues.filter((venue) => {
      const matchesQuery =
        !query ||
        venue.name.toLowerCase().includes(query) ||
        venue.city.toLowerCase().includes(query) ||
        venue.state.toLowerCase().includes(query);
      const matchesSurface = activeSurface === "All" || venue.surface === activeSurface;
      const matchesFacility = activeFacility === "All" || venue.facilities.includes(activeFacility);
      const matchesState = activeState === "All" || venue.state === activeState;

      return matchesQuery && matchesSurface && matchesFacility && matchesState;
    });
  }, [activeFacility, activeState, activeSurface, searchQuery]);

  const stats = useMemo(
    () => ({
      totalVenues: mockVenues.length,
      verifiedVenues: mockVenues.filter((venue) => venue.isVerified).length,
      statesCovered: new Set(mockVenues.map((venue) => venue.state)).size,
      matchesHosted: mockMatches.length
    }),
    []
  );

  const clearFilters = () => {
    setActiveSurface("All");
    setActiveFacility("All");
    setActiveState("All");
  };

  return (
    <div className="min-h-screen bg-background pb-24 text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.12),_transparent_25%)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              <Sparkles size={14} />
              Venues
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-balance text-white sm:text-5xl">
              India&apos;s football ground database is starting to feel real.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-text-muted sm:text-lg">
              Explore verified turfs, community grounds, and stadiums. Filter by state, playing surface, and facilities
              to find the right home for your next tournament or scouting trip.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="section-shell min-w-[140px] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Venues</p>
              <p className="mt-3 text-3xl font-semibold text-white">{stats.totalVenues}</p>
            </div>
            <div className="section-shell min-w-[140px] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Verified</p>
              <p className="mt-3 text-3xl font-semibold text-primary">{stats.verifiedVenues}</p>
            </div>
            <div className="section-shell min-w-[140px] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">States</p>
              <p className="mt-3 text-3xl font-semibold text-white">{stats.statesCovered}</p>
            </div>
            <div className="section-shell min-w-[140px] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Matches</p>
              <p className="mt-3 text-3xl font-semibold text-secondary">{stats.matchesHosted}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by venue, city, or state..."
              className="w-full rounded-[1.5rem] border border-white/10 bg-surface/80 py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-text-muted focus:border-primary/40"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-full border border-white/10 bg-surface/70 p-1 sm:flex">
              {(["map", "list"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setView(option)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    view === option ? "bg-primary text-slate-950" : "text-text-muted hover:text-white"
                  }`}
                >
                  {option === "map" ? "Map view" : "List view"}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface/75 px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-primary/30 hover:text-primary lg:hidden"
            >
              <Filter size={16} />
              Filters
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="section-shell hidden h-fit p-5 lg:block">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Filters</p>
                <h2 className="mt-2 text-lg font-semibold text-white">Narrow the search</h2>
              </div>
              <button type="button" onClick={clearFilters} className="text-sm font-medium text-primary">
                Clear
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-text-muted">State</label>
                <select
                  value={activeState}
                  onChange={(event) => setActiveState(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-white outline-none"
                >
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-text-muted">Surface</label>
                <div className="flex flex-wrap gap-2">
                  {surfaceOptions.map((surface) => (
                    <button
                      key={surface}
                      type="button"
                      onClick={() => setActiveSurface(surface)}
                      className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                        activeSurface === surface
                          ? "border-primary/40 bg-primary text-slate-950"
                          : "border-white/10 bg-white/5 text-text-muted hover:text-white"
                      }`}
                    >
                      {surface}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-text-muted">Facility</label>
                <select
                  value={activeFacility}
                  onChange={(event) => setActiveFacility(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-white outline-none"
                >
                  <option value="All">All</option>
                  {facilityOptions.map((facility) => (
                    <option key={facility} value={facility}>
                      {facility}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            {view === "map" ? (
              <VenueMap venues={filteredVenues} />
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-text-muted">
                List view is active below. Switch back to the map any time to scout venues geographically.
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Results</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{filteredVenues.length} venues matched</h2>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-surface/60 px-4 py-2 text-sm text-text-muted sm:flex">
                <ShieldCheck size={16} className="text-primary" />
                Verified markers show trusted grounds.
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredVenues.map((venue) => (
                <div key={venue.id} className="space-y-3">
                  <VenueCard venue={venue} />
                  <div className="rounded-[1.5rem] border border-white/10 bg-surface/70 p-4 text-sm text-text-muted">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-semibold text-white">{venue.surface || "Football Ground"}</span>
                      <span>{venue.capacity ? `${venue.capacity.toLocaleString()} capacity` : "Community venue"}</span>
                    </div>
                    <p className="line-clamp-2">{venue.address}</p>
                    <Link href={`/venues/${venue.slug}`} className="mt-4 inline-flex items-center gap-2 font-semibold text-primary">
                      <MapPin size={14} />
                      Open venue profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 lg:hidden"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="absolute bottom-0 left-0 right-0 rounded-t-[2rem] border-t border-white/10 bg-background px-5 pb-8 pt-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Venue filters</h3>
                <button type="button" onClick={() => setShowFilters(false)} className="rounded-full border border-white/10 p-2 text-text-muted">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="rounded-[1.5rem] border border-white/10 bg-surface/65 p-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.18em] text-text-muted">View</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(["map", "list"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setView(option)}
                        className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                          view === option ? "bg-primary text-slate-950" : "bg-white/5 text-text-muted"
                        }`}
                      >
                        {option === "map" ? "Map" : "List"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-surface/65 p-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.18em] text-text-muted">State</p>
                  <select
                    value={activeState}
                    onChange={(event) => setActiveState(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-white outline-none"
                  >
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-surface/65 p-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.18em] text-text-muted">Surface</p>
                  <div className="flex flex-wrap gap-2">
                    {surfaceOptions.map((surface) => (
                      <button
                        key={surface}
                        type="button"
                        onClick={() => setActiveSurface(surface)}
                        className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${
                          activeSurface === surface
                            ? "border-primary/40 bg-primary text-slate-950"
                            : "border-white/10 bg-white/5 text-text-muted"
                        }`}
                      >
                        {surface}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-surface/65 p-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.18em] text-text-muted">Facility</p>
                  <select
                    value={activeFacility}
                    onChange={(event) => setActiveFacility(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="All">All</option>
                    {facilityOptions.map((facility) => (
                      <option key={facility} value={facility}>
                        {facility}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={clearFilters} className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-text-muted">
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-slate-950"
                  >
                    Show venues
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
