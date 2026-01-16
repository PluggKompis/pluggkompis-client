import React from "react";
import { Card, Tag, Button } from "../../common";

export const VolunteerProfile: React.FC = () => {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex justify-between items-center">
        <h2>Volontärprofil</h2>
        <Button variant="outline" size="sm">
          Redigera profil
        </Button>
      </div>

      {/* Status */}
      <Card>
        <h3 className="mb-4">Status</h3>
        <div className="flex items-center gap-2">
          <Tag variant="success">✓ Godkänd</Tag>
          <p className="text-neutral-secondary text-sm">Aktiv sedan 15 december 2025</p>
        </div>
      </Card>

      {/* Venue & Bio */}
      <Card>
        <h3 className="mb-4">Min Plats</h3>
        <p className="font-semibold mb-2">Stadsbiblioteket, Göteborg</p>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Bio</h4>
          <p className="text-neutral-secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Jag älskar att hjälpa barn med
            deras läxor!
          </p>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Erfarenhet</h4>
          <p className="text-neutral-secondary">
            Lärare i 10 år, specialiserad på matematik och naturvetenskap.
          </p>
        </div>
      </Card>

      {/* Availability */}
      <Card>
        <h3 className="mb-4">Tillgänglighet</h3>
        <p className="text-neutral-secondary mb-2">
          Max timmar per vecka: <span className="font-semibold text-black">6 timmar</span>
        </p>
      </Card>

      {/* Subjects */}
      <Card>
        <h3 className="mb-4">Ämnen & Nivåer</h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">📐 Matematik</span>
              <Tag variant="success">Avancerad</Tag>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">⚛️ Fysik</span>
              <Tag variant="success">Avancerad</Tag>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">🧪 Kemi</span>
              <Tag variant="warning">Medel</Tag>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
