"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

interface ThermalEvolutionChartProps {
	today?: Array<{ hour: number; temperature: number }>;
	historical?: Array<{ hour: number; temperature: number }>;
}

export default function ThermalEvolutionChart({ today = [], historical = [] }: ThermalEvolutionChartProps) {
	// Combine data for chart
	const chartData = Array.from({ length: 24 }, (_, i) => {
		const todayData = today.find((d) => d.hour === i);
		const historicalData = historical.find((d) => d.hour === i);

		return {
			hour: `${i.toString().padStart(2, "0")}:00`,
			today: todayData?.temperature || 0,
			historical: historicalData?.temperature || 0,
		};
	});

	// Calculate average difference
	const avgDifference = today.length > 0 && historical.length > 0
		? today.reduce((sum, d) => {
				const hist = historical.find((h) => h.hour === d.hour);
				return sum + (d.temperature - (hist?.temperature || 0));
			}, 0) / today.length
		: 0;

	return (
		<Card className="shadow-sm border-slate-200">
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2.5 text-lg">
						<div className="p-2 rounded-lg bg-blue-50">
							<Activity className="h-4 w-4 text-blue-600" />
						</div>
						<span className="font-semibold text-slate-900">Evolução Térmica 24h</span>
					</CardTitle>
					{avgDifference !== 0 && (
						<div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
							avgDifference > 0 
								? "bg-red-50 text-red-600" 
								: "bg-green-50 text-green-600"
						}`}>
							{avgDifference > 0 ? (
								<TrendingUp className="h-3.5 w-3.5" />
							) : (
								<TrendingDown className="h-3.5 w-3.5" />
							)}
							<span>{avgDifference > 0 ? "+" : ""}{avgDifference.toFixed(1)}°C</span>
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
						<defs>
							<linearGradient id="colorToday" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
								<stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
							</linearGradient>
							<linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
								<stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
						<XAxis
							dataKey="hour"
							tick={{ fontSize: 11, fill: "#64748b" }}
							tickLine={{ stroke: "#e2e8f0" }}
							axisLine={{ stroke: "#e2e8f0" }}
							interval={2}
						/>
						<YAxis
							domain={[0, 40]}
							tick={{ fontSize: 11, fill: "#64748b" }}
							tickLine={{ stroke: "#e2e8f0" }}
							axisLine={{ stroke: "#e2e8f0" }}
							label={{ 
								value: "Temperatura (°C)", 
								angle: -90, 
								position: "insideLeft",
								style: { fontSize: 12, fill: "#64748b", fontWeight: 500 }
							}}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "white",
								border: "1px solid #e2e8f0",
								borderRadius: "8px",
								boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
								fontSize: "12px",
								fontWeight: 500
							}}
							labelStyle={{ color: "#0f172a", fontWeight: 600 }}
						/>
						<Legend 
							wrapperStyle={{ fontSize: "12px", fontWeight: 500 }}
							iconType="line"
						/>
						<Line
							type="monotone"
							dataKey="today"
							stroke="#f97316"
							strokeWidth={2.5}
							name="Hoje"
							dot={{ r: 3, fill: "#f97316", strokeWidth: 2, stroke: "white" }}
							activeDot={{ r: 5, fill: "#f97316", strokeWidth: 2, stroke: "white" }}
							fill="url(#colorToday)"
						/>
						<Line
							type="monotone"
							dataKey="historical"
							stroke="#3b82f6"
							strokeWidth={2.5}
							strokeDasharray="5 5"
							name="Média Histórica"
							dot={{ r: 3, fill: "#3b82f6", strokeWidth: 2, stroke: "white" }}
							activeDot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: "white" }}
							fill="url(#colorHistorical)"
						/>
					</LineChart>
				</ResponsiveContainer>
				<div className="mt-5 pt-4 border-t border-slate-100">
					{avgDifference > 0 ? (
						<div className="flex items-center gap-2 text-sm">
							<div className="p-1.5 rounded-md bg-red-50">
								<TrendingUp className="h-4 w-4 text-red-600" />
							</div>
							<span className="text-slate-700">
								<span className="font-semibold text-red-600">+{avgDifference.toFixed(1)}°C</span> acima da média histórica hoje
							</span>
						</div>
					) : avgDifference < 0 ? (
						<div className="flex items-center gap-2 text-sm">
							<div className="p-1.5 rounded-md bg-green-50">
								<TrendingDown className="h-4 w-4 text-green-600" />
							</div>
							<span className="text-slate-700">
								<span className="font-semibold text-green-600">{avgDifference.toFixed(1)}°C</span> abaixo da média histórica hoje
							</span>
						</div>
					) : (
						<div className="flex items-center gap-2 text-sm">
							<div className="p-1.5 rounded-md bg-slate-50">
								<Activity className="h-4 w-4 text-slate-600" />
							</div>
							<span className="text-slate-600 font-medium">
								Temperatura dentro da média histórica
							</span>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
