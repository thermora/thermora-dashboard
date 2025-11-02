import { query } from "./_generated/server";
import { v } from "convex/values";
import { generateRoutes, generateBusStops, generateThermalReadings, generateHotspots, generateHistoricalData, generateNeighborhoods } from "./mockData";

// Get current thermal readings (last 5 minutes)
export const getCurrentReadings = query({
	handler: async (ctx) => {
		const now = Date.now();
		const fiveMinutesAgo = now - 5 * 60 * 1000;

		// Check if we have readings in the database
		const existingReadings = await ctx.db
			.query("thermalReadings")
			.withIndex("by_timestamp", (q) => q.gte("timestamp", fiveMinutesAgo))
			.collect();

		// If we have recent readings, return them
		if (existingReadings.length > 0) {
			return existingReadings;
		}

		// Otherwise, generate mock data
		const mockReadings = generateThermalReadings(now);
		return mockReadings;
	},
});

// Get critical hotspots for today
export const getHotspots = query({
	handler: async (ctx) => {
		const today = new Date().toISOString().split("T")[0];

		// Check if we have hotspots in the database
		const existingHotspots = await ctx.db
			.query("hotspots")
			.withIndex("by_date", (q) => q.eq("date", today))
			.collect();

		// If we have hotspots, return them sorted by maxTemp descending
		if (existingHotspots.length > 0) {
			return existingHotspots.sort((a, b) => b.maxTemp - a.maxTemp);
		}

		// Otherwise, generate mock hotspots
		const mockHotspots = generateHotspots(today, Date.now());
		return mockHotspots.sort((a, b) => b.maxTemp - a.maxTemp);
	},
});

// Get temperature statistics
export const getTemperatureStats = query({
	handler: async (ctx) => {
		const now = Date.now();
		const fiveMinutesAgo = now - 5 * 60 * 1000;
		const yesterday = now - 24 * 60 * 60 * 1000;
		const yesterdayFiveMinutesAgo = yesterday - 5 * 60 * 1000;

		// Get current readings
		const currentReadings = await ctx.db
			.query("thermalReadings")
			.withIndex("by_timestamp", (q) => q.gte("timestamp", fiveMinutesAgo))
			.collect();

		// Get yesterday's readings for comparison
		const yesterdayReadings = await ctx.db
			.query("thermalReadings")
			.withIndex("by_timestamp", (q) => q.gte("timestamp", yesterdayFiveMinutesAgo).lt("timestamp", fiveMinutesAgo))
			.collect();

		let readings = currentReadings;
		if (readings.length === 0) {
			// Return mock data structure (without _id/_creationTime since it's not in DB)
			return {
				maxTemp: 38.5,
				avgTemp: 34.2,
				activeHotspots: 4,
				monitoredRoutes: 23,
				maxTempChange: 2.1,
				avgTempChange: 1.8,
			};
		}

		let yesterdayData = yesterdayReadings;
		if (yesterdayData.length === 0) {
			// Use approximate values for comparison
			const mockReadings = generateThermalReadings(now);
			const mockTemps = mockReadings.map((r) => r.temperature);
			const yesterdayMaxTemp = Math.max(...mockTemps) - 2;
			const yesterdayAvgTemp = mockTemps.reduce((a, b) => a + b, 0) / mockTemps.length - 1.8;

			const temperatures = readings.map((r) => r.temperature);
			const maxTemp = Math.max(...temperatures);
			const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;

			// Get active hotspots
			const today = new Date().toISOString().split("T")[0];
			const hotspots = await ctx.db
				.query("hotspots")
				.withIndex("by_date", (q) => q.eq("date", today))
				.collect();

			let activeHotspots = hotspots.length;
			if (activeHotspots === 0) {
				activeHotspots = generateHotspots(today, now).length;
			}

			// Get monitored routes
			const routes = await ctx.db
				.query("routes")
				.withIndex("by_active", (q) => q.eq("active", true))
				.collect();

			let monitoredRoutes = routes.length;
			if (monitoredRoutes === 0) {
				monitoredRoutes = generateRoutes().filter((r) => r.active).length;
			}

			return {
				maxTemp: Math.round(maxTemp * 10) / 10,
				avgTemp: Math.round(avgTemp * 10) / 10,
				activeHotspots,
				monitoredRoutes,
				maxTempChange: Math.round((maxTemp - yesterdayMaxTemp) * 10) / 10,
				avgTempChange: Math.round((avgTemp - yesterdayAvgTemp) * 10) / 10,
			};
		}

		// Calculate statistics
		const temperatures = readings.map((r) => r.temperature);
		const maxTemp = Math.max(...temperatures);
		const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;

		const yesterdayTemps = yesterdayData.map((r) => r.temperature);
		const yesterdayMaxTemp = Math.max(...yesterdayTemps);
		const yesterdayAvgTemp = yesterdayTemps.reduce((a, b) => a + b, 0) / yesterdayTemps.length;

		// Get active hotspots
		const today = new Date().toISOString().split("T")[0];
		const hotspots = await ctx.db
			.query("hotspots")
			.withIndex("by_date", (q) => q.eq("date", today))
			.collect();

		let activeHotspots = hotspots.length;
		if (activeHotspots === 0) {
			activeHotspots = generateHotspots(today, now).length;
		}

		// Get monitored routes
		const routes = await ctx.db
			.query("routes")
			.withIndex("by_active", (q) => q.eq("active", true))
			.collect();

		let monitoredRoutes = routes.length;
		if (monitoredRoutes === 0) {
			monitoredRoutes = generateRoutes().filter((r) => r.active).length;
		}

		return {
			maxTemp: Math.round(maxTemp * 10) / 10,
			avgTemp: Math.round(avgTemp * 10) / 10,
			activeHotspots,
			monitoredRoutes,
			maxTempChange: Math.round((maxTemp - yesterdayMaxTemp) * 10) / 10,
			avgTempChange: Math.round((avgTemp - yesterdayAvgTemp) * 10) / 10,
		};
	},
});

