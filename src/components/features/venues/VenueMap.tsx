import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card } from "../../common";
import { VenueDetail } from "@/types";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface VenueMapProps {
  venue: VenueDetail;
}

export const VenueMap: React.FC<VenueMapProps> = ({ venue }) => {
  // If no coordinates, show placeholder
  if (!venue.latitude || !venue.longitude) {
    return (
      <Card>
        <h3 className="mb-4">Hitta hit</h3>
        <div className="w-full h-64 bg-neutral-bg rounded-lg flex items-center justify-center mb-4">
          <div className="text-center">
            <MapPin size={32} className="mx-auto mb-2 text-neutral-secondary" />
            <p className="text-neutral-secondary text-sm">Ingen karta tillgänglig</p>
          </div>
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
  }

  return (
    <Card>
      <h3 className="mb-4">Hitta hit</h3>

      {/* Leaflet Map */}
      <div className="w-full h-64 rounded-lg overflow-hidden mb-4">
        <MapContainer
          center={[venue.latitude, venue.longitude]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[venue.latitude, venue.longitude]}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold mb-1">{venue.name}</p>
                <p className="text-neutral-secondary">{venue.address}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Address info */}
      <div className="space-y-2 text-sm">
        <p className="font-semibold">{venue.name}</p>
        <p className="text-neutral-secondary">{venue.address}</p>
        <p className="text-neutral-secondary">
          {venue.postalCode} {venue.city}
        </p>
      </div>

      {/* Coordinates (small text) */}
      <div className="mt-3 pt-3 border-t border-neutral-stroke text-xs text-neutral-secondary">
        <p>
          Koordinater: {venue.latitude.toFixed(6)}, {venue.longitude.toFixed(6)}
        </p>
      </div>
    </Card>
  );
};
