import React, { useState } from "react";
import { Card, Button, Input } from "../../common";

export const UserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Anna",
    lastName: "Andersson",
    email: "anna.andersson@email.se",
    phone: "070-123 45 67",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: Connect to API
    console.log("Save profile:", formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex justify-between items-center">
        <h2>Mina Uppgifter</h2>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Redigera
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Avbryt
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Spara
            </Button>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <Card>
        <h3 className="mb-4">Personuppgifter</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Förnamn"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              disabled={!isEditing}
            />
            <Input
              label="Efternamn"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled={!isEditing}
          />

          <Input
            label="Telefon"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </Card>

      {/* Change Password */}
      <Card>
        <h3 className="mb-4">Ändra lösenord</h3>
        <div className="space-y-4">
          <Input label="Nuvarande lösenord" type="password" placeholder="********" />
          <Input label="Nytt lösenord" type="password" placeholder="********" />
          <Input label="Bekräfta nytt lösenord" type="password" placeholder="********" />
          <Button variant="primary" size="sm">
            Uppdatera lösenord
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card>
        <h3 className="mb-4 text-error">Radera konto</h3>
        <p className="text-sm text-neutral-secondary mb-4">
          När du raderar ditt konto förlorar du all data och kan inte återställa det.
        </p>
        <Button variant="outline" size="sm">
          Radera mitt konto
        </Button>
      </Card>
    </div>
  );
};
