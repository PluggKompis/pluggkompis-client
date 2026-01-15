import React from "react";
import { Users, Calendar, GraduationCap, Check } from "lucide-react";
import { Card } from "../../common";

export const DashboardStats: React.FC = () => {
  const stats = [
    { label: "Aktiva volontärer", value: "12", icon: Users },
    { label: "Pass denna vecka", value: "24", icon: Calendar },
    { label: "Bokade elever", value: "67", icon: GraduationCap },
    { label: "Genomsnittlig närvaro", value: "89%", icon: Check },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <IconComponent size={24} className="text-primary" />
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
