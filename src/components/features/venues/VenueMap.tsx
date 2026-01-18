import React from "react";
import { Card } from "../../common";
import { VenueDetail } from "@/types";

interface VenueMapProps {
  venue: VenueDetail;
}

export const VenueMap: React.FC<VenueMapProps> = ({ venue }) => {
  return (
    <Card>
      <h3 className="mb-4">Hitta hit</h3>

      {/* Placeholder for map */}
      <div className="w-full h-64 bg-neutral-bg rounded-lg flex items-center justify-center mb-4">
        <p className="text-neutral-secondary">🗺️ Karta kommer här (Leaflet integration)</p>
      </div>

      <div className="space-y-2 text-sm">
        <p className="font-semibold">{venue.name}</p>
        <p className="text-neutral-secondary">{venue.address}</p>
        <p className="text-neutral-secondary">
          {venue.postalCode} {venue.city}
        </p>
      </div>
    </Card>
  );
};
