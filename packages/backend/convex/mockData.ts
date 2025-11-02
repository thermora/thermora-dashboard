import { v } from "convex/values";

// São Paulo center coordinates
const SAO_PAULO_CENTER = { lat: -23.5505, lng: -46.6333 };

// Generate realistic bus routes in São Paulo area
export function generateRoutes() {
	return [
		{
			id: "route-1",
			name: "Linha 7411 - Terminal Central ↔ Jardim das Flores",
			coordinates: [
				{ lat: -23.5505, lng: -46.6333 }, // Terminal Central
				{ lat: -23.5515, lng: -46.6323 },
				{ lat: -23.5525, lng: -46.6313 },
				{ lat: -23.5535, lng: -46.6303 },
				{ lat: -23.5545, lng: -46.6293 }, // Jardim das Flores
			],
			active: true,
		},
		{
			id: "route-2",
			name: "Linha 7412 - Vila Jaguara ↔ Terminal Central",
			coordinates: [
				{ lat: -23.5485, lng: -46.6353 }, // Vila Jaguara
				{ lat: -23.5495, lng: -46.6343 },
				{ lat: -23.5505, lng: -46.6333 }, // Terminal Central
			],
			active: true,
		},
		{
			id: "route-3",
			name: "Linha 7413 - Vila dos Remédios ↔ Cidade das Flores",
			coordinates: [
				{ lat: -23.5475, lng: -46.6363 }, // Vila dos Remédios
				{ lat: -23.5485, lng: -46.6353 },
				{ lat: -23.5495, lng: -46.6343 },
				{ lat: -23.5515, lng: -46.6323 },
				{ lat: -23.5525, lng: -46.6313 }, // Cidade das Flores
			],
			active: true,
		},
		{
			id: "route-4",
			name: "Linha 7414 - Jardim Santa Cecília ↔ Praça do Mercado",
			coordinates: [
				{ lat: -23.5465, lng: -46.6373 }, // Jardim Santa Cecília
				{ lat: -23.5475, lng: -46.6363 },
				{ lat: -23.5485, lng: -46.6353 },
				{ lat: -23.5495, lng: -46.6343 },
				{ lat: -23.5505, lng: -46.6333 }, // Praça do Mercado
			],
			active: true,
		},
		{
			id: "route-5",
			name: "Linha 7415 - Av. Principal - Zona Norte ↔ Terminal Central",
			coordinates: [
				{ lat: -23.5455, lng: -46.6383 }, // Av. Principal - Zona Norte
				{ lat: -23.5465, lng: -46.6373 },
				{ lat: -23.5475, lng: -46.6363 },
				{ lat: -23.5485, lng: -46.6353 },
				{ lat: -23.5495, lng: -46.6343 },
				{ lat: -23.5505, lng: -46.6333 }, // Terminal Central
			],
			active: true,
		},
		{
			id: "route-6",
			name: "Linha 7416 - Rua Comercial - Centro ↔ Jardim Piratininga",
			coordinates: [
				{ lat: -23.5505, lng: -46.6333 }, // Rua Comercial - Centro
				{ lat: -23.5515, lng: -46.6323 },
				{ lat: -23.5525, lng: -46.6313 },
				{ lat: -23.5535, lng: -46.6303 },
				{ lat: -23.5545, lng: -46.6293 },
				{ lat: -23.5555, lng: -46.6283 }, // Jardim Piratininga
			],
			active: true,
		},
		{
			id: "route-7",
			name: "Linha 7417 - Jardim São Vicente ↔ Quitaúna",
			coordinates: [
				{ lat: -23.5445, lng: -46.6393 }, // Jardim São Vicente
				{ lat: -23.5455, lng: -46.6383 },
				{ lat: -23.5465, lng: -46.6373 },
				{ lat: -23.5475, lng: -46.6363 },
				{ lat: -23.5485, lng: -46.6353 },
				{ lat: -23.5495, lng: -46.6343 }, // Quitaúna
			],
			active: true,
		},
		{
			id: "route-8",
			name: "Linha 7418 - Vila Serventina ↔ Terminal Central",
			coordinates: [
				{ lat: -23.5435, lng: -46.6403 }, // Vila Serventina
				{ lat: -23.5445, lng: -46.6393 },
				{ lat: -23.5455, lng: -46.6383 },
				{ lat: -23.5465, lng: -46.6373 },
				{ lat: -23.5475, lng: -46.6363 },
				{ lat: -23.5485, lng: -46.6353 },
				{ lat: -23.5495, lng: -46.6343 },
				{ lat: -23.5505, lng: -46.6333 }, // Terminal Central
			],
			active: true,
		},
		{
			id: "route-9",
			name: "Linha 7419 - Jardim Aliança ↔ Praça do Mercado",
			coordinates: [
				{ lat: -23.5425, lng: -46.6413 }, // Jardim Aliança
				{ lat: -23.5435, lng: -46.6403 },
				{ lat: -23.5445, lng: -46.6393 },
				{ lat: -23.5455, lng: -46.6383 },
				{ lat: -23.5465, lng: -46.6373 },
				{ lat: -23.5475, lng: -46.6363 },
				{ lat: -23.5485, lng: -46.6353 },
				{ lat: -23.5495, lng: -46.6343 },
				{ lat: -23.5505, lng: -46.6333 }, // Praça do Mercado
			],
			active: true,
		},
		{
			id: "route-10",
			name: "Linha 7420 - Jardim Rochdal ↔ Terminal Central",
			coordinates: [
				{ lat: -23.5415, lng: -46.6423 }, // Jardim Rochdal
				{ lat: -23.5425, lng: -46.6413 },
				{ lat: -23.5435, lng: -46.6403 },
				{ lat: -23.5445, lng: -46.6393 },
				{ lat: -23.5455, lng: -46.6383 },
				{ lat: -23.5465, lng: -46.6373 },
				{ lat: -23.5475, lng: -46.6363 },
				{ lat: -23.5485, lng: -46.6353 },
				{ lat: -23.5495, lng: -46.6343 },
				{ lat: -23.5505, lng: -46.6333 }, // Terminal Central
			],
			active: true,
		},
	];
}

