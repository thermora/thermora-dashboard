import { query } from "./_generated/server";
import { generateRoutes, generateBusStops, generateThermalReadings, generateHotspots, generateHistoricalData } from "./mockData";

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

		let readings = recentReadings;
		if (readings.length === 0) {
			readings = generateThermalReadings(now);
		}

		// Group readings by deviceId
		const deviceMap = new Map<string, {
			deviceId: string;
			routeId?: string;
			lastReading: number;
			currentTemp: number;
			firstReadingToday: number;
		}>();

		readings.forEach((reading) => {
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
		const devices = Array.from(deviceMap.values()).map((device) => {
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

		// Sort by deviceId
		return devices.sort((a, b) => a.deviceId.localeCompare(b.deviceId));
	},
});