// Get 24h thermal evolution
export const get24hEvolution = query({
	handler: async (ctx) => {
		const now = Date.now();
		const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;

		// Get readings from last 24 hours
		const readings = await ctx.db
			.query("thermalReadings")
			.withIndex("by_timestamp", (q) => q.gte("timestamp", twentyFourHoursAgo))
			.collect();

		// Generate hourly averages for today
		const hours = Array.from({ length: 24 }, (_, i) => {
			const hourStart = now - (24 - i) * 60 * 60 * 1000;
			const hourEnd = hourStart + 60 * 60 * 1000;

			let hourReadings = readings.filter((r) => r.timestamp >= hourStart && r.timestamp < hourEnd);

			// If no readings, calculate mock average
			let avgTemp: number;
			if (hourReadings.length === 0) {
				// Use mock data to calculate average without storing in DB
				const mockReadings = generateThermalReadings(hourStart);
				const mockTemps = mockReadings.map((r) => r.temperature);
				avgTemp = mockTemps.length > 0
					? mockTemps.reduce((sum, temp) => sum + temp, 0) / mockTemps.length
					: 30 + Math.sin((i - 6) / 12 * Math.PI) * 4;
			} else {
				avgTemp = hourReadings.reduce((sum, r) => sum + r.temperature, 0) / hourReadings.length;
			}

			return {
				hour: i,
				temperature: Math.round(avgTemp * 10) / 10,
			};
		});

		// Get historical average
		const historical = generateHistoricalData();

		return {
			today: hours,
			historical: historical.map((h) => ({
				hour: h.hour,
				temperature: Math.round(h.temperature * 10) / 10,
			})),
		};
	},
});

// Get active bus routes
export const getRoutes = query({
	handler: async (ctx) => {
		const routes = await ctx.db
			.query("routes")
			.withIndex("by_active", (q) => q.eq("active", true))
			.collect();

		if (routes.length > 0) {
			return routes;
		}

		// Return mock routes if none exist
		return generateRoutes().filter((r) => r.active);
	},
});

// Get bus stops
export const getBusStops = query({
	handler: async (ctx) => {
		const stops = await ctx.db.query("busStops").collect();

		if (stops.length > 0) {
			return stops;
		}

		// Return mock stops if none exist
		return generateBusStops();
	},
});

// Get active neighborhoods (hoods)
export const getNeighborhoods = query({
	handler: async (ctx) => {
		const neighborhoods = await ctx.db
			.query("neighborhoods")
			.withIndex("by_active", (q) => q.eq("active", true))
			.collect();

		if (neighborhoods.length > 0) {
			return neighborhoods;
		}

		// Return mock neighborhoods if none exist
		return generateNeighborhoods().filter((n) => n.active);
	},
});

