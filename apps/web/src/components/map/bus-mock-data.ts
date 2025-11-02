// Mock data for buses and their routes in São Paulo

export interface BusRoute {
  id: string;
  name: string;
  color: string;
  coordinates: Array<{ lat: number; lng: number }>;
}

export interface Bus {
  id: string;
  routeId: string;
  name: string;
  temperature: number; // Current temperature reading
  speed: number; // km/h
  currentPosition: number; // Index in route coordinates (0-1 normalized)
}

// Bus routes in São Paulo (simplified routes)
export const BUS_ROUTES: BusRoute[] = [
  {
    id: "route-1",
    name: "Linha 875M - Pinheiros/Centro",
    color: "#3b82f6",
    coordinates: [
      { lat: -23.5629, lng: -46.6933 }, // Pinheiros
      { lat: -23.5609, lng: -46.6878 },
      { lat: -23.5589, lng: -46.6823 },
      { lat: -23.5569, lng: -46.6768 },
      { lat: -23.5549, lng: -46.6713 },
      { lat: -23.5529, lng: -46.6658 },
      { lat: -23.5509, lng: -46.6603 },
      { lat: -23.5489, lng: -46.6548 },
      { lat: -23.5469, lng: -46.6493 },
      { lat: -23.5449, lng: -46.6438 }, // Centro
    ],
  },
  {
    id: "route-2",
    name: "Linha 477A - Vila Madalena/Paulista",
    color: "#ef4444",
    coordinates: [
      { lat: -23.5459, lng: -46.6933 }, // Vila Madalena
      { lat: -23.5479, lng: -46.6878 },
      { lat: -23.5499, lng: -46.6823 },
      { lat: -23.5519, lng: -46.6768 },
      { lat: -23.5539, lng: -46.6713 },
      { lat: -23.5559, lng: -46.6658 },
      { lat: -23.5579, lng: -46.6603 }, // Paulista
    ],
  },
  {
    id: "route-3",
    name: "Linha 702U - Morumbi/Berrini",
    color: "#10b981",
    coordinates: [
      { lat: -23.6133, lng: -46.7033 }, // Morumbi
      { lat: -23.6093, lng: -46.6978 },
      { lat: -23.6053, lng: -46.6923 },
      { lat: -23.6013, lng: -46.6868 },
      { lat: -23.5973, lng: -46.6813 },
      { lat: -23.5933, lng: -46.6758 },
      { lat: -23.5893, lng: -46.6703 }, // Berrini
    ],
  },
  {
    id: "route-4",
    name: "Linha 856P - Lapa/República",
    color: "#f59e0b",
    coordinates: [
      { lat: -23.5279, lng: -46.7033 }, // Lapa
      { lat: -23.5299, lng: -46.6978 },
      { lat: -23.5319, lng: -46.6923 },
      { lat: -23.5339, lng: -46.6868 },
      { lat: -23.5359, lng: -46.6813 },
      { lat: -23.5379, lng: -46.6758 },
      { lat: -23.5399, lng: -46.6703 },
      { lat: -23.5419, lng: -46.6648 },
      { lat: -23.5439, lng: -46.6593 }, // República
    ],
  },
];

// Mock buses with initial positions
export const MOCK_BUSES: Bus[] = [
  {
    id: "bus-1",
    routeId: "route-1",
    name: "Ônibus 875M-01",
    temperature: 32.5,
    speed: 25,
    currentPosition: 0.2,
  },
  {
    id: "bus-2",
    routeId: "route-1",
    name: "Ônibus 875M-02",
    temperature: 31.8,
    speed: 30,
    currentPosition: 0.6,
  },
  {
    id: "bus-3",
    routeId: "route-2",
    name: "Ônibus 477A-01",
    temperature: 33.2,
    speed: 20,
    currentPosition: 0.3,
  },
  {
    id: "bus-4",
    routeId: "route-2",
    name: "Ônibus 477A-02",
    temperature: 30.9,
    speed: 28,
    currentPosition: 0.8,
  },
  {
    id: "bus-5",
    routeId: "route-3",
    name: "Ônibus 702U-01",
    temperature: 34.1,
    speed: 22,
    currentPosition: 0.4,
  },
  {
    id: "bus-6",
    routeId: "route-3",
    name: "Ônibus 702U-02",
    temperature: 29.7,
    speed: 26,
    currentPosition: 0.7,
  },
  {
    id: "bus-7",
    routeId: "route-4",
    name: "Ônibus 856P-01",
    temperature: 35.2,
    speed: 18,
    currentPosition: 0.15,
  },
  {
    id: "bus-8",
    routeId: "route-4",
    name: "Ônibus 856P-02",
    temperature: 31.5,
    speed: 24,
    currentPosition: 0.55,
  },
];

// Helper function to interpolate position along route
export const interpolatePosition = (
  coordinates: Array<{ lat: number; lng: number }>,
  position: number // 0 to 1
): { lat: number; lng: number } => {
  const totalSegments = coordinates.length - 1;
  const segmentPosition = position * totalSegments;
  const segmentIndex = Math.floor(segmentPosition);
  const segmentProgress = segmentPosition - segmentIndex;

  if (segmentIndex >= totalSegments) {
    return coordinates[coordinates.length - 1];
  }

  const start = coordinates[segmentIndex];
  const end = coordinates[segmentIndex + 1];

  return {
    lat: start.lat + (end.lat - start.lat) * segmentProgress,
    lng: start.lng + (end.lng - start.lng) * segmentProgress,
  };
};
