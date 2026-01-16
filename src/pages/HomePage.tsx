import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/common";
import { MapPin, Calendar, BookOpen } from "lucide-react";
import lightbulbImage from "../assets/lightbulb.jpg";

export const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section with Image */}
      <section className="bg-primary-dark text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                Gratis läxhjälp för alla barn i Sverige
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                PluggKompis kopplar samman elever med volontärer för gratis läxhjälp på bibliotek
                och lokala mötesplatser runt om i Sverige.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/venues">
                  <Button variant="primary" size="lg">
                    Hitta läxhjälp nära dig
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg">
                    Bli volontär
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src={lightbulbImage}
                alt="Kreativ läxhjälp"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">Så funkar det</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin size={40} className="text-primary" />
              </div>
              <h3 className="mb-2">1. Hitta en plats</h3>
              <p className="text-neutral-secondary">
                Sök efter läxhjälp på bibliotek eller mötesplatser nära dig
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar size={40} className="text-primary" />
              </div>
              <h3 className="mb-2">2. Boka en tid</h3>
              <p className="text-neutral-secondary">
                Välj ett pass som passar dig och boka enkelt online
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <BookOpen size={40} className="text-primary" />
              </div>
              <h3 className="mb-2">3. Få hjälp</h3>
              <p className="text-neutral-secondary">
                Träffa en volontär som hjälper dig med dina läxor
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary-dark text-white rounded-lg p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Vill du göra skillnad?
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Bli volontär och hjälp barn med deras läxor
            </p>
            <Link to="/register">
              <Button variant="primary" size="lg">
                Bli Volontär
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
