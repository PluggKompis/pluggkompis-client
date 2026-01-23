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

  // Color logic: State-based
  const getColor = (count: number): string => {
    if (count >= 2) return "#24A54F"; // Green - Good coverage (2+)
    if (count === 1) return "#E8A93F"; // Yellow - Needs attention (1)
    return "#DE7573"; // Red - Critical (0)
  };

  return (
    <Card>
      <div className="mb-6">
        <h3 className="mb-2">Ämnesområden - Volontärstäckning</h3>
        <p className="text-sm text-neutral-secondary">Status för volontärstäckning denna vecka</p>
      </div>

      <div className="space-y-4">
        {data.map((subject, index) => {
          const color = getColor(subject.volunteersCount);

          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{subject.subjectName}</span>
                <span className="text-neutral-secondary">
                  {subject.volunteersCount} volontär{subject.volunteersCount !== 1 ? "er" : ""}
                </span>
              </div>

              {/* Bar container */}
              <div className="relative h-8 bg-neutral-bg rounded-lg overflow-hidden">
                {/* Full width bar (100%) 
                   The color alone indicates the state.
                */}
                <div
                  className="h-full rounded-lg transition-all duration-500"
                  style={{
                    width: "100%",
                    backgroundColor: color,
                    opacity: 0.9, // Optional: Slight transparency for a softer look
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
          <span className="text-sm text-neutral-secondary">God täckning (2+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#E8A93F" }} />
          <span className="text-sm text-neutral-secondary">Behöver fler (1)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#DE7573" }} />
          <span className="text-sm text-neutral-secondary">Kritiskt (0)</span>
        </div>
      </div>
    </Card>
  );
};