// Get devices with status and route information
export const getDevices = query({
	handler: async (ctx) => {
		const now = Date.now();
		const twoMinutesAgo = now - 2 * 60 * 1000;
		const tenMinutesAgo = now - 10 * 60 * 1000;
		const todayStart = new Date().setHours(0, 0, 0, 0);

		// Get all routes
		const routes = await ctx.db
			.query("routes")
			.withIndex("by_active", (q) => q.eq("active", true))
			.collect();

		const mockRoutes = generateRoutes().filter((r) => r.active);
		const allRoutes = routes.length > 0 ? routes : mockRoutes;

	// Get all recent readings
	const recentReadings = await ctx.db
		.query("thermalReadings")
		.withIndex("by_timestamp", (q) => q.gte("timestamp", todayStart))
		.collect();

	// Use mock data if no readings exist
	const mockReadings = recentReadings.length === 0 ? generateThermalReadings(now) : [];
	const allReadings = recentReadings.length > 0 ? recentReadings : mockReadings;

	// Group readings by deviceId
	const deviceMap = new Map<string, {
		deviceId: string;
		routeId?: string;
		lastReading: number;
		currentTemp: number;
		firstReadingToday: number;
	}>();

	allReadings.forEach((reading) => {
			const existing = deviceMap.get(reading.deviceId);
			if (!existing || reading.timestamp > existing.lastReading) {
				deviceMap.set(reading.deviceId, {
					deviceId: reading.deviceId,
					routeId: reading.routeId,
					lastReading: reading.timestamp,
					currentTemp: reading.temperature,
					firstReadingToday: existing?.firstReadingToday || reading.timestamp,
				});
			} else if (reading.timestamp < existing.firstReadingToday) {
				existing.firstReadingToday = reading.timestamp;
			}
		});

		// Convert to array and enrich with route names
		let devices = Array.from(deviceMap.values()).map((device) => {
			const route = allRoutes.find((r) => r.id === device.routeId);
			const routeName = route?.name || device.routeId || "Sem rota";

			// Determine status
			let status: "online" | "late" | "offline";
			if (device.lastReading >= twoMinutesAgo) {
				status = "online";
			} else if (device.lastReading >= tenMinutesAgo) {
				status = "late";
			} else {
				status = "offline";
			}

			// Calculate time on route (time since first reading today)
			const timeOnRoute = Math.floor((now - device.firstReadingToday) / 1000 / 60); // minutes

			return {
				deviceId: device.deviceId,
				routeName,
				status,
				currentTemp: Math.round(device.currentTemp * 10) / 10,
				lastReading: device.lastReading,
				timeOnRoute,
			};
		});

		// Sort by deviceId first
		devices = devices.sort((a, b) => a.deviceId.localeCompare(b.deviceId));

		// Simulate some devices as offline when using mock data
		if (recentReadings.length === 0 && devices.length > 0) {
			const fifteenMinutesAgo = now - 15 * 60 * 1000;
			const thirtyMinutesAgo = now - 30 * 60 * 1000;
			
			// Make some devices offline (every 3rd device starting from index 2)
			devices = devices.map((device, index) => {
				// Use device index to deterministically assign offline status
				// Makes approximately 30% of devices offline
				const shouldBeOffline = index % 3 === 2;
				
				if (shouldBeOffline) {
					// Set lastReading to be older than 10 minutes
					const offlineTimestamp = index % 2 === 0 
						? fifteenMinutesAgo - (index * 60 * 1000) // Varied offline times
						: thirtyMinutesAgo - (index * 60 * 1000);
					
					return {
						...device,
						status: "offline" as const,
						lastReading: offlineTimestamp,
					};
				}
				return device;
			});
		}

		return devices;
	},
});

// Get device details including location
export const getDeviceDetails = query({
	args: { deviceId: v.string() },
	handler: async (ctx, { deviceId }) => {
		const now = Date.now();
		const twoMinutesAgo = now - 2 * 60 * 1000;
		const tenMinutesAgo = now - 10 * 60 * 1000;
		const todayStart = new Date().setHours(0, 0, 0, 0);

		// Get all routes
		const routes = await ctx.db
			.query("routes")
			.withIndex("by_active", (q) => q.eq("active", true))
			.collect();

		const mockRoutes = generateRoutes().filter((r) => r.active);
		const allRoutes = routes.length > 0 ? routes : mockRoutes;

		// Get all recent readings for this device
		const recentReadings = await ctx.db
			.query("thermalReadings")
			.withIndex("by_timestamp", (q) => q.gte("timestamp", todayStart))
			.collect()
			.then(readings => readings.filter(r => r.deviceId === deviceId));

		// Use mock data if no readings exist
		const mockReadings = recentReadings.length === 0 ? generateThermalReadings(now).filter(r => r.deviceId === deviceId) : [];
		const allReadings = recentReadings.length > 0 ? recentReadings : mockReadings;

		if (allReadings.length === 0) {
			return null;
		}

		// Get the latest reading for location
		const latestReading = allReadings.reduce((latest, reading) => 
			reading.timestamp > latest.timestamp ? reading : latest
		);

		// Get route information
		const route = allRoutes.find((r) => r.id === latestReading.routeId);
		const routeName = route?.name || latestReading.routeId || "Sem rota";

		// Determine status
		let status: "online" | "late" | "offline";
		if (latestReading.timestamp >= twoMinutesAgo) {
			status = "online";
		} else if (latestReading.timestamp >= tenMinutesAgo) {
			status = "late";
		} else {
			status = "offline";
		}

		// Calculate time on route
		const firstReadingToday = allReadings.reduce((first, reading) => 
			reading.timestamp < first.timestamp ? reading : first
		);
		const timeOnRoute = Math.floor((now - firstReadingToday.timestamp) / 1000 / 60); // minutes

		// Get all readings for today to show on map
		const todayReadings = allReadings.map(r => ({
			lat: r.lat,
			lng: r.lng,
			temperature: r.temperature,
		}));

		return {
			deviceId: latestReading.deviceId,
			routeId: latestReading.routeId,
			routeName,
			status,
			currentTemp: Math.round(latestReading.temperature * 10) / 10,
			lastReading: latestReading.timestamp,
			timeOnRoute,
			lat: latestReading.lat,
			lng: latestReading.lng,
			route: route ? {
				id: route.id,
				name: route.name,
				coordinates: route.coordinates,
			} : undefined,
			readings: todayReadings,
		};
	},
});
