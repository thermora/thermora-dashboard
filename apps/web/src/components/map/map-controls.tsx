"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  RiDownloadLine,
  RiStackLine,
} from "react-icons/ri";

interface MapControlsProps {
  showRoutes?: boolean;
  showStops?: boolean;
  showNeighborhoods?: boolean;
  onToggleRoutes?: (enabled: boolean) => void;
  onToggleStops?: (enabled: boolean) => void;
  onToggleNeighborhoods?: (enabled: boolean) => void;
  onExportPNG?: () => void;
  onExportPDF?: () => void;
}

export default function MapControls({
  showRoutes = true,
  showStops = true,
  showNeighborhoods = false,
  onToggleRoutes,
  onToggleStops,
  onToggleNeighborhoods,
  onExportPNG,
  onExportPDF,
}: MapControlsProps) {

  return (
    <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
      {/* Layer Controls */}
      <div className="rounded-lg border bg-white p-4 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <RiStackLine className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Camadas</Label>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="routes"
              checked={showRoutes}
              onCheckedChange={(checked) => onToggleRoutes?.(checked === true)}
            />
            <Label htmlFor="routes" className="text-sm cursor-pointer">
              Rotas de Ônibus
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="stops"
              checked={showStops}
              onCheckedChange={(checked) => onToggleStops?.(checked === true)}
            />
            <Label htmlFor="stops" className="text-sm cursor-pointer">
              Pontos de Parada
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="neighborhoods"
              checked={showNeighborhoods}
              onCheckedChange={(checked) => onToggleNeighborhoods?.(checked === true)}
            />
            <Label htmlFor="neighborhoods" className="text-sm cursor-pointer">
              Bairros
            </Label>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExportPNG}
          className="w-full"
        >
          <RiDownloadLine className="h-4 w-4 mr-2" />
          Exportar PNG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExportPDF}
          className="w-full"
        >
          <RiDownloadLine className="h-4 w-4 mr-2" />
          Exportar PDF
        </Button>
      </div>
    </div>
  );
}