// Generate bus stops along routes
export function generateBusStops() {
	return [
		{ id: "stop-1", name: "Terminal Central", lat: -23.5505, lng: -46.6333, routeIds: ["route-1", "route-2", "route-5", "route-6", "route-8", "route-10"] },
		{ id: "stop-2", name: "Jardim das Flores", lat: -23.5545, lng: -46.6293, routeIds: ["route-1"] },
		{ id: "stop-3", name: "Vila Jaguara", lat: -23.5485, lng: -46.6353, routeIds: ["route-2", "route-3", "route-4"] },
		{ id: "stop-4", name: "Vila dos Remédios", lat: -23.5475, lng: -46.6363, routeIds: ["route-3", "route-4"] },
		{ id: "stop-5", name: "Jardim Santa Cecília", lat: -23.5465, lng: -46.6373, routeIds: ["route-4", "route-5", "route-7"] },
		{ id: "stop-6", name: "Praça do Mercado", lat: -23.5505, lng: -46.6333, routeIds: ["route-4", "route-9"] },
		{ id: "stop-7", name: "Av. Principal - Zona Norte", lat: -23.5455, lng: -46.6383, routeIds: ["route-5", "route-7", "route-8"] },
		{ id: "stop-8", name: "Rua Comercial - Centro", lat: -23.5505, lng: -46.6333, routeIds: ["route-6"] },
		{ id: "stop-9", name: "Jardim Piratininga", lat: -23.5555, lng: -46.6283, routeIds: ["route-6"] },
		{ id: "stop-10", name: "Jardim São Vicente", lat: -23.5445, lng: -46.6393, routeIds: ["route-7", "route-8"] },
		{ id: "stop-11", name: "Quitaúna", lat: -23.5495, lng: -46.6343, routeIds: ["route-7", "route-8", "route-9"] },
		{ id: "stop-12", name: "Vila Serventina", lat: -23.5435, lng: -46.6403, routeIds: ["route-8", "route-9"] },
		{ id: "stop-13", name: "Jardim Aliança", lat: -23.5425, lng: -46.6413, routeIds: ["route-9", "route-10"] },
		{ id: "stop-14", name: "Jardim Rochdal", lat: -23.5415, lng: -46.6423, routeIds: ["route-10"] },
		{ id: "stop-15", name: "Cidade das Flores", lat: -23.5525, lng: -46.6313, routeIds: ["route-3", "route-6"] },
	];
}

