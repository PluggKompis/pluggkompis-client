import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Clock, AlertCircle, FileText } from "lucide-react";
import { VenueDetail } from "../components/features/venues/VenueDetail";
import { VenueSchedule } from "../components/features/venues/VenueSchedule";
import { VenueMap } from "../components/features/venues/VenueMap";
import { VolunteerCard } from "../components/features/venues/VolunteerCard";
import { Spinner, Button } from "../components/common";
import { VenueDetail as VenueDetailType, UserRole } from "@/types";
import { venueService, volunteerService } from "@/services";
import { useAuth } from "@/hooks";
import heroImage from "../assets/hero.jpg";

export const VenueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [venue, setVenue] = useState<VenueDetailType | null>(null);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"schedule" | "volunteers" | "about">("schedule");
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  // Read tab from URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabFromUrl = params.get("tab");
    if (tabFromUrl === "about" || tabFromUrl === "volunteers" || tabFromUrl === "schedule") {
      setActiveTab(tabFromUrl);
    }
  }, []);

  const isVolunteer = user?.role === UserRole.Volunteer;

  // Check if user is already a volunteer at this venue
  const isAlreadyVolunteer = venue?.volunteers.some((v) => v.volunteerId === user?.id);

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

  // Handle volunteer application
  const handleApplyToVenue = async () => {
    if (!id) return;

    // Clear previous errors
    setApplyError(null);

    // Check if authenticated
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/venues/${id}` } });
      return;
    }

    try {
      setIsApplying(true);

      // Check if profile exists
      const profileResult = await volunteerService.getMyProfile();

      if (!profileResult.isSuccess || !profileResult.data) {
        // Defensive fallback if no profile data but no error thrown
        navigate("/volunteer", {
          state: { message: "Du måste skapa en volontärprofil innan du kan ansöka till platser." },
        });
        return;
      }

      // Apply to venue
      const applyResult = await venueService.applyToVenue({ venueId: id });

      if (applyResult.isSuccess) {
        setApplySuccess(true);
        setTimeout(() => {
          navigate("/volunteer", {
            state: {
              message: "Din ansökan har skickats! Koordinatorn kommer att granska den.",
              activeTab: "applications",
            },
          });
        }, 2000);
      } else {
        setApplyError("Du har redan ansökt till denna plats eller är redan volontär här.");
      }
    } catch (error: any) {
      // Axios error from getMyProfile or applyToVenue
      if (
        error.response?.status === 404 &&
        error.response?.data?.errors?.includes("Volunteer profile not found.")
      ) {
        // Redirect to create profile with message
        navigate("/volunteer", {
          state: { message: "Du måste skapa en volontärprofil innan du kan ansöka till platser." },
        });
      } else {
        console.error("Failed to apply:", error);
        setApplyError("Ett oväntat fel uppstod. Försök igen senare.");
      }
    } finally {
      setIsApplying(false);
    }
  };

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
            <h3 className="font-semibold mb-1">Kunde inte hitta platsen</h3>
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
        {/* Schedule Tab - Different view for volunteers */}
        {activeTab === "schedule" && !isVolunteer && <VenueSchedule venueId={id!} />}

        {activeTab === "schedule" && isVolunteer && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
              <FileText size={48} className="mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-xl mb-3">Volontärer bokar inte enskilda pass</h3>
              <p className="text-neutral-secondary mb-6">
                Som volontär ansöker du först till en plats. När du blivit godkänd kan du se och
                anmäla dig till lediga volontärpass under "Tillgängliga Pass" i din volontärpanel.
              </p>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate("/volunteer")}>
                  Gå till Volontärpanel
                </Button>

                {/* Show apply button only if not already a volunteer and not already applied successfully */}
                {!isAlreadyVolunteer && !applySuccess && (
                  <Button variant="primary" onClick={handleApplyToVenue} disabled={isApplying}>
                    {isApplying && <Spinner size="sm" className="mr-2" />}
                    Ansök till denna plats
                  </Button>
                )}

                {/* Success message */}
                {applySuccess && (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-success text-white rounded-lg font-semibold">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Ansökan skickad!
                  </div>
                )}

                {/* Already a volunteer message */}
                {isAlreadyVolunteer && (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-success/10 border border-success text-success rounded-lg font-semibold">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Du är redan volontär här
                  </div>
                )}
              </div>

              {/* Error message - below buttons */}
              {applyError && (
                <div className="mt-4 p-3 bg-error/10 border border-error rounded-lg flex items-start gap-2">
                  <AlertCircle size={18} className="text-error flex-shrink-0 mt-0.5" />
                  <p className="text-error text-sm">{applyError}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Volunteer cards */}
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
