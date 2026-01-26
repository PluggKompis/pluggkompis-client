import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { VenueCard } from "../components/features/venues/VenueCard";
import { VenueFilters } from "../components/features/venues/VenueFilters";
import { EmptyState, Spinner, Button } from "../components/common";
import { Venue, Subject, WeekDay } from "@/types";
import { venueService, subjectService } from "@/services";

export const VenuesPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter state
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

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

  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const result = await venueService.getVenues({
          isActive: true,
          pageSize: 1000,
        });
        if (result.isSuccess && result.data) {
          const cities = [...new Set(result.data.items.map((v) => v.city))].sort();
          setAvailableCities(cities);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };
    fetchCities();
  }, []);

  // Fetch venues when filters change
  useEffect(() => {
    const fetchVenues = async () => {
      setIsLoading(true);
      setError("");

      try {
        const result = await venueService.getVenues({
          city: selectedCity || undefined,
          subjectIds: selectedSubjectIds.length > 0 ? selectedSubjectIds : undefined,
          daysOfWeek: selectedDays.length > 0 ? selectedDays : undefined,
          isActive: true,
          pageNumber: currentPage,
          pageSize: pageSize,
        });

        if (result.isSuccess && result.data) {
          setVenues(result.data.items);
          setTotalCount(result.data.totalCount);
        } else {
          setError(result.errors?.join(", ") || "Kunde inte hämta platser");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Ett fel uppstod";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, [selectedCity, selectedSubjectIds, selectedDays, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCity, selectedSubjectIds, selectedDays]);

  // Count active filters
  const activeFilterCount =
    (selectedCity ? 1 : 0) + selectedSubjectIds.length + selectedDays.length;

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2">Hitta Läxhjälp</h1>
        <p className="text-neutral-secondary text-lg">Sök efter lediga läxhjälpspass nära dig</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error rounded-lg">
          <p className="text-error">{error}</p>
        </div>
      )}

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          size="md"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <SlidersHorizontal size={20} />
          Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <VenueFilters
            subjects={subjects}
            availableCities={availableCities}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            selectedSubjectIds={selectedSubjectIds}
            onSubjectIdsChange={setSelectedSubjectIds}
            selectedDays={selectedDays}
            onDaysChange={setSelectedDays}
            isOpen={isMobileFiltersOpen}
            onClose={() => setIsMobileFiltersOpen(false)}
          />
        </aside>

        {/* Venue List */}
        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : venues.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-neutral-secondary">
                Visar {venues.length} av {totalCount} platser
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {venues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Föregående
                  </Button>

                  <span className="px-4 py-2 text-sm">
                    Sida {currentPage} av {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Nästa
                  </Button>
                </div>
              )}
            </>
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
