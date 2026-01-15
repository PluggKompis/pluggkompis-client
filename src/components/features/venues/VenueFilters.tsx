import React, { useState } from "react";
import { Card, Button } from "../../common";

export const VenueFilters: React.FC = () => {
  const [city, setCity] = useState("");
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState("");

  const handleReset = () => {
    setCity("");
    setSubject("");
    setDay("");
  };

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="mb-4">Filter</h3>

        <div className="space-y-4">
          {/* City Filter */}
          <div>
            <label className="filter-label">Stad</label>
            <select
              className="filter-select"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Alla städer</option>
              <option value="göteborg">Göteborg</option>
              <option value="stockholm">Stockholm</option>
              <option value="malmö">Malmö</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="filter-label">Ämne</label>
            <select
              className="filter-select"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">Alla ämnen</option>
              <option value="matematik">Matematik</option>
              <option value="svenska">Svenska</option>
              <option value="engelska">Engelska</option>
              <option value="fysik">Fysik</option>
              <option value="kemi">Kemi</option>
            </select>
          </div>

          {/* Day Filter */}
          <div>
            <label className="filter-label">Dag</label>
            <select className="filter-select" value={day} onChange={(e) => setDay(e.target.value)}>
              <option value="">Alla dagar</option>
              <option value="måndag">Måndag</option>
              <option value="tisdag">Tisdag</option>
              <option value="onsdag">Onsdag</option>
              <option value="torsdag">Torsdag</option>
              <option value="fredag">Fredag</option>
              <option value="lördag">Lördag</option>
            </select>
          </div>

          <Button variant="outline" size="sm" className="w-full" onClick={handleReset}>
            Rensa filter
          </Button>
        </div>
      </Card>
    </div>
  );
};
