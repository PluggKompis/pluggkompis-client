import React from "react";
import { Card } from "../../common";
import { SubjectCoverage } from "@/types";

interface SubjectCoverageChartProps {
  data: SubjectCoverage[];
}

export const SubjectCoverageChart: React.FC<SubjectCoverageChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <Card>
        <h3 className="mb-4">Ämnesområden - Volontärstäckning</h3>
        <p className="text-neutral-secondary text-center py-8">Ingen data tillgänglig</p>
      </Card>
    );
  }

  // Find max count for scaling bars
  const maxCount = Math.max(...data.map((s) => s.volunteersCount), 1);

  // Color logic with your custom colors
  const getColor = (count: number): string => {
    if (count >= 4) return "#24A54F"; // Green - good coverage
    if (count >= 2) return "#E8A93F"; // Yellow - needs attention
    return "#DE7573"; // Red - critical
  };

  return (
    <Card>
      <div className="mb-6">
        <h3 className="mb-2">Ämnesområden - Volontärstäckning</h3>
        <p className="text-sm text-neutral-secondary">Antal volontärer per ämne denna vecka</p>
      </div>

      <div className="space-y-4">
        {data.map((subject, index) => {
          const percentage = (subject.volunteersCount / maxCount) * 100;
          const color = getColor(subject.volunteersCount);

          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{subject.subjectName}</span>
                <span className="text-neutral-secondary">
                  {subject.volunteersCount} volontär{subject.volunteersCount !== 1 ? "er" : ""}
                </span>
              </div>
              <div className="relative h-8 bg-neutral-bg rounded-lg overflow-hidden">
                {/* Single bar - clean and simple! */}
                <div
                  className="h-full rounded-lg transition-all duration-500"
                  style={{
                    width: `${Math.max(percentage, 5)}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-neutral-stroke">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#24A54F" }} />
          <span className="text-sm text-neutral-secondary">God täckning (4+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#E8A93F" }} />
          <span className="text-sm text-neutral-secondary">Behöver fler (2-3)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#DE7573" }} />
          <span className="text-sm text-neutral-secondary">Kritiskt (0-1)</span>
        </div>
      </div>
    </Card>
  );
};