// Generate thermal readings with realistic patterns
export function generateThermalReadings(now: number) {
	const readings: Array<{
		timestamp: number;
		lat: number;
		lng: number;
		temperature: number;
		routeId?: string;
		deviceId: string;
	}> = [];

	const routes = generateRoutes();
	const routesWithStops = [
		{ route: routes[0], stops: [{ lat: -23.5505, lng: -46.6333 }, { lat: -23.5515, lng: -46.6323 }, { lat: -23.5525, lng: -46.6313 }, { lat: -23.5535, lng: -46.6303 }, { lat: -23.5545, lng: -46.6293 }] },
		{ route: routes[1], stops: [{ lat: -23.5485, lng: -46.6353 }, { lat: -23.5495, lng: -46.6343 }, { lat: -23.5505, lng: -46.6333 }] },
		{ route: routes[2], stops: [{ lat: -23.5475, lng: -46.6363 }, { lat: -23.5485, lng: -46.6353 }, { lat: -23.5495, lng: -46.6343 }, { lat: -23.5515, lng: -46.6323 }, { lat: -23.5525, lng: -46.6313 }] },
		{ route: routes[3], stops: [{ lat: -23.5465, lng: -46.6373 }, { lat: -23.5475, lng: -46.6363 }, { lat: -23.5485, lng: -46.6353 }, { lat: -23.5495, lng: -46.6343 }, { lat: -23.5505, lng: -46.6333 }] },
		{ route: routes[4], stops: [{ lat: -23.5455, lng: -46.6383 }, { lat: -23.5465, lng: -46.6373 }, { lat: -23.5475, lng: -46.6363 }, { lat: -23.5485, lng: -46.6353 }, { lat: -23.5495, lng: -46.6343 }, { lat: -23.5505, lng: -46.6333 }] },
	];

	// Generate readings for last 5 minutes (300 seconds)
	for (let i = 0; i < 300; i += 30) {
		const timestamp = now - (300 - i) * 1000;

		routesWithStops.forEach(({ route, stops }) => {
			stops.forEach((stop, idx) => {
				// Central areas tend to be hotter
				const distanceFromCenter = Math.sqrt(
					Math.pow(stop.lat - SAO_PAULO_CENTER.lat, 2) +
					Math.pow(stop.lng - SAO_PAULO_CENTER.lng, 2)
				);

				// Base temperature varies by location
				let baseTemp = 32 + (distanceFromCenter * 1000); // Higher temp in center

				// Add some randomness
				baseTemp += (Math.random() - 0.5) * 4;

				// Time-based variation (hotter during day)
				const hour = new Date(timestamp).getHours();
				const timeFactor = hour >= 12 && hour <= 16 ? 3 : hour >= 10 && hour <= 18 ? 2 : 1;
				baseTemp += timeFactor;

				// Terminal Central is hottest
				if (Math.abs(stop.lat - -23.5505) < 0.001 && Math.abs(stop.lng - -46.6333) < 0.001) {
					baseTemp = 38.5 + (Math.random() - 0.5) * 2;
				}

				readings.push({
					timestamp,
					lat: stop.lat + (Math.random() - 0.5) * 0.002, // Small random offset
					lng: stop.lng + (Math.random() - 0.5) * 0.002,
					temperature: Math.max(25, Math.min(40, baseTemp)),
					routeId: route.id,
					deviceId: `device-${route.id}-${idx}`,
				});
			});
		});
	}

	return readings;
}

// Generate hotspots based on high temperature concentrations
export function generateHotspots(today: string, now: number) {
	return [
		{
			name: "Terminal Central",
			lat: -23.5505,
			lng: -46.6333,
			maxTemp: 38.5,
			duration: 45,
			population: 2500,
			riskLevel: "Emergency" as const,
			date: today,
			startTime: now - 45 * 60 * 1000,
		},
		{
			name: "Av. Principal - Zona Norte",
			lat: -23.5455,
			lng: -46.6383,
			maxTemp: 37.2,
			duration: 32,
			population: 1800,
			riskLevel: "Danger" as const,
			date: today,
			startTime: now - 32 * 60 * 1000,
		},
		{
			name: "Praça do Mercado",
			lat: -23.5505,
			lng: -46.6333,
			maxTemp: 36.1,
			duration: 28,
			population: 1200,
			riskLevel: "Danger" as const,
			date: today,
			startTime: now - 28 * 60 * 1000,
		},
		{
			name: "Rua Comercial - Centro",
			lat: -23.5505,
			lng: -46.6333,
			maxTemp: 35.5,
			duration: 18,
			population: 800,
			riskLevel: "Caution" as const,
			date: today,
			startTime: now - 18 * 60 * 1000,
		},
		{
			name: "Jardim das Flores",
			lat: -23.5545,
			lng: -46.6293,
			maxTemp: 34.8,
			duration: 15,
			population: 600,
			riskLevel: "Caution" as const,
			date: today,
			startTime: now - 15 * 60 * 1000,
		},
	];
}

// Generate historical temperature data for comparison
export function generateHistoricalData() {
	const hours = Array.from({ length: 24 }, (_, i) => i);
	const baseTemp = 31; // Historical average

	return hours.map((hour) => ({
		hour,
		temperature: baseTemp + Math.sin((hour - 6) / 12 * Math.PI) * 4 + (Math.random() - 0.5) * 2,
	}));
}
