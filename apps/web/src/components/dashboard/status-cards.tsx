"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, AlertTriangle, Bus, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatusCardProps {
	title: string;
	value: string | number;
	change?: number;
	changeLabel?: string;
	icon: React.ReactNode;
	variant?: "default" | "warning" | "danger" | "success";
}

function StatusCard({ title, value, change, changeLabel, icon, variant = "default" }: StatusCardProps) {
	const getChangeIcon = () => {
		if (change === undefined || change === 0) return <Minus className="h-4 w-4" />;
		if (change > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
		return <TrendingDown className="h-4 w-4 text-green-500" />;
	};

	const getChangeColor = () => {
		if (change === undefined || change === 0) return "text-muted-foreground";
		if (change > 0) return "text-red-500";
		return "text-green-500";
	};

	const formatChange = () => {
		if (change === undefined || change === 0) return "→";
		if (change > 0) return `↑+${Math.abs(change).toFixed(1)}`;
		return `↓${change.toFixed(1)}`;
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<div className="text-muted-foreground">{icon}</div>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				{change !== undefined && (
					<p className={`text-xs flex items-center gap-1 mt-1 ${getChangeColor()}`}>
						{getChangeIcon()}
						{formatChange()} {changeLabel || "vs ontem"}
					</p>
				)}
			</CardContent>
		</Card>
	);
}

interface StatusCardsProps {
	maxTemp?: number;
	maxTempChange?: number;
	avgTemp?: number;
	avgTempChange?: number;
	activeHotspots?: number;
	activeHotspotsChange?: number;
	monitoredRoutes?: number;
	monitoredRoutesChange?: number;
}

export default function StatusCards({
	maxTemp = 0,
	maxTempChange = 0,
	avgTemp = 0,
	avgTempChange = 0,
	activeHotspots = 0,
	activeHotspotsChange = 0,
	monitoredRoutes = 0,
	monitoredRoutesChange = 0,
}: StatusCardsProps) {
	return (
		<div className="grid grid-cols-2 gap-4">
			<StatusCard
				title="Temperatura Máxima"
				value={`${maxTemp.toFixed(1)} °C`}
				change={maxTempChange}
				changeLabel="vs ontem"
				icon={<Thermometer className="h-4 w-4 text-red-500" />}
				variant="danger"
			/>
			<StatusCard
				title="Média da Cidade"
				value={`${avgTemp.toFixed(1)} °C`}
				change={avgTempChange}
				changeLabel="vs ontem"
				icon={<Thermometer className="h-4 w-4 text-yellow-500" />}
				variant="warning"
			/>
			<StatusCard
				title="Hotspots Ativos"
				value={activeHotspots}
				change={activeHotspotsChange}
				changeLabel="vs ontem"
				icon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
				variant="warning"
			/>
			<StatusCard
				title="Rotas Monitoradas"
				value={monitoredRoutes}
				change={monitoredRoutesChange}
				changeLabel="vs ontem"
				icon={<Bus className="h-4 w-4 text-green-500" />}
				variant="success"
			/>
		</div>
	);
}
