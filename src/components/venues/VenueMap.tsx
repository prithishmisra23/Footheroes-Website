"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { MapPin, ShieldCheck } from "lucide-react";

import { Venue } from "@/types";

interface VenueMapProps {
  venues: Venue[];
  selectedVenueId?: string;
  heightClassName?: string;
}

const INDIA_CENTER: [number, number] = [22.5937, 78.9629];

export function VenueMap({ venues, selectedVenueId, heightClassName = "h-[420px]" }: VenueMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const center = useMemo<[number, number]>(() => {
    const selectedVenue = venues.find((venue) => venue.id === selectedVenueId);
    if (selectedVenue) {
      return [selectedVenue.lat, selectedVenue.lng];
    }

    return INDIA_CENTER;
  }, [selectedVenueId, venues]);

  if (!isMounted) {
    return (
      <div className={`overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface/70 ${heightClassName}`}>
        <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.14),_transparent_35%),linear-gradient(180deg,_rgba(255,255,255,0.03),_rgba(255,255,255,0.01))] text-sm text-text-muted">
          Loading venue map...
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-[1.75rem] border border-white/10 shadow-card ${heightClassName}`}>
      <MapContainer center={center} zoom={selectedVenueId ? 11 : 5} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains={["a", "b", "c", "d"]}
        />

        {venues.map((venue) => {
          const isSelected = venue.id === selectedVenueId;
          return (
            <CircleMarker
              key={venue.id}
              center={[venue.lat, venue.lng]}
              radius={isSelected ? 12 : 9}
              pathOptions={{
                color: isSelected ? "#f59e0b" : venue.isVerified ? "#22c55e" : "#64748b",
                fillColor: isSelected ? "#f59e0b" : venue.isVerified ? "#22c55e" : "#64748b",
                fillOpacity: 0.95,
                weight: 2
              }}
            >
              <Popup>
                <div className="min-w-[210px] p-1">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{venue.name}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-text-muted">
                        <MapPin size={12} />
                        {venue.city}, {venue.state}
                      </p>
                    </div>
                    {venue.isVerified && <ShieldCheck size={16} className="text-primary" />}
                  </div>

                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {(venue.facilities || []).slice(0, 3).map((facility) => (
                      <span
                        key={facility}
                        className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-text-muted"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/venues/${venue.slug}`}
                    className="inline-flex items-center rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
                  >
                    View venue
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
