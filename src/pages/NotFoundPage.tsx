import React from "react";
import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/common";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-md mx-auto">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Search size={64} className="text-primary" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-primary mb-4">Hoppsan!</h1>
        <h2 className="text-2xl font-bold mb-4">Den här sidan verkar ha gått vilse.</h2>

        {/* Description */}
        <p className="text-neutral-secondary mb-8">
          Precis som en elev utan läxhjälp – den här sidan behöver också lite vägledning! Men oroa
          dig inte, vi hjälper dig hitta rätt.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <Home size={20} className="mr-2" />
              Gå till startsidan
            </Button>
          </Link>
          <button onClick={() => window.history.back()}>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <ArrowLeft size={20} className="mr-2" />
              Gå tillbaka
            </Button>
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-neutral-stroke">
          <p className="text-sm text-neutral-secondary mb-4">
            Kanske letar du efter något av dessa?
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/venues" className="text-primary hover:underline">
              Hitta Läxhjälp
            </Link>
            <Link to="/om-pluggkompis" className="text-primary hover:underline">
              Om PluggKompis
            </Link>
            <Link to="/faq" className="text-primary hover:underline">
              Vanliga Frågor
            </Link>
            <Link to="/register" className="text-primary hover:underline">
              Registrera dig
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
