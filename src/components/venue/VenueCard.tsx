import Link from "next/link";
import { Venue } from "@/types";
import { MapPin, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Link href={`/venues/${venue.slug}`} className="block group">
      <div className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface/75 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/30">
        <div className="relative h-36 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_40%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0.02))]">
          {venue.imageUrls && venue.imageUrls[0] ? (
            <img src={venue.imageUrls[0]} alt={venue.name} className="w-full h-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <MapPin size={28} className="text-text-muted" />
            </div>
          )}
          {venue.isVerified && (
            <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-background/85 p-1.5 shadow-card">
              <CheckCircle2 size={16} className="text-secondary" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-1 text-base font-semibold text-white">{venue.name}</h3>
          <p className="mb-3 flex items-center gap-1 text-xs text-text-muted">
            <MapPin size={12} className="shrink-0" />
            {venue.city}, {venue.state}
          </p>

          <div className="mt-auto flex flex-wrap gap-1.5">
            {venue.facilities.slice(0, 3).map((f) => (
              <Badge key={f} variant="secondary" className="border-white/10 bg-white/8 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-text-muted">
                {f}
              </Badge>
            ))}
            {venue.facilities.length > 3 && (
              <Badge variant="secondary" className="border-white/10 bg-white/8 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-text-muted">
                +{venue.facilities.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
