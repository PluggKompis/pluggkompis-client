import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link temporarily
import { Search } from "lucide-react";
import { VenueCard } from "../components/features/venues/VenueCard";
import { VenueFilters } from "../components/features/venues/VenueFilters";
import { EmptyState, Spinner, Button } from "../components/common";
import { Venue } from "@/types/venue.types";

export const VenuesPage: React.FC = () => {
  const [isLoading] = useState(false);
  const [venues] = useState<Venue[]>([]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2">Hitta Läxhjälp</h1>
        <p className="text-neutral-secondary text-lg">Sök efter lediga läxhjälpspass nära dig</p>

        {/* 🔗 TEMP LINK TO VENUE DETAIL */}
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 mb-2">
            🚧 <strong>Development:</strong> Temp link to venue detail page
          </p>
          <Link to="/venues/1">
            <Button variant="outline" size="sm">
              → Go to Venue Detail (ID: 1)
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <VenueFilters />
        </aside>

        {/* Venue List */}
        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : venues.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {venues.map((venue: Venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="Inga platser hittades"
              description="Prova att ändra dina sökfilter"
            />
          )}
        </main>
      </div>
    </div>
  );
};
