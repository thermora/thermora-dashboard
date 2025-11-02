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

// Generate thermal readings with realistic patterns - 35+ devices spread across the city
export function generateThermalReadings(now: number) {
	const readings: Array<{
		timestamp: number;
		lat: number;
		lng: number;
		temperature: number;
		routeId?: string;
		deviceId: string;
	}> = [];

	// 35 fixed device locations spread across São Paulo with assigned routes
	const deviceLocations = [
		// Centro region (hottest) - Route 1
		{ lat: -23.5505, lng: -46.6333, name: "Terminal Central", baseTempOffset: 6, routeId: "route-1" },
		{ lat: -23.5510, lng: -46.6340, name: "Praça República", baseTempOffset: 5, routeId: "route-1" },
		{ lat: -23.5500, lng: -46.6325, name: "Av. Paulista", baseTempOffset: 5.5, routeId: "route-6" },
		{ lat: -23.5495, lng: -46.6338, name: "Rua Augusta", baseTempOffset: 5, routeId: "route-2" },
		
		// Zona Norte - Routes 5, 7, 8
		{ lat: -23.5455, lng: -46.6383, name: "Av. Principal", baseTempOffset: 4, routeId: "route-5" },
		{ lat: -23.5445, lng: -46.6393, name: "Jardim São Vicente", baseTempOffset: 3.5, routeId: "route-7" },
		{ lat: -23.5435, lng: -46.6403, name: "Vila Serventina", baseTempOffset: 3, routeId: "route-8" },
		{ lat: -23.5425, lng: -46.6413, name: "Jardim Aliança", baseTempOffset: 3, routeId: "route-9" },
		{ lat: -23.5415, lng: -46.6423, name: "Jardim Rochdal", baseTempOffset: 2.5, routeId: "route-10" },
		{ lat: -23.5465, lng: -46.6373, name: "Jardim Santa Cecília", baseTempOffset: 4, routeId: "route-4" },
		{ lat: -23.5475, lng: -46.6363, name: "Vila dos Remédios", baseTempOffset: 3.5, routeId: "route-3" },
		
		// Zona Sul - Route 1, 6
		{ lat: -23.5545, lng: -46.6293, name: "Jardim das Flores", baseTempOffset: 3, routeId: "route-1" },
		{ lat: -23.5555, lng: -46.6283, name: "Jardim Piratininga", baseTempOffset: 2.5, routeId: "route-6" },
		{ lat: -23.5535, lng: -46.6303, name: "Cidade das Flores", baseTempOffset: 3, routeId: "route-3" },
		{ lat: -23.5565, lng: -46.6273, name: "Parque São Domingos", baseTempOffset: 2, routeId: "route-6" },
		
		// Zona Leste - Routes 2, 3
		{ lat: -23.5485, lng: -46.6253, name: "Vila Leopoldina", baseTempOffset: 3.5, routeId: "route-2" },
		{ lat: -23.5495, lng: -46.6243, name: "Lapa", baseTempOffset: 4, routeId: "route-2" },
		{ lat: -23.5515, lng: -46.6233, name: "Água Branca", baseTempOffset: 4.5, routeId: "route-3" },
		{ lat: -23.5525, lng: -46.6223, name: "Barra Funda", baseTempOffset: 5, routeId: "route-3" },
		{ lat: -23.5535, lng: -46.6213, name: "Santa Cecília", baseTempOffset: 4.5, routeId: "route-4" },
		
		// Zona Oeste - Routes 4, 5
		{ lat: -23.5485, lng: -46.6453, name: "Pinheiros", baseTempOffset: 4, routeId: "route-4" },
		{ lat: -23.5495, lng: -46.6463, name: "Vila Madalena", baseTempOffset: 3.5, routeId: "route-5" },
		{ lat: -23.5505, lng: -46.6473, name: "Alto de Pinheiros", baseTempOffset: 3, routeId: "route-5" },
		{ lat: -23.5515, lng: -46.6483, name: "Butantã", baseTempOffset: 2.5, routeId: "route-6" },
		
		// Mais zonas centrais e adjacentes - Various routes
		{ lat: -23.5520, lng: -46.6350, name: "Consolação", baseTempOffset: 5, routeId: "route-1" },
		{ lat: -23.5530, lng: -46.6360, name: "Higienópolis", baseTempOffset: 4.5, routeId: "route-7" },
		{ lat: -23.5515, lng: -46.6323, name: "Bela Vista", baseTempOffset: 5, routeId: "route-8" },
		{ lat: -23.5525, lng: -46.6313, name: "Liberdade", baseTempOffset: 4.5, routeId: "route-9" },
		{ lat: -23.5475, lng: -46.6303, name: "Cambuci", baseTempOffset: 4, routeId: "route-10" },
		{ lat: -23.5485, lng: -46.6293, name: "Mooca", baseTempOffset: 4.5, routeId: "route-2" },
		
		// Extremos da cidade - Routes 7-10
		{ lat: -23.5405, lng: -46.6433, name: "Casa Verde", baseTempOffset: 2, routeId: "route-7" },
		{ lat: -23.5395, lng: -46.6443, name: "Limão", baseTempOffset: 1.5, routeId: "route-8" },
		{ lat: -23.5575, lng: -46.6263, name: "Jabaquara", baseTempOffset: 2.5, routeId: "route-9" },
		{ lat: -23.5585, lng: -46.6253, name: "Vila Mariana", baseTempOffset: 3, routeId: "route-10" },
		{ lat: -23.5465, lng: -46.6493, name: "Morumbi", baseTempOffset: 2, routeId: "route-6" },
	];

	// Generate readings for last 5 minutes (300 seconds)
	for (let i = 0; i < 300; i += 30) {
		const timestamp = now - (300 - i) * 1000;

		deviceLocations.forEach((location, idx) => {
			// Base temperature varies by location
			let baseTemp = 30 + location.baseTempOffset;

			// Add some randomness
			baseTemp += (Math.random() - 0.5) * 3;

			// Time-based variation (hotter during day)
			const hour = new Date(timestamp).getHours();
			const timeFactor = hour >= 12 && hour <= 16 ? 3 : hour >= 10 && hour <= 18 ? 2 : 1;
			baseTemp += timeFactor;

			readings.push({
				timestamp,
				lat: location.lat + (Math.random() - 0.5) * 0.0005, // Very small random offset
				lng: location.lng + (Math.random() - 0.5) * 0.0005,
				temperature: Math.max(25, Math.min(42, baseTemp)),
				routeId: location.routeId,
				deviceId: `device-${String(idx + 1).padStart(3, '0')}`,
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
			maxTemp: 40.2,
			duration: 65,
			population: 3200,
			riskLevel: "Emergency" as const,
			date: today,
			startTime: now - 65 * 60 * 1000,
		},
		{
			name: "Av. Paulista",
			lat: -23.5500,
			lng: -46.6325,
			maxTemp: 39.8,
			duration: 58,
			population: 2800,
			riskLevel: "Emergency" as const,
			date: today,
			startTime: now - 58 * 60 * 1000,
		},
		{
			name: "Praça República",
			lat: -23.5510,
			lng: -46.6340,
			maxTemp: 38.5,
			duration: 52,
			population: 2400,
			riskLevel: "Emergency" as const,
			date: today,
			startTime: now - 52 * 60 * 1000,
		},
		{
			name: "Barra Funda",
			lat: -23.5525,
			lng: -46.6223,
			maxTemp: 38.1,
			duration: 48,
			population: 2100,
			riskLevel: "Danger" as const,
			date: today,
			startTime: now - 48 * 60 * 1000,
		},
		{
			name: "Consolação",
			lat: -23.5520,
			lng: -46.6350,
			maxTemp: 37.9,
			duration: 45,
			population: 1950,
			riskLevel: "Danger" as const,
			date: today,
			startTime: now - 45 * 60 * 1000,
		},
		{
			name: "Rua Augusta",
			lat: -23.5495,
			lng: -46.6338,
			maxTemp: 37.6,
			duration: 42,
			population: 1800,
			riskLevel: "Danger" as const,
			date: today,
			startTime: now - 42 * 60 * 1000,
		},
		{
			name: "Liberdade",
			lat: -23.5525,
			lng: -46.6313,
			maxTemp: 37.2,
			duration: 38,
			population: 1650,
			riskLevel: "Danger" as const,
			date: today,
			startTime: now - 38 * 60 * 1000,
		},
		{
			name: "Água Branca",
			lat: -23.5515,
			lng: -46.6233,
			maxTemp: 36.8,
			duration: 35,
			population: 1500,
			riskLevel: "Danger" as const,
			date: today,
			startTime: now - 35 * 60 * 1000,
		},
		{
			name: "Lapa",
			lat: -23.5495,
			lng: -46.6243,
			maxTemp: 36.5,
			duration: 32,
			population: 1400,
			riskLevel: "Danger" as const,
			date: today,
			startTime: now - 32 * 60 * 1000,
		},
		{
			name: "Pinheiros",
			lat: -23.5485,
			lng: -46.6453,
			maxTemp: 36.2,
			duration: 30,
			population: 1300,
			riskLevel: "Caution" as const,
			date: today,
			startTime: now - 30 * 60 * 1000,
		},
		{
			name: "Av. Principal - Zona Norte",
			lat: -23.5455,
			lng: -46.6383,
			maxTemp: 35.9,
			duration: 28,
			population: 1200,
			riskLevel: "Caution" as const,
			date: today,
			startTime: now - 28 * 60 * 1000,
		},
		{
			name: "Mooca",
			lat: -23.5485,
			lng: -46.6293,
			maxTemp: 35.6,
			duration: 26,
			population: 1100,
			riskLevel: "Caution" as const,
			date: today,
			startTime: now - 26 * 60 * 1000,
		},
		{
			name: "Cambuci",
			lat: -23.5475,
			lng: -46.6303,
			maxTemp: 35.3,
			duration: 24,
			population: 1000,
			riskLevel: "Caution" as const,
			date: today,
			startTime: now - 24 * 60 * 1000,
		},
		{
			name: "Jardim Santa Cecília",
			lat: -23.5465,
			lng: -46.6373,
			maxTemp: 35.0,
			duration: 22,
			population: 950,
			riskLevel: "Caution" as const,
			date: today,
			startTime: now - 22 * 60 * 1000,
		},
		{
			name: "Vila dos Remédios",
			lat: -23.5475,
			lng: -46.6363,
			maxTemp: 34.7,
			duration: 20,
			population: 850,
			riskLevel: "Caution" as const,
			date: today,
			startTime: now - 20 * 60 * 1000,
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

// Generate neighborhoods (hoods) in São Paulo area
export function generateNeighborhoods() {
	return [
		{
			id: "hood-1",
			name: "Vila Jaguara",
			boundaries: [
				{ lat: -23.5495, lng: -46.6363 },
				{ lat: -23.5495, lng: -46.6343 },
				{ lat: -23.5475, lng: -46.6343 },
				{ lat: -23.5475, lng: -46.6363 },
				{ lat: -23.5495, lng: -46.6363 },
			],
			priority: "high" as const,
			status: "online" as const,
			active: true,
		},
		{
			id: "hood-2",
			name: "Jardim Santa Cecília",
			boundaries: [
				{ lat: -23.5475, lng: -46.6383 },
				{ lat: -23.5475, lng: -46.6363 },
				{ lat: -23.5455, lng: -46.6363 },
				{ lat: -23.5455, lng: -46.6383 },
				{ lat: -23.5475, lng: -46.6383 },
			],
			priority: "high" as const,
			status: "online" as const,
			active: true,
		},
		{
			id: "hood-3",
			name: "Vila dos Remédios",
			boundaries: [
				{ lat: -23.5485, lng: -46.6373 },
				{ lat: -23.5485, lng: -46.6353 },
				{ lat: -23.5465, lng: -46.6353 },
				{ lat: -23.5465, lng: -46.6373 },
				{ lat: -23.5485, lng: -46.6373 },
			],
			priority: "medium" as const,
			status: "offline" as const,
			active: true,
		},
		{
			id: "hood-4",
			name: "Jardim das Flores",
			boundaries: [
				{ lat: -23.5555, lng: -46.6303 },
				{ lat: -23.5555, lng: -46.6283 },
				{ lat: -23.5535, lng: -46.6283 },
				{ lat: -23.5535, lng: -46.6303 },
				{ lat: -23.5555, lng: -46.6303 },
			],
			priority: "medium" as const,
			status: "online" as const,
			active: true,
		},
		{
			id: "hood-5",
			name: "Centro",
			boundaries: [
				{ lat: -23.5515, lng: -46.6353 },
				{ lat: -23.5515, lng: -46.6313 },
				{ lat: -23.5495, lng: -46.6313 },
				{ lat: -23.5495, lng: -46.6353 },
				{ lat: -23.5515, lng: -46.6353 },
			],
			priority: "high" as const,
			status: "online" as const,
			active: true,
		},
		{
			id: "hood-6",
			name: "Jardim São Vicente",
			boundaries: [
				{ lat: -23.5455, lng: -46.6403 },
				{ lat: -23.5455, lng: -46.6383 },
				{ lat: -23.5435, lng: -46.6383 },
				{ lat: -23.5435, lng: -46.6403 },
				{ lat: -23.5455, lng: -46.6403 },
			],
			priority: "medium" as const,
			status: "offline" as const,
			active: true,
		},
		{
			id: "hood-7",
			name: "Vila Serventina",
			boundaries: [
				{ lat: -23.5445, lng: -46.6413 },
				{ lat: -23.5445, lng: -46.6393 },
				{ lat: -23.5425, lng: -46.6393 },
				{ lat: -23.5425, lng: -46.6413 },
				{ lat: -23.5445, lng: -46.6413 },
			],
			priority: "low" as const,
			status: "offline" as const,
			active: true,
		},
		{
			id: "hood-8",
			name: "Jardim Aliança",
			boundaries: [
				{ lat: -23.5435, lng: -46.6423 },
				{ lat: -23.5435, lng: -46.6403 },
				{ lat: -23.5415, lng: -46.6403 },
				{ lat: -23.5415, lng: -46.6423 },
				{ lat: -23.5435, lng: -46.6423 },
			],
			priority: "low" as const,
			status: "online" as const,
			active: true,
		},
	];
}
