"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
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
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Hotspots Críticos
          {hotspots.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground ml-auto">
              {hotspots.length} ativos
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hotspots.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
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
                    <div className="font-medium">{hotspot.name}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                        {hotspot.maxTemp.toFixed(1)}°C
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Pop: {formatPopulation(hotspot.population)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Duração: {hotspot.duration} min
                      </span>
                      <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">
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
