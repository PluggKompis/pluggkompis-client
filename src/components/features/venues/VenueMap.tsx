import React from "react";
import { Card } from "../../common";

export const VenueMap: React.FC = () => {
  return (
    <Card>
      <h3 className="mb-4">Hitta hit</h3>

      {/* Placeholder for map */}
      <div className="w-full h-64 bg-neutral-bg rounded-lg flex items-center justify-center mb-4">
        <p className="text-neutral-secondary">🗺️ Karta kommer här (Leaflet integration)</p>
      </div>

      <div className="space-y-2 text-sm">
        <p className="font-semibold">Stadsbiblioteket</p>
        <p className="text-neutral-secondary">Götaplatsen 5</p>
        <p className="text-neutral-secondary">412 56 Göteborg</p>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-stroke">
        <p className="text-sm font-semibold mb-2">Kollektivtrafik</p>
        <p className="text-sm text-neutral-secondary">
          Spårvagn 1, 2, 3, 4, 5, 6, 7, 8, 13 till Korsvägen
        </p>
      </div>
    </Card>
  );
};
