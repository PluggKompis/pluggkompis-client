import React, { useState } from "react";
import { Card, Button, Tag, EmptyState } from "../../common";
import { WeekView } from "../timeslots/WeekView";
import { DayView } from "../timeslots/DayView";
import { MiniCalendar } from "../timeslots/MiniCalendar";

export const TimeSlotsManager: React.FC = () => {
  const [view, setView] = useState<"week" | "day">("week");
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2>Hantera Tider</h2>
        <Button variant="primary" size="sm">
          + Skapa nytt pass
        </Button>
      </div>

      {/* View Toggle & Calendar */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Mini Calendar Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="mb-4">Välj datum</h3>
            <MiniCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

            <div className="mt-4 pt-4 border-t border-neutral-stroke">
              <p className="text-sm font-semibold mb-2">Visa som:</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setView("week")}
                  className={`flex-1 py-2 px-3 rounded text-sm font-semibold ${
                    view === "week" ? "bg-primary text-white" : "bg-neutral-bg"
                  }`}
                >
                  Vecka
                </button>
                <button
                  onClick={() => setView("day")}
                  className={`flex-1 py-2 px-3 rounded text-sm font-semibold ${
                    view === "day" ? "bg-primary text-white" : "bg-neutral-bg"
                  }`}
                >
                  Dag
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Schedule View */}
        <div className="lg:col-span-3">
          {view === "week" ? (
            <WeekView selectedDate={selectedDate} />
          ) : (
            <DayView selectedDate={selectedDate} />
          )}
        </div>
      </div>

      {/* Timeslot List */}
      <Card>
        <h3 className="mb-4">Alla tidspass</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-neutral-bg rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold">Måndag 16:00 - 18:00</p>
                <Tag variant="success">Aktiv</Tag>
              </div>
              <p className="text-sm text-neutral-secondary">2 volontärer • 8/10 platser bokade</p>
              <div className="flex gap-2 mt-2">
                <Tag variant="subject" icon="📐">
                  Matematik
                </Tag>
                <Tag variant="subject" icon="📖">
                  Svenska
                </Tag>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Redigera
              </Button>
              <Button variant="outline" size="sm">
                Radera
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
