import React, { useState } from "react";
import { Search, Calendar } from "lucide-react"; // Import icons
import { Button, Input, Card, Tag, EmptyState, Modal, Spinner } from "../components/common";

export const ComponentShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <h1>Component Showcase</h1>

      {/* Buttons */}
      <section>
        <h2 className="mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="sm">
            Small Primary
          </Button>
          <Button variant="primary" size="md">
            Medium Primary
          </Button>
          <Button variant="primary" size="lg">
            Large Primary
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button disabled>Disabled</Button>
          <Button isLoading>Loading</Button>
        </div>
      </section>

      {/* Inputs */}
      <section>
        <h2 className="mb-4">Inputs</h2>
        <div className="max-w-md space-y-4">
          <Input label="Email" type="email" placeholder="din@email.se" />
          <Input label="Lösenord" type="password" placeholder="********" />
          <Input label="Felaktigt" error="Detta fält är obligatoriskt" />
          <Input helperText="Vi skickar aldrig spam" />
        </div>
      </section>

      {/* Tags */}
      <section>
        <h2 className="mb-4">Tags</h2>
        <div className="flex flex-wrap gap-2">
          <Tag variant="default">Default</Tag>
          <Tag variant="success">Success</Tag>
          <Tag variant="error">Error</Tag>
          <Tag variant="warning">Warning</Tag>
          <Tag variant="subject">Matematik</Tag>
          <Tag variant="subject">Svenska</Tag>
          <Tag variant="subject">Kemi</Tag>
        </div>
      </section>

      {/* Cards */}
      <section>
        <h2 className="mb-4">Cards</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card title="Card Title" subtitle="Card subtitle">
            <p>This is card content</p>
          </Card>
          <Card onClick={() => alert("Clicked!")}>
            <p>Clickable card</p>
          </Card>
        </div>
      </section>

      {/* Empty State */}
      <section>
        <h2 className="mb-4">Empty State</h2>
        <EmptyState
          icon={Calendar}
          title="Ingen läxhjälp idag"
          description="Kolla in andra dagar i schemat"
          action={{
            label: "Visa schema",
            onClick: () => alert("Clicked!"),
          }}
        />
      </section>

      {/* Empty State - No Action */}
      <section>
        <h2 className="mb-4">Empty State (No Action)</h2>
        <EmptyState
          icon={Search}
          title="Inga platser hittades"
          description="Prova att ändra dina sökfilter"
        />
      </section>

      {/* Modal */}
      <section>
        <h2 className="mb-4">Modal</h2>
        <Button onClick={() => setIsModalOpen(true)}>Öppna Modal</Button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Modal Title">
          <p>This is modal content</p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => setIsModalOpen(false)}>Stäng</Button>
          </div>
        </Modal>
      </section>

      {/* Spinner */}
      <section>
        <h2 className="mb-4">Spinner</h2>
        <div className="flex gap-4 items-center">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </section>
    </div>
  );
};
