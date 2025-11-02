"use client";

import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import maplibregl from "maplibre-gl";
import type { Map, MapMouseEvent } from "maplibre-gl";
import { Protocol } from "pmtiles";

let protocolRegistered = false;

// Protomaps style using vector tiles API (simpler and more reliable)
const PROTOMAPS_STYLE = {
  version: 8,
  sources: {
    protomaps: {
      type: "vector",
      tiles: [
        "https://api.protomaps.com/tiles/v3/{z}/{x}/{y}.mvt?key=demo"
      ],
      minzoom: 0,
      maxzoom: 14,
      attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>'
    }
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#f0f0f0"
      }
    },
    {
      id: "earth",
      type: "fill",
      source: "protomaps",
      "source-layer": "earth",
      paint: {
        "fill-color": "#e2dfda"
      }
    },
    {
      id: "natural",
      type: "fill",
      source: "protomaps",
      "source-layer": "natural",
      filter: ["==", ["get", "pmap:kind"], "park"],
      paint: {
        "fill-color": "#cde5b3"
      }
    },
    {
      id: "landuse",
      type: "fill",
      source: "protomaps",
      "source-layer": "landuse",
      paint: {
        "fill-color": "#e8e8e8",
        "fill-opacity": 0.6
      }
    },
    {
      id: "water",
      type: "fill",
      source: "protomaps",
      "source-layer": "water",
      paint: {
        "fill-color": "#80deea"
      }
    },
    {
      id: "buildings",
      type: "fill",
      source: "protomaps",
      "source-layer": "buildings",
      minzoom: 14,
      paint: {
        "fill-color": "#cccccc",
        "fill-opacity": 0.5
      }
    },
    {
      id: "roads-minor",
      type: "line",
      source: "protomaps",
      "source-layer": "roads",
      minzoom: 12,
      filter: ["==", ["get", "pmap:kind"], "minor_road"],
      paint: {
        "line-color": "#ffffff",
        "line-width": [
          "interpolate",
          ["exponential", 1.6],
          ["zoom"],
          12, 0.5,
          14, 1,
          18, 4
        ]
      }
    },
    {
      id: "roads-major",
      type: "line",
      source: "protomaps",
      "source-layer": "roads",
      filter: ["==", ["get", "pmap:kind"], "major_road"],
      paint: {
        "line-color": "#ffffff",
        "line-width": [
          "interpolate",
          ["exponential", 1.6],
          ["zoom"],
          8, 1,
          14, 2,
          18, 8
        ]
      }
    },
    {
      id: "roads-highway",
      type: "line",
      source: "protomaps",
      "source-layer": "roads",
      filter: ["==", ["get", "pmap:kind"], "highway"],
      paint: {
        "line-color": "#ffd700",
        "line-width": [
          "interpolate",
          ["exponential", 1.6],
          ["zoom"],
          6, 1,
          14, 3,
          18, 10
        ]
      }
    },
    {
      id: "boundaries",
      type: "line",
      source: "protomaps",
      "source-layer": "boundaries",
      paint: {
        "line-color": "#adadad",
        "line-width": 1,
        "line-dasharray": [3, 2]
      }
    },
    {
      id: "place-labels",
      type: "symbol",
      source: "protomaps",
      "source-layer": "places",
      filter: ["==", ["get", "pmap:kind"], "locality"],
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Noto Sans Regular"],
        "text-size": 14,
        "text-anchor": "center"
      },
      paint: {
        "text-color": "#333333",
        "text-halo-color": "#ffffff",
        "text-halo-width": 2
      }
    }
  ],
  glyphs: "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf"
};

interface ThermalMapProps {
  readings?: Array<{
    lat: number;
    lng: number;
    temperature: number;
  }>;
  routes?: Array<{
    id: string;
    name: string;
    coordinates: Array<{ lat: number; lng: number }>;
  }>;
  onPointClick?: (lat: number, lng: number, temperature: number) => void;
  onRouteClick?: (routeId: string) => void;
}

export interface ThermalMapRef {
  flyTo: (lat: number, lng: number) => void;
}

