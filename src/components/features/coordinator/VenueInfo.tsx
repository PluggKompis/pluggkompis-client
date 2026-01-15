import React from "react";
import { Card, Button, Tag } from "../../common";

export const VenueInfo: React.FC = () => {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex justify-between items-center">
        <h2>Min Plats</h2>
        <Button variant="outline" size="sm">
          Redigera plats
        </Button>
      </div>

      {/* Venue Details */}
      <Card>
        <h3 className="mb-4">Platsinformation</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-neutral-secondary">Platsnamn</p>
            <p className="font-semibold">Stadsbiblioteket</p>
          </div>
          <div>
            <p className="text-sm text-neutral-secondary">Adress</p>
            <p className="font-semibold">Götaplatsen 5, 412 56 Göteborg</p>
          </div>
          <div>
            <p className="text-sm text-neutral-secondary">Kontaktperson</p>
            <p className="font-semibold">Anna Svensson • anna@biblioteket.se</p>
          </div>
        </div>
      </Card>

      {/* Opening Hours */}
      <Card>
        <h3 className="mb-4">Öppettider</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Måndag - Fredag</span>
            <span className="font-semibold">16:00 - 20:00</span>
          </div>
          <div className="flex justify-between">
            <span>Lördag</span>
            <span className="font-semibold">10:00 - 14:00</span>
          </div>
          <div className="flex justify-between text-neutral-secondary">
            <span>Söndag</span>
            <span>Stängt</span>
          </div>
        </div>
      </Card>

      {/* Available Subjects */}
      <Card>
        <h3 className="mb-4">Tillgängliga ämnen</h3>
        <div className="flex flex-wrap gap-2">
          <Tag variant="subject" icon="📐">
            Matematik
          </Tag>
          <Tag variant="subject" icon="📖">
            Svenska
          </Tag>
          <Tag variant="subject" icon="🌍">
            Engelska
          </Tag>
          <Tag variant="subject" icon="⚛️">
            Fysik
          </Tag>
          <Tag variant="subject" icon="🧪">
            Kemi
          </Tag>
          <Tag variant="subject" icon="🧬">
            Biologi
          </Tag>
        </div>
      </Card>

      {/* Capacity */}
      <Card>
        <h3 className="mb-4">Kapacitet</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-neutral-secondary">Max antal elever per pass</p>
            <p className="text-2xl font-bold">15</p>
          </div>
          <div>
            <p className="text-sm text-neutral-secondary">Rekommenderat antal volontärer</p>
            <p className="text-2xl font-bold">3-4</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
