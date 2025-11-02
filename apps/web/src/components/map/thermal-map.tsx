'use client';

import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { renderToString } from 'react-dom/server';
import { Bus as BusIcon } from 'lucide-react';
import maplibregl, { type MapMouseEvent } from 'maplibre-gl';
import {
  BUS_ROUTES,
  MOCK_BUSES,
  interpolatePosition,
  type Bus,
  type BusRoute,
} from './bus-mock-data';

// Simple and reliable OpenStreetMap style
const MAP_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: 'osm-tiles',
      type: 'raster' as const,
      source: 'osm',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
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
  neighborhoods?: Array<{
    id: string;
    name: string;
    boundaries: Array<{ lat: number; lng: number }>;
    priority: 'high' | 'medium' | 'low';
    status: 'online' | 'offline';
  }>;
  showNeighborhoods?: boolean;
  onPointClick?: (lat: number, lng: number, temperature: number) => void;
  onRouteClick?: (routeId: string) => void;
}

export interface ThermalMapRef {
  flyTo: (lat: number, lng: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
}

const ThermalMap = forwardRef<ThermalMapRef, ThermalMapProps>(
  (
    {
      readings = [],
      routes = [],
      neighborhoods = [],
      showNeighborhoods = false,
      onPointClick,
      onRouteClick,
    },
    ref
  ) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [buses, setBuses] = useState<Bus[]>(MOCK_BUSES);
    const busMarkersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
    const animationFrameRef = useRef<number | undefined>(undefined);
    const addedNeighborhoodsRef = useRef<Set<string>>(new Set());

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
      zoomIn: () => {
        if (map.current) {
          map.current.zoomIn({ duration: 300 });
        }
      },
      zoomOut: () => {
        if (map.current) {
          map.current.zoomOut({ duration: 300 });
        }
      },
      resetView: () => {
        if (map.current) {
          map.current.flyTo({
            center: [-46.6333, -23.5505],
            zoom: 12,
            duration: 1000,
          });
        }
      },
    }));

    useEffect(() => {
      if (!mapContainer.current || map.current) return;

      console.log('🗺️ Initializing map with OpenStreetMap...');

      // Initialize map with simple OpenStreetMap raster tiles
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: MAP_STYLE as any,
        center: [-46.6333, -23.5505], // São Paulo
        zoom: 12,
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        console.log('✅ Map loaded successfully!');
        setMapLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('❌ Map error:', e);
      });

      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
        setMapLoaded(false);
      };
    }, []);

    // Add heatmap layer when map is loaded and readings are available
    useEffect(() => {
      if (!map.current || !mapLoaded || readings.length === 0) return;

      // Remove existing heatmap source and layer if they exist
      if (map.current.getSource('heatmap')) {
        map.current.removeLayer('heatmap');
        map.current.removeSource('heatmap');
      }

      // Add heatmap source
      map.current.addSource('heatmap', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: readings.map((reading) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [reading.lng, reading.lat],
            },
            properties: {
              temperature: reading.temperature,
            },
          })),
        },
      });

      // Add heatmap layer - visible at all zoom levels with smaller radius
      map.current.addLayer({
        id: 'heatmap',
        type: 'heatmap',
        source: 'heatmap',
        maxzoom: 22, // Allow heatmap at all zoom levels
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'temperature'],
            25,
            0.2,
            30,
            0.4,
            35,
            0.7,
            38,
            0.9,
            40,
            1,
          ],
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            0.8,
            9,
            1,
            11,
            1.2,
            13,
            1.5,
            15,
            1.8,
            18,
            2,
            22,
            2.5,
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(0, 0, 255, 0)',
            0.1,
            'rgba(65, 105, 225, 0.4)',
            0.2,
            'rgba(0, 255, 255, 0.5)',
            0.3,
            'rgba(0, 255, 0, 0.6)',
            0.4,
            'rgba(173, 255, 47, 0.65)',
            0.5,
            'rgba(255, 255, 0, 0.7)',
            0.6,
            'rgba(255, 215, 0, 0.75)',
            0.7,
            'rgba(255, 165, 0, 0.8)',
            0.8,
            'rgba(255, 69, 0, 0.85)',
            0.9,
            'rgba(255, 0, 0, 0.9)',
            1,
            'rgba(139, 0, 0, 0.95)',
          ],
          // Smaller, more focused hotspots that scale with zoom
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            4,
            8,
            8,
            10,
            12,
            12,
            18,
            14,
            25,
            16,
            35,
            18,
            45,
            22,
            60,
          ],
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            0.85,
            10,
            0.8,
            15,
            0.75,
            18,
            0.7,
            22,
            0.65,
          ],
        },
      });

      // Add points layer for interactions
      map.current.addSource('points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: readings.map((reading) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [reading.lng, reading.lat],
            },
            properties: {
              temperature: reading.temperature,
            },
          })),
        },
      });

      map.current.addLayer({
        id: 'points',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': 4,
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'temperature'],
            25,
            '#0000ff',
            30,
            '#00ff00',
            35,
            '#ffff00',
            40,
            '#ff0000',
          ],
          'circle-opacity': 0.8,
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
          layers: ['points'],
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
          layers: ['points'],
        });

        if (features && features.length > 0) {
          const feature = features[0];
          const [lng, lat] =
            feature.geometry.type === 'Point'
              ? feature.geometry.coordinates
              : [0, 0];
          const temperature = feature.properties?.temperature || 0;
          onPointClick?.(lat, lng, temperature);
        }
      };

      const handleMouseLeave = () => {
        popup.remove();
      };

      map.current.on('mousemove', 'points', handleMouseMove);
      map.current.on('mouseleave', 'points', handleMouseLeave);
      map.current.on('click', handleClick);

      return () => {
        map.current?.off('mousemove', 'points', handleMouseMove);
        map.current?.off('mouseleave', 'points', handleMouseLeave);
        map.current?.off('click', handleClick);
        popup.remove();
      };
    }, [mapLoaded, readings, onPointClick]);

    // Add routes layer
    // Routes rendering disabled - showing only thermal hotspots
    // useEffect(() => {
    //   if (!map.current || !mapLoaded || routes.length === 0) return;
    //   ... route rendering code removed
    // }, [mapLoaded, routes, onRouteClick]);

    // Add neighborhoods layer
    useEffect(() => {
      if (!map.current || !mapLoaded) return;

      // Remove neighborhoods if they exist but shouldn't be shown
      if (!showNeighborhoods || neighborhoods.length === 0) {
        if (map.current.getSource('neighborhoods')) {
          // Remove all previously added neighborhoods
          addedNeighborhoodsRef.current.forEach((hoodId) => {
            if (map.current?.getLayer(`neighborhood-${hoodId}-fill`)) {
              map.current.removeLayer(`neighborhood-${hoodId}-fill`);
            }
            if (map.current?.getLayer(`neighborhood-${hoodId}-outline`)) {
              map.current.removeLayer(`neighborhood-${hoodId}-outline`);
            }
          });
          map.current.removeSource('neighborhoods');
          addedNeighborhoodsRef.current.clear();
        }
        return;
      }

      // Remove existing neighborhoods if they exist
      if (map.current.getSource('neighborhoods')) {
        addedNeighborhoodsRef.current.forEach((hoodId) => {
          if (map.current?.getLayer(`neighborhood-${hoodId}-fill`)) {
            map.current.removeLayer(`neighborhood-${hoodId}-fill`);
          }
          if (map.current?.getLayer(`neighborhood-${hoodId}-outline`)) {
            map.current.removeLayer(`neighborhood-${hoodId}-outline`);
          }
        });
        map.current.removeSource('neighborhoods');
        addedNeighborhoodsRef.current.clear();
      }

      // Add neighborhoods source
      map.current.addSource('neighborhoods', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: neighborhoods.map((hood) => ({
            type: 'Feature' as const,
            geometry: {
              type: 'Polygon' as const,
              coordinates: [hood.boundaries.map((b) => [b.lng, b.lat])],
            },
            properties: {
              hoodId: hood.id,
              name: hood.name,
              priority: hood.priority,
              status: hood.status,
            },
          })),
        },
      });

      // Add neighborhoods layers with priority-based colors
      const neighborhoodHandlers: Array<{
        hoodId: string;
        handler: (e: MapMouseEvent) => void;
      }> = [];

      neighborhoods.forEach((hood) => {
        const isOffline = hood.status === 'offline';

        const priorityColors = {
          high: 'rgba(239, 68, 68, 0.3)', // red
          medium: 'rgba(251, 191, 36, 0.3)', // amber
          low: 'rgba(34, 197, 94, 0.3)', // green
        };

        const priorityOutlineColors = {
          high: '#ef4444',
          medium: '#fbbf24',
          low: '#22c55e',
        };

        // Use gray colors for offline neighborhoods
        const fillColor = isOffline
          ? 'rgba(148, 163, 184, 0.2)' // slate gray
          : priorityColors[hood.priority];

        const outlineColor = isOffline
          ? '#94a3b8' // slate gray
          : priorityOutlineColors[hood.priority];

        // Add fill layer
        map.current?.addLayer({
          id: `neighborhood-${hood.id}-fill`,
          type: 'fill',
          source: 'neighborhoods',
          filter: ['==', ['get', 'hoodId'], hood.id],
          paint: {
            'fill-color': fillColor,
            'fill-opacity': isOffline ? 0.1 : 0.2,
          },
        });

        // Add outline layer with dashed pattern for offline
        const outlinePaint: any = {
          'line-color': outlineColor,
          'line-width': isOffline ? 1.5 : 2,
          'line-opacity': isOffline ? 0.5 : 0.8,
        };

        if (isOffline) {
          outlinePaint['line-dasharray'] = [2, 2];
        }

        map.current?.addLayer({
          id: `neighborhood-${hood.id}-outline`,
          type: 'line',
          source: 'neighborhoods',
          filter: ['==', ['get', 'hoodId'], hood.id],
          paint: outlinePaint,
        });

        // Add click handler
        const hoodClickHandler = (e: MapMouseEvent) => {
          const statusLabel = hood.status === 'online' ? 'Online' : 'Offline';
          const statusColor =
            hood.status === 'online' ? 'text-emerald-600' : 'text-slate-500';

          const popup = new maplibregl.Popup({ offset: 25 })
            .setHTML(
              `
              <div class="p-3">
                <h3 class="font-bold text-sm mb-1">${hood.name}</h3>
                <p class="text-xs text-gray-600 mb-1">Prioridade: ${
                  hood.priority === 'high'
                    ? 'Alta'
                    : hood.priority === 'medium'
                      ? 'Média'
                      : 'Baixa'
                }</p>
                <p class="text-xs ${statusColor} font-medium">Status: ${statusLabel}</p>
              </div>
            `
            )
            .setLngLat(e.lngLat)
            .addTo(map.current!);
        };

        map.current?.on(
          'click',
          `neighborhood-${hood.id}-fill`,
          hoodClickHandler
        );
        map.current?.on(
          'click',
          `neighborhood-${hood.id}-outline`,
          hoodClickHandler
        );

        neighborhoodHandlers.push({
          hoodId: hood.id,
          handler: hoodClickHandler,
        });

        addedNeighborhoodsRef.current.add(hood.id);
      });

      return () => {
        neighborhoodHandlers.forEach(({ hoodId, handler }) => {
          map.current?.off('click', `neighborhood-${hoodId}-fill`, handler);
          map.current?.off('click', `neighborhood-${hoodId}-outline`, handler);
        });
      };
    }, [mapLoaded, neighborhoods, showNeighborhoods]);

    // Bus route lines disabled - showing only buses with pulse animations
    // Add and animate buses
    useEffect(() => {
      if (!map.current || !mapLoaded) return;

      console.log('🚌 Adding and animating buses...');

      // Create bus markers
      buses.forEach((bus) => {
        if (!busMarkersRef.current.has(bus.id)) {
          const route = BUS_ROUTES.find((r) => r.id === bus.routeId);
          if (!route) return;

          const position = interpolatePosition(
            route.coordinates,
            bus.currentPosition
          );

          // Create bus icon HTML using Lucide Bus icon
          const busIconSvg = renderToString(
            <BusIcon size={20} color='white' strokeWidth={2} />
          );

          const el = document.createElement('div');
          el.className = 'bus-marker';
          el.innerHTML = `
            <div class="relative">
              <!-- Pulse wave animation -->
              <div class="absolute inset-0 -m-8">
                <div class="bus-wave" style="border-color: ${route.color}20;"></div>
                <div class="bus-wave animation-delay-1000" style="border-color: ${route.color}15;"></div>
                <div class="bus-wave animation-delay-2000" style="border-color: ${route.color}10;"></div>
              </div>
              <!-- Bus icon -->
              <div class="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                   style="background-color: ${route.color};">
                ${busIconSvg}
              </div>
            </div>
          `;

          el.style.cursor = 'pointer';
          el.addEventListener('click', () => {
            const popup = new maplibregl.Popup({ offset: 25 })
              .setHTML(
                `
                <div class="p-3">
                  <h3 class="font-bold text-sm mb-1">${bus.name}</h3>
                  <p class="text-xs text-gray-600 mb-2">${route.name}</p>
                  <div class="flex items-center gap-2">
                    <span class="text-xs">🌡️ ${bus.temperature.toFixed(
                      1
                    )}°C</span>
                    <span class="text-xs">⚡ ${bus.speed} km/h</span>
                  </div>
                </div>
              `
              )
              .setLngLat([position.lng, position.lat])
              .addTo(map.current!);
          });

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([position.lng, position.lat])
            .addTo(map.current!);

          busMarkersRef.current.set(bus.id, marker);
        }
      });

      // Animation loop
      let lastTime = Date.now();
      const animate = () => {
        const currentTime = Date.now();
        const deltaTime = (currentTime - lastTime) / 1000; // seconds
        lastTime = currentTime;

        setBuses((prevBuses) =>
          prevBuses.map((bus) => {
            const route = BUS_ROUTES.find((r) => r.id === bus.routeId);
            if (!route) return bus;

            // Calculate new position (speed in km/h converted to position/second)
            // Assuming average route length of ~10km
            const positionDelta = (bus.speed / 10000) * deltaTime;
            let newPosition = bus.currentPosition + positionDelta;

            // Loop back to start if reached end
            if (newPosition >= 1) {
              newPosition = 0;
            }

            const position = interpolatePosition(
              route.coordinates,
              newPosition
            );

            // Update marker position
            const marker = busMarkersRef.current.get(bus.id);
            if (marker) {
              marker.setLngLat([position.lng, position.lat]);
            }

            return {
              ...bus,
              currentPosition: newPosition,
            };
          })
        );

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        busMarkersRef.current.forEach((marker: maplibregl.Marker) =>
          marker.remove()
        );
        busMarkersRef.current.clear();
      };
    }, [mapLoaded]);

    return (
      <div className='relative h-full w-full'>
        <div ref={mapContainer} className='h-full w-full' />
        {!mapLoaded && (
          <div className='absolute inset-0 flex items-center justify-center bg-slate-100'>
            <div className='text-center'>
              <div className='mb-2 text-lg font-medium'>Carregando mapa...</div>
              <div className='text-sm text-muted-foreground'>
                Aguarde enquanto inicializamos o mapa
              </div>
            </div>
          </div>
        )}

        {/* Temperature Legend */}
        <div className='absolute bottom-4 left-4 z-10 rounded-lg border bg-white p-4 shadow-lg'>
          <h3 className='mb-3 text-sm font-semibold'>Temperatura (°C)</h3>
          <div className='flex flex-col gap-2'>
            <div
              className='h-8 w-48 rounded-xl border border-slate-200'
              style={{
                background:
                  'linear-gradient(to right, #4A90E2, #50C878, #F4D03F, #F39C12, #E74C3C)',
              }}
            />
            <div className='flex justify-between text-xs font-medium text-slate-600'>
              <span>25°</span>
              <span>30°</span>
              <span>35°</span>
              <span>40°</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ThermalMap.displayName = 'ThermalMap';

export default ThermalMap;
