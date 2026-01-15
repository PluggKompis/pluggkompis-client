import React from "react";
import { Mail, Phone } from "lucide-react";
import { Card, Tag } from "../../common";

export const VenueDetail: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="mb-4">Om platsen</h3>
        <p className="text-neutral-secondary mb-4">
          Stadsbiblioteket i Göteborg erbjuder en lugn och inspirerande miljö för läxläsning. Vi har
          dedikerade rum för läxhjälp med erfarna volontärer som hjälper elever i olika ämnen.
        </p>
        <p className="text-neutral-secondary">
          Biblioteket ligger centralt vid Götaplatsen med goda kommunikationer. Vi har både
          grupputrymmen och enskilda studieytor.
        </p>
      </Card>

      <Card>
        <h3 className="mb-4">Tillgängliga ämnen</h3>
        <div className="flex flex-wrap gap-2">
          <Tag variant="subject">Matematik</Tag>
          <Tag variant="subject">Svenska</Tag>
          <Tag variant="subject">Engelska</Tag>
          <Tag variant="subject">Fysik</Tag>
          <Tag variant="subject">Kemi</Tag>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4">Öppettider</h3>
        <div className="space-y-2 text-sm">
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

      <Card>
        <h3 className="mb-4">Kontakt</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail size={16} className="text-neutral-secondary" />
            <span>info@stadsbiblioteket.se</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone size={16} className="text-neutral-secondary" />
            <span>031-123 45 67</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
