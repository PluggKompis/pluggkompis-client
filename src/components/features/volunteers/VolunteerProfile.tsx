import React, { useState, useEffect } from "react";
import { User, Briefcase, Clock, AlertCircle, Edit2 } from "lucide-react";
import { Button, Card, EmptyState, Spinner, SubjectTag } from "@/components/common";
import { volunteerService } from "@/services/volunteerService";
import { VolunteerProfileDto, VolunteerProfileSubjectFlat } from "@/types";
import { VolunteerProfileForm } from "./VolunteerProfileForm";

export const VolunteerProfile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<VolunteerProfileDto | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch volunteer's profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await volunteerService.getMyProfile();

      if (result.isSuccess && result.data) {
        setProfile(result.data);
      } else {
        // No profile exists yet (404 is expected)
        if (result.statusCode === 404) {
          setProfile(null);
        } else {
          setError(result.errors?.[0] || "Kunde inte hämta profil.");
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      // Likely 404 - no profile yet
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle successful profile save
  const handleSaveSuccess = () => {
    setIsEditing(false);
    setSuccessMessage("Profilen har sparats!");

    // Auto-dismiss success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);

    fetchProfile(); // Refresh profile data
  };

  // Transform backend nested subject structure to flat structure for display and editing
  const flattenSubjects = (
    subjects: VolunteerProfileDto["subjects"]
  ): VolunteerProfileSubjectFlat[] => {
    return subjects.map((s) => ({
      subjectId: s.subject.id,
      subjectName: s.subject.name,
      subjectIcon: s.subject.icon,
      confidenceLevel: s.confidenceLevel,
    }));
  };

  // Get confidence level badge styling
  const getConfidenceBadge = (level: string) => {
    const badges = {
      Advanced: {
        text: "Expert",
        className: "bg-confidence-advanced text-primary-dark", // Rich gold
      },
      Intermediate: {
        text: "Erfaren",
        className: "bg-confidence-intermediate text-primary-dark", // Medium amber
      },
      Beginner: {
        text: "Nybörjare",
        className: "bg-confidence-beginner text-primary-dark", // Light peach
      },
    };

    const badge = badges[level as keyof typeof badges] || badges.Beginner;

    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-error/10 border border-error rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-error font-medium">{error}</p>
            <Button onClick={fetchProfile} variant="outline" size="sm" className="mt-3">
              Försök igen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - No profile exists
  if (!profile && !isEditing) {
    return (
      <div>
        <EmptyState
          icon={User}
          title="Ingen volontärprofil"
          description="Du måste skapa en profil innan du kan söka till platser. Din profil hjälper koordinatorer och föräldrar att lära känna dig."
          action={{
            label: "Skapa profil",
            onClick: () => setIsEditing(true),
          }}
        />
      </div>
    );
  }

  // Edit/Create form state
  if (isEditing || !profile) {
    return (
      <div className="max-w-3xl mx-auto">
        <VolunteerProfileForm
          profile={
            profile ? { ...profile, subjects: flattenSubjects(profile.subjects) } : undefined
          }
          onSuccess={handleSaveSuccess}
          onCancel={() => {
            setIsEditing(false);
            if (!profile) {
              // If no profile exists and user cancels, stay on empty state
              fetchProfile();
            }
          }}
        />
      </div>
    );
  }

  // View state - Display profile
  return (
    <div className="space-y-6">
      {/* Header with edit button */}
      <div className="flex justify-between items-center">
        <h2>Min Volontärprofil</h2>
        <Button variant="primary" size="sm" onClick={() => setIsEditing(true)}>
          <span className="flex items-center">
            <Edit2 size={16} className="mr-2" />
            Redigera profil
          </span>
        </Button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-success/10 border border-success rounded-lg flex items-start gap-3">
          <svg
            className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-success font-medium">{successMessage}</p>
        </div>
      )}

      {/* Two-column layout on desktop */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Bio Section */}
          <Card>
            <div className="flex items-start gap-3 mb-4">
              <User size={20} className="text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Om mig</h3>
                <p className="text-neutral-secondary whitespace-pre-wrap">{profile.bio}</p>
              </div>
            </div>
          </Card>

          {/* Experience Section */}
          <Card>
            <div className="flex items-start gap-3 mb-4">
              <Briefcase size={20} className="text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Erfarenhet</h3>
                <p className="text-neutral-secondary whitespace-pre-wrap">{profile.experience}</p>
              </div>
            </div>
          </Card>

          {/* Max Hours Section */}
          {profile.maxHoursPerWeek && (
            <Card>
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-primary mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Tillgänglighet</h3>
                  <p className="text-neutral-secondary">
                    Max {profile.maxHoursPerWeek} timmar per vecka
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Subjects Section */}
          <Card>
            <h3 className="font-semibold mb-4">Ämnen jag kan hjälpa till med</h3>
            <div className="space-y-3">
              {flattenSubjects(profile.subjects).map((subject) => (
                <div key={subject.subjectId} className="flex items-center justify-between">
                  <SubjectTag name={subject.subjectName} icon={subject.subjectIcon} />
                  {getConfidenceBadge(subject.confidenceLevel)}
                </div>
              ))}
            </div>
          </Card>

          {/* My Venues Section - Shows approved venues only */}
          <Card>
            <h3 className="font-semibold mb-4">Mina Platser</h3>
            {/* TODO: Connect to backend endpoint GET /api/volunteers/me/applications when available */}
            {/* For now, show placeholder */}
            <div className="text-center py-6 text-neutral-secondary text-sm">
              <p className="mb-2">Du har inte blivit godkänd till några platser ännu.</p>
              <p className="text-xs">
                När en koordinator godkänner din ansökan kommer platsen att visas här.
              </p>
            </div>
            {/* 
            When backend endpoint exists, show:
            {approvedVenues.length > 0 ? (
              <div className="space-y-2">
                {approvedVenues.map((venue) => (
                  <div key={venue.id} className="p-3 bg-success/5 border border-success/20 rounded-lg">
                    <p className="font-medium text-sm">{venue.venueName}</p>
                    <p className="text-xs text-neutral-secondary">
                      Godkänd {new Date(venue.approvedAt).toLocaleDateString('sv-SE')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-neutral-secondary text-sm">
                ...placeholder above...
              </div>
            )}
            */}
          </Card>
        </div>
      </div>
    </div>
  );
};
