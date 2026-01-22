// src/components/features/coordinator/VenueEditModal.tsx
import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { Button, Input } from "../../common";
import { venueService } from "@/services";
import { Venue, UpdateVenueRequest, CreateVenueRequest } from "@/types";

interface VenueEditModalProps {
  venue: Venue | null; // null means create mode
  onClose: () => void;
  onSuccess: () => void;
}

export const VenueEditModal: React.FC<VenueEditModalProps> = ({ venue, onClose, onSuccess }) => {
  const isCreateMode = !venue;

  const [formData, setFormData] = useState({
    name: venue?.name || "",
    address: venue?.address || "",
    city: venue?.city || "",
    postalCode: venue?.postalCode || "",
    description: venue?.description || "",
    contactEmail: venue?.contactEmail || "",
    contactPhone: venue?.contactPhone || "",
    isActive: venue?.isActive ?? true,
    latitude: venue?.latitude?.toString() || "",
    longitude: venue?.longitude?.toString() || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isActive: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.name.trim()) {
      setError("Platsnamn är obligatoriskt");
      return;
    }
    if (!formData.contactEmail.includes("@")) {
      setError("Ogiltig e-postadress");
      return;
    }

    // Parse coordinates
    const latitude = formData.latitude ? parseFloat(formData.latitude) : undefined;
    const longitude = formData.longitude ? parseFloat(formData.longitude) : undefined;

    if ((latitude && isNaN(latitude)) || (longitude && isNaN(longitude))) {
      setError("Ogiltiga koordinater");
      return;
    }

    try {
      setIsSubmitting(true);

      let result;

      if (isCreateMode) {
        // Create new venue
        const createData: CreateVenueRequest = {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          description: formData.description,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          latitude,
          longitude,
        };
        result = await venueService.createVenue(createData);
      } else {
        // Update existing venue
        const updateData: UpdateVenueRequest = {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          description: formData.description,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          isActive: formData.isActive,
          latitude,
          longitude,
        };
        result = await venueService.updateVenue(venue!.id, updateData);
      }

      if (result.isSuccess) {
        setShowSuccess(true);

        // Close modal after 2 seconds
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError(
          result.errors?.[0] || `Kunde inte ${isCreateMode ? "skapa" : "uppdatera"} platsen`
        );
      }
    } catch (err) {
      console.error("Failed to save venue:", err);
      setError("Ett oväntat fel uppstod");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header - HERE'S WHERE THE TITLE GOES */}
        <div className="sticky top-0 bg-white border-b border-neutral-stroke p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">{isCreateMode ? "Skapa plats" : "Redigera plats"}</h2>
          <button
            onClick={onClose}
            className="text-neutral-secondary hover:text-neutral-primary transition-colors"
            disabled={isSubmitting || showSuccess}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Success Message */}
          {showSuccess && (
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
              <p className="text-success font-medium">
                Platsen har {isCreateMode ? "skapats" : "uppdaterats"}!
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-error/10 border border-error rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Grundläggande information</h3>

            <div>
              <label className="block text-sm font-medium mb-2">
                Platsnamn <span className="text-error">*</span>
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="T.ex. Stadsbiblioteket Göteborg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Beskrivning <span className="text-error">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Beskriv platsen och vad ni erbjuder..."
                className="w-full px-3 py-2 border border-neutral-stroke rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="font-semibold">Adress</h3>

            <div>
              <label className="block text-sm font-medium mb-2">
                Gatuadress <span className="text-error">*</span>
              </label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="T.ex. Götaplatsen 5"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Postnummer <span className="text-error">*</span>
                </label>
                <Input
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="412 56"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Stad <span className="text-error">*</span>
                </label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Göteborg"
                  required
                />
              </div>
            </div>
          </div>

          {/* Coordinates */}
          <div className="space-y-4">
            <h3 className="font-semibold">Koordinater</h3>
            <p className="text-sm text-neutral-secondary">
              (valfritt) För att visa platsen på en karta.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Latitud (Latitude)</label>
                <Input
                  name="latitude"
                  type="text"
                  inputMode="decimal" // ⬅️ Gives numeric keyboard on mobile
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="57.708870"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Longitud (Longitude)</label>
                <Input
                  name="longitude"
                  type="text"
                  inputMode="decimal" // ⬅️ Gives numeric keyboard on mobile
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="11.974560"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Kontaktinformation</h3>

            <div>
              <label className="block text-sm font-medium mb-2">
                E-post <span className="text-error">*</span>
              </label>
              <Input
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="kontakt@plats.se"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Telefon <span className="text-error">*</span>
              </label>
              <Input
                name="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="031-123 45 67"
                required
              />
            </div>
          </div>

          {/* Status - Only show when editing */}
          {!isCreateMode && (
            <div className="space-y-4">
              <h3 className="font-semibold">Status</h3>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 text-primary border-neutral-stroke rounded focus:ring-2 focus:ring-primary/20"
                />
                <div>
                  <p className="font-medium">Platsen är aktiv</p>
                  <p className="text-sm text-neutral-secondary">
                    Inaktiva platser visas inte för användare
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-neutral-stroke">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting || showSuccess}
              className="flex-1"
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || showSuccess}
              className="flex-1"
            >
              {isSubmitting
                ? "Sparar..."
                : showSuccess
                  ? "Sparad!"
                  : isCreateMode
                    ? "Skapa plats"
                    : "Spara ändringar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
