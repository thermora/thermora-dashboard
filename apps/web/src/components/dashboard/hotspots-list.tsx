"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiAlertLine, RiUserLine, RiTimeLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";

interface Hotspot {
  name: string;
  lat: number;
  lng: number;
  maxTemp: number;
  duration: number;
  population: number;
  riskLevel: "Emergency" | "Danger" | "Caution";
}

interface HotspotsListProps {
  hotspots?: Hotspot[];
  onHotspotClick?: (hotspot: Hotspot) => void;
}

export default function HotspotsList({
  hotspots = [],
  onHotspotClick,
}: HotspotsListProps) {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Emergency":
        return "bg-red-500";
      case "Danger":
        return "bg-orange-500";
      case "Caution":
        return "bg-yellow-500";
      default:
        return "bg-slate-500";
    }
  };

  const getRiskLabel = (riskLevel: string) => {
    switch (riskLevel) {
      case "Emergency":
        return "Emergência";
      case "Danger":
        return "Perigo";
      case "Caution":
        return "Cuidado";
      default:
        return riskLevel;
    }
  };

  const formatPopulation = (pop: number) => {
    if (pop >= 1000) {
      return `~${(pop / 1000).toFixed(1)}k`;
    }
    return `~${pop}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <RiAlertLine className="h-5 w-5 text-orange-600" />
          <span>Hotspots Críticos</span>
          {hotspots.length > 0 && (
            <span className="text-sm font-semibold text-orange-600 ml-auto bg-orange-50 px-2.5 py-1 rounded-md">
              {hotspots.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hotspots.length === 0 ? (
          <div className="text-center text-slate-500 py-8 font-medium">
            Nenhum hotspot crítico no momento
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {hotspots.map((hotspot, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-auto p-3 hover:bg-accent"
                onClick={() => onHotspotClick?.(hotspot)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div
                    className={`w-3 h-3 rounded-full mt-1 ${getRiskColor(
                      hotspot.riskLevel
                    )}`}
                  />
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-slate-900 mb-1.5">
                      {hotspot.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-sm font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
                        {hotspot.maxTemp.toFixed(1)}°C
                      </span>
                      <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                        <RiUserLine className="h-3.5 w-3.5" />
                        {formatPopulation(hotspot.population)}
                      </span>
                      <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                        <RiTimeLine className="h-3.5 w-3.5" />
                        {hotspot.duration} min
                      </span>
                      <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                        {getRiskLabel(hotspot.riskLevel)}
                      </span>
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