const ThermalMap = forwardRef<ThermalMapRef, ThermalMapProps>(
  ({ readings = [], routes = [], onPointClick, onRouteClick }, ref) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useImperativeHandle(ref, () => ({
      flyTo: (lat: number, lng: number) => {
        if (map.current) {
          map.current.flyTo({
            center: [lng, lat],
            zoom: 14,
            duration: 1000,
          });
        }
      },
    }));

    useEffect(() => {
      if (!mapContainer.current || map.current) return;

      console.log("🗺️ Initializing map...");

      try {
        // Initialize map with Protomaps style (using vector tiles API, no PMTiles needed)
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: PROTOMAPS_STYLE as any,
          center: [-46.6333, -23.5505], // São Paulo
          zoom: 12,
          attributionControl: true,
        });

        // Add navigation controls
        map.current.addControl(new maplibregl.NavigationControl(), "top-right");

        map.current.on("load", () => {
          console.log("✅ Protomaps loaded successfully!");
          setMapLoaded(true);
        });

        map.current.on("error", (e) => {
          console.error("❌ Map error:", e.error);
        });

        map.current.on("data", (e) => {
          if (e.dataType === "source" && e.isSourceLoaded) {
            console.log("📍 Source loaded:", e.sourceId);
          }
        });

        // Set timeout to detect loading issues
        const timeout = setTimeout(() => {
          if (!mapLoaded) {
            console.warn("⚠️ Map is taking too long to load. Check network tab for errors.");
          }
        }, 10000);

        return () => {
          clearTimeout(timeout);
          map.current?.remove();
        };

      } catch (error) {
        console.error("💥 Failed to initialize map:", error);
        setMapLoaded(true); // Set to true to hide loading message
      }
    }, []);

    // Add heatmap layer when map is loaded and readings are available
    useEffect(() => {
      if (!map.current || !mapLoaded || readings.length === 0) return;

      // Remove existing heatmap source and layer if they exist
      if (map.current.getSource("heatmap")) {
        map.current.removeLayer("heatmap");
        map.current.removeSource("heatmap");
      }

      // Add heatmap source
      map.current.addSource("heatmap", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: readings.map((reading) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [reading.lng, reading.lat],
            },
            properties: {
              temperature: reading.temperature,
            },
          })),
        },
      });

      // Add heatmap layer
      map.current.addLayer({
        id: "heatmap",
        type: "heatmap",
        source: "heatmap",
        maxzoom: 15,
        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "temperature"],
            25,
            0,
            30,
            0.5,
            35,
            1,
            40,
            1.5,
          ],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            0.5,
            9,
            1,
            12,
            2,
            15,
            3,
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0, 0, 255, 0)", // Blue (cold)
            0.2,
            "rgba(0, 255, 0, 0.5)", // Green
            0.4,
            "rgba(255, 255, 0, 0.7)", // Yellow
            0.6,
            "rgba(255, 165, 0, 0.8)", // Orange
            0.8,
            "rgba(255, 0, 0, 0.9)", // Red (hot)
          ],
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            50,
            9,
            75,
            12,
            100,
            15,
            200,
          ],
          "heatmap-opacity": 0.7,
        },
      });

      // Add points layer for interactions
      map.current.addSource("points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: readings.map((reading) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [reading.lng, reading.lat],
            },
            properties: {
              temperature: reading.temperature,
            },
          })),
        },
      });

      map.current.addLayer({
        id: "points",
        type: "circle",
        source: "points",
        paint: {
          "circle-radius": 4,
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "temperature"],
            25,
            "#0000ff",
            30,
            "#00ff00",
            35,
            "#ffff00",
            40,
            "#ff0000",
          ],
          "circle-opacity": 0.8,
        },
      });

      // Create popup for tooltips
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      // Add hover handler for tooltips
      const handleMouseMove = (e: MapMouseEvent) => {
        const features = map.current?.queryRenderedFeatures(e.point, {
          layers: ["points"],
        });

        if (features && features.length > 0) {
          const feature = features[0];
          const temperature = feature.properties?.temperature || 0;
          popup
            .setLngLat(e.lngLat)
            .setHTML(
              `<div class="p-2"><strong>Temperatura:</strong> ${temperature.toFixed(
                1
              )}°C</div>`
            )
            .addTo(map.current!);
        } else {
          popup.remove();
        }
      };

      // Add click handler
      const handleClick = (e: MapMouseEvent) => {
        const features = map.current?.queryRenderedFeatures(e.point, {
          layers: ["points"],
        });

        if (features && features.length > 0) {
          const feature = features[0];
          const [lng, lat] =
            feature.geometry.type === "Point"
              ? feature.geometry.coordinates
              : [0, 0];
          const temperature = feature.properties?.temperature || 0;
          onPointClick?.(lat, lng, temperature);
        }
      };

      const handleMouseLeave = () => {
        popup.remove();
      };

      map.current.on("mousemove", "points", handleMouseMove);
      map.current.on("mouseleave", "points", handleMouseLeave);
      map.current.on("click", handleClick);

      return () => {
        map.current?.off("mousemove", "points", handleMouseMove);
        map.current?.off("mouseleave", "points", handleMouseLeave);
        map.current?.off("click", handleClick);
        popup.remove();
      };
    }, [mapLoaded, readings, onPointClick]);

    // Add routes layer
    useEffect(() => {
      if (!map.current || !mapLoaded || routes.length === 0) return;

      // Remove existing routes if they exist
      if (map.current.getSource("routes")) {
        routes.forEach((route) => {
          if (map.current?.getLayer(`route-${route.id}`)) {
            map.current.removeLayer(`route-${route.id}`);
          }
        });
        map.current.removeSource("routes");
      }

      // Add routes source
      map.current.addSource("routes", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: routes.map((route) => ({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: route.coordinates.map((c) => [c.lng, c.lat]),
            },
            properties: {
              routeId: route.id,
              name: route.name,
            },
          })),
        },
      });

      // Add routes layer
      const routeHandlers: Array<{
        routeId: string;
        handler: (e: MapMouseEvent) => void;
      }> = [];

      routes.forEach((route) => {
        const routeClickHandler = (e: MapMouseEvent) => {
          onRouteClick?.(route.id);
        };

        map.current?.addLayer({
          id: `route-${route.id}`,
          type: "line",
          source: "routes",
          filter: ["==", ["get", "routeId"], route.id],
          paint: {
            "line-color": "#3b82f6",
            "line-width": 3,
            "line-opacity": 0.7,
          },
        });

        // Add click handler for routes
        map.current?.on("click", `route-${route.id}`, routeClickHandler);
        routeHandlers.push({ routeId: route.id, handler: routeClickHandler });
      });

      return () => {
        routeHandlers.forEach(({ routeId, handler }) => {
          map.current?.off("click", `route-${routeId}`, handler);
        });
      };
    }, [mapLoaded, routes, onRouteClick]);

    return (
      <div className="relative h-full w-full">
        <div ref={mapContainer} className="h-full w-full" />
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <div className="text-center">
              <div className="mb-2 text-lg font-medium">Carregando mapa...</div>
              <div className="text-sm text-muted-foreground">
                Aguarde enquanto inicializamos o mapa
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ThermalMap.displayName = "ThermalMap";

export default ThermalMap;
