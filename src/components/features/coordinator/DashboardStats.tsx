import React from "react";
import { Users, Calendar, GraduationCap, AlertTriangle } from "lucide-react";
import { Card } from "../../common";

interface DashboardStatsProps {
  totalVolunteers: number;
  totalBookings: number;
  upcomingSessionsCount: number;
  unfilledShiftsCount: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalVolunteers,
  totalBookings,
  upcomingSessionsCount,
  unfilledShiftsCount,
}) => {
  const stats = [
    {
      label: "Aktiva volontärer",
      value: totalVolunteers.toString(),
      icon: Users,
      color: "primary",
    },
    {
      label: "Pass denna vecka",
      value: upcomingSessionsCount.toString(),
      icon: Calendar,
      color: "primary",
    },
    {
      label: "Bokade elever",
      value: totalBookings.toString(),
      icon: GraduationCap,
      color: "primary",
    },
    {
      label: "Ofyllda pass",
      value: unfilledShiftsCount.toString(),
      icon: AlertTriangle,
      color: unfilledShiftsCount > 0 ? "warning" : "success",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        const iconColor =
          stat.color === "warning" ? "#E8A93F" : stat.color === "success" ? "#24A54F" : undefined;

        return (
          <Card key={index}>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: iconColor ? `${iconColor}15` : undefined,
                }}
              >
                <IconComponent
                  size={24}
                  style={{ color: iconColor }}
                  className={!iconColor ? "text-primary" : undefined}
                />
              </div>
              <div>
                <p className="text-sm text-neutral-secondary">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
