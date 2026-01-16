import React from "react";
import { Tag } from "../../common";

interface TimeSlotCardProps {
  time: string;
  subjects: string[];
  availableSpots: number;
  status: "open" | "full" | "cancelled";
}

export const TimeSlotCard: React.FC<TimeSlotCardProps> = ({
  time,
  subjects,
  availableSpots,
  status,
}) => {
  return (
    <div className="timeslot-card">
      <div className="timeslot-time">{time}</div>

      <div className="timeslot-subjects">
        {subjects.slice(0, 2).map((subject, index) => (
          <Tag key={index} variant="subject" className="text-xs">
            {subject}
          </Tag>
        ))}
      </div>

      <div className="timeslot-availability">
        {availableSpots > 0 ? `${availableSpots} platser` : "Fullbokat"}
      </div>

      <div className="timeslot-status">
        <span className={`timeslot-status-badge ${status}`} />
        <span>
          {status === "open" && "Öppet"}
          {status === "full" && "Fullt"}
          {status === "cancelled" && "Inställt"}
        </span>
      </div>
    </div>
  );
};
