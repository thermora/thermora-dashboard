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
import { Skeleton } from "@/components/ui/skeleton";
import { RiMapPinLine } from "react-icons/ri";

export default function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState<"24h" | "7d" | "30d">("7d");
  const [showRoutes, setShowRoutes] = useState(true);
  const [showStops, setShowStops] = useState(true);
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
  const neighborhoods = useQuery(api.thermalData.getNeighborhoods);

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

  // Check if all data is loading
  const isLoading =
    stats === undefined ||
    hotspots === undefined ||
    evolution === undefined ||
    readings === undefined ||
    routes === undefined;

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col bg-white overflow-hidden">
        <DashboardTopbar
          onTimeFilterChange={handleTimeFilterChange}
          onExportClick={handleExportClick}
        />
        <div className="flex flex-1 relative overflow-hidden">
          {/* Map Loading Skeleton */}
          <div className="relative w-full h-full bg-slate-100 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <RiMapPinLine className="w-16 h-16 text-slate-400 animate-pulse" />
              <p className="text-slate-500 text-sm">Carregando mapa...</p>
            </div>
          </div>

          {/* Sidebar Loading Skeleton */}
          <div className="flex max-w-xl z-10 absolute right-12 top-4 flex-col max-h-[calc(100vh-14rem)] gap-4 bg-white p-6 border rounded-xl border-slate-200">
            {/* Status Cards Skeleton */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>

            {/* Chart Skeleton */}
            <div className="space-y-3 mt-4">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-[200px] w-full" />
            </div>

            {/* Hotspots List Skeleton */}
            <div className="space-y-3 mt-4">
              <Skeleton className="h-5 w-32" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white overflow-hidden">
      <DashboardTopbar
        onTimeFilterChange={handleTimeFilterChange}
        onExportClick={handleExportClick}
      />
      <div className="flex flex-1 relative overflow-hidden">
        <div className="relative w-full h-full">
          <ThermalMap
            ref={mapRef}
            readings={readings || []}
            routes={showRoutes ? routes || [] : []}
            neighborhoods={neighborhoods || []}
            showNeighborhoods={showNeighborhoods}
            onPointClick={handlePointClick}
            onRouteClick={handleRouteClick}
          />
          <MapControls
            showRoutes={showRoutes}
            showStops={showStops}
            showNeighborhoods={showNeighborhoods}
            onToggleRoutes={setShowRoutes}
            onToggleStops={setShowStops}
            onToggleNeighborhoods={setShowNeighborhoods}
            onExportPNG={handleExportPNG}
            onExportPDF={handleExportPDF}
          />
        </div>

        <div className="flex max-w-xl z-10 absolute right-12 top-4 flex-col max-h-[calc(100vh-14rem)] overflow-auto gap-4 overflow-y-auto bg-white p-6 border rounded-xl border-slate-200">
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

          <ThermalEvolutionChart
            today={evolution.today || []}
            historical={evolution.historical || []}
          />

          <HotspotsList
            hotspots={hotspots || []}
            onHotspotClick={(hotspot) =>
              handleHotspotClick({ ...hotspot, name: hotspot.name })
            }
          />
        </div>
      </div>
    </div>
  );
}
