"use client";

import { useQuery } from "convex/react";
import { api } from "@thermora-dashboard/backend/convex/_generated/api";
import { useState, useEffect, useRef } from "react";
import DashboardTopbar from "@/components/dashboard-topbar";
import ThermalMap from "@/components/map/thermal-map";
import type { ThermalMapRef } from "@/components/map/thermal-map";
import MapControls from "@/components/map/map-controls";
import StatusCards from "@/components/dashboard/status-cards";
import ThermalEvolutionChart from "@/components/dashboard/thermal-evolution-chart";
import HotspotsList from "@/components/dashboard/hotspots-list";
import { toast } from "sonner";

export default function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState<"24h" | "7d" | "30d">("7d");
  const [showRoutes, setShowRoutes] = useState(true);
  const [showStops, setShowStops] = useState(true);
  const [showShade, setShowShade] = useState(false);
  const [showNeighborhoods, setShowNeighborhoods] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapRef = useRef<ThermalMapRef>(null);

  // Fetch data from Convex
  const stats = useQuery(api.thermalData.getTemperatureStats);
  const hotspots = useQuery(api.thermalData.getHotspots);
  const evolution = useQuery(api.thermalData.get24hEvolution);
  const readings = useQuery(api.thermalData.getCurrentReadings);
  const routes = useQuery(api.thermalData.getRoutes);

  // Auto-refresh readings every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger a refetch by updating a state
      setTimeFilter((prev) => prev);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleTimeFilterChange = (filter: "24h" | "7d" | "30d") => {
    setTimeFilter(filter);
    toast.info(
      `Filtro alterado para: ${
        filter === "24h" ? "24 horas" : filter === "7d" ? "7 dias" : "30 dias"
      }`
    );
  };

  const handleExportClick = () => {
    toast.success("Exportando relatório...");
    // TODO: Implement export functionality
  };

  const handleExportPNG = () => {
    toast.success("Exportando mapa como PNG...");
    // TODO: Implement PNG export
  };

  const handleExportPDF = () => {
    toast.success("Exportando mapa como PDF...");
    // TODO: Implement PDF export
  };

  const handleHotspotClick = (hotspot: {
    lat: number;
    lng: number;
    name: string;
  }) => {
    setSelectedHotspot({ lat: hotspot.lat, lng: hotspot.lng });
    mapRef.current?.flyTo(hotspot.lat, hotspot.lng);
    toast.info(`Visualizando: ${hotspot.name}`);
  };

  const handlePointClick = (lat: number, lng: number, temperature: number) => {
    toast.info(`Temperatura: ${temperature.toFixed(1)}°C`);
  };

  const handleRouteClick = (routeId: string) => {
    toast.info(`Rota selecionada: ${routeId}`);
  };

  const now = Date.now();
  const minTime = now - 24 * 60 * 60 * 1000;
  const maxTime = now;

  return (
    <div className="flex h-screen flex-col bg-white overflow-hidden">
      <DashboardTopbar
        onTimeFilterChange={handleTimeFilterChange}
        onExportClick={handleExportClick}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Map - Approximately 2/3 width */}
        <div className="relative w-2/3 h-full">
          <ThermalMap
            ref={mapRef}
            readings={readings || []}
            routes={showRoutes ? routes || [] : []}
            onPointClick={handlePointClick}
            onRouteClick={handleRouteClick}
          />
          <MapControls
            showRoutes={showRoutes}
            showStops={showStops}
            showShade={showShade}
            showNeighborhoods={showNeighborhoods}
            onToggleRoutes={setShowRoutes}
            onToggleStops={setShowStops}
            onToggleShade={setShowShade}
            onToggleNeighborhoods={setShowNeighborhoods}
            onExportPNG={handleExportPNG}
            onExportPDF={handleExportPDF}
            currentTime={now}
            minTime={minTime}
            maxTime={maxTime}
          />
        </div>

        {/* Right: Panel - Approximately 1/3 width */}
        <div className="flex w-1/3 flex-col gap-4 overflow-y-auto bg-white p-6 border-l border-gray-200">
          {stats === undefined ? (
            <div className="text-center text-muted-foreground py-8">
              Carregando estatísticas...
            </div>
          ) : (
            <StatusCards
              maxTemp={stats.maxTemp || 0}
              maxTempChange={stats.maxTempChange || 0}
              avgTemp={stats.avgTemp || 0}
              avgTempChange={stats.avgTempChange || 0}
              activeHotspots={stats.activeHotspots || 0}
              activeHotspotsChange={0}
              monitoredRoutes={stats.monitoredRoutes || 0}
              monitoredRoutesChange={0}
            />
          )}

          {evolution === undefined ? (
            <div className="text-center text-muted-foreground py-8">
              Carregando gráfico...
            </div>
          ) : (
            <ThermalEvolutionChart
              today={evolution.today || []}
              historical={evolution.historical || []}
            />
          )}

          {hotspots === undefined ? (
            <div className="text-center text-muted-foreground py-8">
              Carregando hotspots...
            </div>
          ) : (
            <HotspotsList
              hotspots={hotspots || []}
              onHotspotClick={(hotspot) =>
                handleHotspotClick({ ...hotspot, name: hotspot.name })
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
