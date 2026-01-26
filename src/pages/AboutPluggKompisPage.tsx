import React from "react";
import { BookOpen, Users, Calendar, AlertCircle } from "lucide-react";

export const AboutPluggKompisPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Student Project Notice */}
      <div className="mb-8 rounded-lg border-2 border-amber-400 bg-amber-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-amber-600" />
          <div>
            <h2 className="mb-2 text-xl font-semibold text-amber-900">
              Studentprojekt - Ej en aktiv tjänst
            </h2>
            <p className="text-amber-800">
              Detta är ett examensarbete skapat av studenter vid NBI Handelsakademin i Göteborg inom
              utbildningen .NET-systemutveckling. PluggKompis är <strong>inte</strong> en verklig,
              aktiv plattform för läxhjälp. Projektet demonstrerar våra kunskaper inom
              fullstack-utveckling med .NET och React.
            </p>
          </div>
        </div>
      </div>

      <h1 className="mb-8">Om PluggKompis</h1>

      <div className="max-w-3xl space-y-8">
        {/* Project Concept */}
        <section>
          <h2 className="mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary-600" />
            Projektidén
          </h2>
          <p className="text-neutral-secondary">
            PluggKompis är en konceptplattform som skulle kunna koppla samman föräldrar och elever
            med gratis läxhjälp som erbjuds på bibliotek, fritidsgårdar och studieförbund runt om i
            Sverige. Idén uppstod ur ett verkligt behov - information om läxhjälp är idag utspridd
            över olika hemsidor, Facebook-grupper och fysiska anslagstavlor, vilket gör det svårt
            för föräldrar att hitta och boka hjälp.
          </p>
        </section>

        {/* The Solution */}
        <section>
          <h2 className="mb-4 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary-600" />
            Lösningen
          </h2>
          <p className="text-neutral-secondary mb-4">
            I detta projekt har vi byggt en prototyp av en centraliserad plattform där:
          </p>
          <ul className="list-inside list-disc space-y-2 text-neutral-secondary">
            <li>
              Föräldrar och elever kan söka, filtrera och boka platser vid läxhjälpstillfällen
            </li>
            <li>Läxhjälpsplatser kan hantera sitt schema och sina volontärer effektivt</li>
            <li>
              Volontärer kan registrera sig, välja pass och exportera sina arbetade timmar till PDF
            </li>
            <li>Koordinatorer får överblick över ämnesfördelning och kommande pass</li>
          </ul>
        </section>

        {/* Technical Implementation */}
        <section>
          <h2 className="mb-4 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary-600" />
            Teknisk implementation
          </h2>
          <p className="text-neutral-secondary mb-4">
            Projektet har utvecklats med modern webbutvecklingsteknik:
          </p>
          <ul className="list-inside list-disc space-y-2 text-neutral-secondary">
            <li>
              <strong>Backend:</strong> ASP.NET Core 8 med Clean Architecture, Entity Framework Core
              och Azure SQL
            </li>
            <li>
              <strong>Frontend:</strong> React 18, TypeScript, Tailwind CSS och Vite
            </li>
            <li>
              <strong>Autentisering:</strong> JWT-baserad rollhantering (Förälder, Elev, Volontär,
              Koordinator)
            </li>
            <li>
              <strong>Avancerade funktioner:</strong> PDF-export för volontärtimmar, interaktiv
              kartvy, koordinatordashboard
            </li>
          </ul>
        </section>

        {/* Team */}
        <section className="rounded-lg bg-neutral-50 p-6">
          <h2 className="mb-4">Projektteam</h2>
          <p className="text-neutral-secondary mb-2">
            <strong>Utbildning:</strong> .NET-systemutveckling
          </p>
          <p className="text-neutral-secondary mb-2">
            <strong>Skola:</strong> NBI Handelsakademin, Göteborg
          </p>
          <p className="text-neutral-secondary mb-2">
            <strong>Kurs:</strong> Avancerad objektorienterad programmering
          </p>
          <p className="text-neutral-secondary">
            <strong>Utvecklare:</strong> Gabby Ferm & Mohanad Al-Dolaimy
          </p>
        </section>

        {/* Disclaimer */}
        <section className="rounded-lg border border-neutral-200 bg-white p-6">
          <h3 className="mb-3 font-semibold text-neutral-700">Observera</h3>
          <p className="text-sm text-neutral-secondary">
            All data på denna plattform är testdata. Inga verkliga läxhjälpsplatser, bokningar eller
            användaruppgifter finns lagrade. Projektet är skapat i utbildningssyfte och demonstrerar
            teknisk kompetens inom fullstack-utveckling.
          </p>
        </section>
      </div>
    </div>
  );
};
