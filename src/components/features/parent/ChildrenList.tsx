import React from "react";
import { Baby } from "lucide-react";
import { Card, Button, EmptyState } from "../../common";

export const ChildrenList: React.FC = () => {
  const children = []; // Empty for now

  if (children.length === 0) {
    return (
      <EmptyState
        icon={Baby}
        title="Inga barn registrerade"
        description="Lägg till ditt första barn för att börja boka läxhjälp"
        action={{
          label: "Lägg till barn",
          onClick: () => console.log("Add child"),
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2>Mina Barn</h2>
        <Button variant="primary" size="sm">
          + Lägg till barn
        </Button>
      </div>

      {/* Example child card */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-1">Anna Andersson</h3>
            <p className="text-sm text-neutral-secondary">Årskurs 5 • Född 2015</p>
          </div>
          <Button variant="outline" size="sm">
            Redigera
          </Button>
        </div>
      </Card>
    </div>
  );
};
