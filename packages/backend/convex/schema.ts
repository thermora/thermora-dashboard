import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	todos: defineTable({
		text: v.string(),
		completed: v.boolean(),
	}),
	thermalReadings: defineTable({
		timestamp: v.number(),
		lat: v.number(),
		lng: v.number(),
		temperature: v.number(),
		routeId: v.optional(v.string()),
		deviceId: v.string(),
	}).index("by_timestamp", ["timestamp"])
		.index("by_route", ["routeId"]),
	hotspots: defineTable({
		name: v.string(),
		lat: v.number(),
		lng: v.number(),
		maxTemp: v.number(),
		duration: v.number(), // minutes
		population: v.number(),
		riskLevel: v.union(v.literal("Emergency"), v.literal("Danger"), v.literal("Caution")),
		date: v.string(), // YYYY-MM-DD format
		startTime: v.number(), // timestamp
	}).index("by_date", ["date"]),
	routes: defineTable({
		id: v.string(),
		name: v.string(),
		coordinates: v.array(v.object({
			lat: v.number(),
			lng: v.number(),
		})),
		active: v.boolean(),
	}).index("by_active", ["active"]),
	busStops: defineTable({
		id: v.string(),
		name: v.string(),
		lat: v.number(),
		lng: v.number(),
		routeIds: v.array(v.string()),
	}).index("by_route", ["routeIds"]),
	neighborhoods: defineTable({
		id: v.string(),
		name: v.string(),
		boundaries: v.array(v.object({
			lat: v.number(),
			lng: v.number(),
		})),
		priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
		status: v.union(v.literal("online"), v.literal("offline")),
		active: v.boolean(),
	}).index("by_active", ["active"]),
});
