import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";
import { VenueDetail } from "../components/features/venues/VenueDetail";
import { VenueSchedule } from "../components/features/venues/VenueSchedule";
import { VenueMap } from "../components/features/venues/VenueMap";
import { Spinner } from "../components/common";
import heroImage from "../assets/hero.jpg";

export const VenueDetailPage: React.FC = () => {
  const { id } = useParams();
  const [isLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"schedule" | "volunteers" | "about">("schedule");

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
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
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-primary-dark/80"></div>

        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Stadsbiblioteket</h1>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-200">
                <MapPin size={20} />
                <span>Götaplatsen 5, Göteborg</span>
              </div>
              <div className="flex items-center gap-2 text-gray-200">
                <Clock size={20} />
                <span>Öppet Mån-Fre 16:00-20:00</span>
              </div>
            </div>

            <p className="text-gray-200 mb-6 text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white sticky top-[72px] z-40">
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
              Volontärer
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
        {activeTab === "volunteers" && (
          <div className="text-center py-12">
            <p className="text-neutral-secondary">Volontärer kommer snart...</p>
          </div>
        )}
        {activeTab === "about" && (
          <div className="grid lg:grid-cols-2 gap-8">
            <VenueDetail />
            <VenueMap />
          </div>
        )}
      </div>
    </div>
  );
};
