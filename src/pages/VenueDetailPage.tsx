import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Clock, AlertCircle } from "lucide-react";
import { VenueDetail } from "../components/features/venues/VenueDetail";
import { VenueSchedule } from "../components/features/venues/VenueSchedule";
import { VenueMap } from "../components/features/venues/VenueMap";
import { VolunteerCard } from "../components/features/venues/VolunteerCard";
import { Spinner } from "../components/common";
import { VenueDetail as VenueDetailType } from "@/types";
import { venueService } from "@/services";
import heroImage from "../assets/hero.jpg";

export const VenueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [venue, setVenue] = useState<VenueDetailType | null>(null);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"schedule" | "volunteers" | "about">("schedule");

  useEffect(() => {
    const fetchVenue = async () => {
      if (!id) return;

      setIsLoading(true);
      setError("");

      try {
        const result = await venueService.getVenueById(id);
        if (result.isSuccess && result.data) {
          setVenue(result.data);
        } else {
          setError(result.errors?.join(", ") || "Kunde inte hitta platsen");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Ett fel uppstod";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto p-6 bg-error/10 border border-error rounded-lg flex items-start gap-3">
          <AlertCircle size={24} className="text-error flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">Kunde inte ladda plats</h3>
            <p className="text-sm text-neutral-secondary">{error || "Platsen hittades inte"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Venue Hero Section */}
      <div
        className="relative bg-cover bg-center h-80"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-primary-dark/80"></div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{venue.name}</h1>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-200">
                <MapPin size={20} />
                <span>
                  {venue.address}, {venue.city}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-200">
                <Clock size={20} />
                <span>Öppettider varierar</span>
              </div>
            </div>

            <p className="text-gray-200 mb-6 text-lg">{venue.description}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-stroke bg-white sticky top-[72px] z-40">
        <div className="container mx-auto px-4">
          <div className="tabs">
            <button
              onClick={() => setActiveTab("schedule")}
              className={`tab ${activeTab === "schedule" ? "tab-active" : ""}`}
            >
              Schema
            </button>
            <button
              onClick={() => setActiveTab("volunteers")}
              className={`tab ${activeTab === "volunteers" ? "tab-active" : ""}`}
            >
              Volontärer ({venue.volunteers.length})
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`tab ${activeTab === "about" ? "tab-active" : ""}`}
            >
              Om Platsen
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === "schedule" && <VenueSchedule venueId={id!} />}

        {/* Volunteer cards with proper component */}
        {activeTab === "volunteers" && (
          <div>
            <h2 className="mb-6">Våra Volontärer</h2>
            {venue.volunteers.length === 0 ? (
              <div className="text-center py-12 text-neutral-secondary">
                Inga volontärer registrerade ännu
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {venue.volunteers.map((volunteer) => (
                  <VolunteerCard key={volunteer.volunteerId} volunteer={volunteer} />
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "about" && (
          <div className="grid lg:grid-cols-2 gap-8">
            <VenueDetail venue={venue} />
            <VenueMap venue={venue} />
          </div>
        )}
      </div>
    </div>
  );
};
