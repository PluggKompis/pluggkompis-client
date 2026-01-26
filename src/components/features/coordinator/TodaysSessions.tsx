import React from "react";
import { Card } from "../../common";
import { UpcomingShift } from "@/types";
import { format, isToday, parseISO } from "date-fns";

interface TodaysSessionsProps {
  shifts: UpcomingShift[];
}

export const TodaysSessions: React.FC<TodaysSessionsProps> = ({ shifts }) => {
  // 🔍 DEBUGGING - Remove this after fixing
  console.log("TodaysSessions received shifts:", shifts);
  console.log("First shift:", shifts[0]);

  // Filter to only today's sessions
  const todaysSessions = shifts.filter((shift) => {
    console.log("Filtering shift:", shift); // 🔍 See each shift
    console.log("startUtc value:", shift.startUtc); // 🔍 See the actual value

    if (!shift.startUtc) {
      console.warn("Shift missing startUtc:", shift); // 🔍 Find the bad data
      return false;
    }

    return isToday(parseISO(shift.startUtc));
  });

  if (todaysSessions.length === 0) {
    return (
      <Card>
        <h3 className="mb-4">Kommande pass idag</h3>
        <p className="text-neutral-secondary text-center py-8">Inga pass schemalagda idag</p>
      </Card>
    );
  }

  const now = new Date();

  return (
    <Card>
      <h3 className="mb-4">Kommande pass idag</h3>
      <div className="space-y-3">
        {todaysSessions.map((session, index) => {
          const startTime = parseISO(session.startUtc);
          const endTime = parseISO(session.endUtc);
          const isActive = now >= startTime && now <= endTime;
          const isUpcoming = now < startTime;

          return (
            <div
              key={`${session.timeSlotId}-${index}`}
              className="flex justify-between items-center py-2 border-b border-neutral-stroke last:border-0"
            >
              <div>
                <p className="font-semibold">
                  {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
                </p>
                <p className="text-sm text-neutral-secondary">
                  {session.volunteersCount} volontär{session.volunteersCount !== 1 ? "er" : ""},{" "}
                  {session.bookingsCount} elev{session.bookingsCount !== 1 ? "er" : ""}
                </p>
                {session.subjectNames.length > 0 && (
                  <p className="text-xs text-neutral-secondary mt-1">
                    {session.subjectNames.join(", ")}
                  </p>
                )}
              </div>
              <span
                className={`font-semibold ${
                  isActive
                    ? "text-[#24A54F]"
                    : isUpcoming
                      ? "text-neutral-secondary"
                      : "text-neutral-tertiary"
                }`}
              >
                {isActive ? "Aktiv" : isUpcoming ? "Kommande" : "Avslutad"}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
