import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { VenueCard } from "../components/features/venues/VenueCard";
import { VenueFilters } from "../components/features/venues/VenueFilters";
import { EmptyState, Spinner, Button } from "../components/common";
import { Venue, Subject, WeekDay } from "@/types";
import { venueService, subjectService } from "@/services";

export const VenuesPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string>("");

  // Filter state
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedDay, setSelectedDay] = useState<WeekDay | "">("");

  // Fetch subjects on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const result = await subjectService.getAll();
        if (result.isSuccess && result.data) {
          setSubjects(result.data);
        } else {
          console.error("Failed to fetch subjects:", result.errors);
        }
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch venues when filters change
  useEffect(() => {
    const fetchVenues = async () => {
      setIsLoading(true);
      setError("");

      try {
        const result = await venueService.getVenues({
          city: selectedCity || undefined,
          subjectId: selectedSubjectId || undefined,
          dayOfWeek: selectedDay || undefined,
          isActive: true,
        });

        if (result.isSuccess && result.data) {
          setVenues(result.data);
        } else {
          setError(result.errors?.join(", ") || "Kunde inte hämta platser");
        }
      } catch (err) {
        // ✅ Remove type annotation
        const errorMessage = err instanceof Error ? err.message : "Ett fel uppstod";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, [selectedCity, selectedSubjectId, selectedDay]);

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

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error rounded-lg">
          <p className="text-error">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <VenueFilters
            subjects={subjects}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            selectedSubjectId={selectedSubjectId}
            onSubjectChange={setSelectedSubjectId}
            selectedDay={selectedDay}
            onDayChange={setSelectedDay}
          />
        </aside>

        {/* Venue List */}
        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : venues.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {venues.map((venue) => (
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
