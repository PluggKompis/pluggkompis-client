import React, { useState, useEffect } from "react";
import { MapPin, Mail, Phone, AlertCircle, Calendar, BookOpen } from "lucide-react";
import { Card, Button, Tag, Spinner, SubjectTag } from "../../common";
import { venueService } from "@/services";
import { Venue } from "@/types";
import { VenueEditModal } from "./VenueEditModal";

export const VenueInfo: React.FC = () => {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchVenue();
  }, []);

  const fetchVenue = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await venueService.getMyVenue();

      if (result.isSuccess && result.data) {
        setVenue(result.data);
      } else {
        setError(result.errors?.[0] || "Kunde inte hitta din plats");
      }
    } catch (err) {
      console.error("Failed to fetch venue:", err);
      setError("Ett oväntat fel uppstod");
    } finally {
      setLoading(false);
    }
  };

  const handleModalSuccess = () => {
    setIsEditModalOpen(false);
    fetchVenue();
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Spinner size="lg" />
        <p className="text-neutral-secondary">Laddar plats...</p>
      </div>
    );
  }

  // Error state - No venue
  if (error || !venue) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={24} className="text-primary flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Ingen plats registrerad</h3>
              <p className="text-sm text-neutral-secondary mb-4">
                Du behöver skapa en plats för att kunna hantera volontärer och tidspass.
              </p>
              <Button variant="primary" onClick={() => setIsEditModalOpen(true)}>
                Skapa plats
              </Button>
            </div>
          </div>
        </div>

        {isEditModalOpen && (
          <VenueEditModal
            venue={null}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={handleModalSuccess}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2>Min Plats</h2>
        <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>
          Redigera plats
        </Button>
      </div>

      {/* Two-column layout on desktop */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column (wider) - 2/3 width on desktop */}
        <div className="lg:col-span-2 space-y-6">
          {/* Venue Details */}
          <Card>
            <h3 className="mb-4">Platsinformation</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-secondary mb-1">Platsnamn</p>
                <p className="font-semibold">{venue.name}</p>
              </div>

              <div>
                <p className="text-sm text-neutral-secondary mb-1">Adress</p>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-neutral-secondary mt-1 flex-shrink-0" />
                  <p className="font-semibold">
                    {venue.address}, {venue.postalCode} {venue.city}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-neutral-secondary mb-1">Beskrivning</p>
                <p className="text-neutral-secondary">{venue.description}</p>
              </div>

              <div className="pt-3 border-t border-neutral-stroke">
                <p className="text-sm text-neutral-secondary mb-2">Kontaktinformation</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-neutral-secondary" />
                    <p className="font-semibold">{venue.contactEmail}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-neutral-secondary" />
                    <p className="font-semibold">{venue.contactPhone}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-stroke">
                <p className="text-sm text-neutral-secondary mb-1">Status</p>
                <Tag variant={venue.isActive ? "success" : "error"}>
                  {venue.isActive ? "Aktiv" : "Inaktiv"}
                </Tag>
              </div>
            </div>
          </Card>

          {/* Available Subjects */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1">Tillgängliga ämnen</h3>
                <p className="text-sm text-neutral-secondary">Ämnen som erbjuds i dina tidspass</p>
              </div>
              <BookOpen size={20} className="text-neutral-secondary" />
            </div>

            {venue.availableSubjects && venue.availableSubjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {venue.availableSubjects.map((subject) => (
                  <SubjectTag key={subject.id} name={subject.name} icon={subject.icon} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-neutral-secondary text-sm">
                <p className="mb-1">Inga ämnen än</p>
                <p className="text-xs">Ämnen läggs till automatiskt när du skapar tidspass</p>
              </div>
            )}
          </Card>

          {/* Available Days */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1">Öppna dagar</h3>
                <p className="text-sm text-neutral-secondary">Dagar när läxhjälp erbjuds</p>
              </div>
              <Calendar size={20} className="text-neutral-secondary" />
            </div>

            {venue.availableDays && venue.availableDays.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {venue.availableDays.map((day) => (
                  <Tag key={day} variant="default">
                    {day}
                  </Tag>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-neutral-secondary text-sm">
                <p className="mb-1">Inga dagar med läxhjälp än</p>
                <p className="text-xs">Dagar läggs till automatiskt när du skapar tidspass</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right column (narrower) - 1/3 width on desktop */}
        <div className="space-y-6">
          {/* Map Card */}
          {venue.latitude && venue.longitude ? (
            <Card>
              <h3 className="mb-4">Karta</h3>
              <div className="aspect-square bg-neutral-bg rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${venue.longitude - 0.01},${venue.latitude - 0.01},${venue.longitude + 0.01},${venue.latitude + 0.01}&layer=mapnik&marker=${venue.latitude},${venue.longitude}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Venue location"
                />
              </div>
              <div className="mt-3 text-xs text-neutral-secondary">
                <p>Koordinater:</p>
                <p className="font-mono">
                  {venue.latitude.toFixed(6)}, {venue.longitude.toFixed(6)}
                </p>
              </div>
            </Card>
          ) : (
            <Card>
              <h3 className="mb-4">Karta</h3>
              <div className="aspect-square bg-neutral-bg rounded-lg flex items-center justify-center">
                <div className="text-center p-6">
                  <MapPin size={32} className="mx-auto mb-3 text-neutral-secondary" />
                  <p className="text-sm text-neutral-secondary mb-2">Ingen karta tillgänglig</p>
                  <p className="text-xs text-neutral-secondary">
                    Lägg till koordinater för att visa platsen på kartan
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Quick Stats Card (optional - could add more info here) */}
          <Card>
            <h3 className="mb-4">Snabbfakta</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-secondary">Koordinator</span>
                <span className="text-sm font-semibold">{venue.coordinatorName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-secondary">Stad</span>
                <span className="text-sm font-semibold">{venue.city}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <VenueEditModal
          venue={venue}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};
