"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Download, Layers, Clock, ZoomIn, ZoomOut, Compass } from "lucide-react";
import { useState } from "react";

interface MapControlsProps {
	showRoutes?: boolean;
	showStops?: boolean;
	showShade?: boolean;
	showNeighborhoods?: boolean;
	onToggleRoutes?: (enabled: boolean) => void;
	onToggleStops?: (enabled: boolean) => void;
	onToggleShade?: (enabled: boolean) => void;
	onToggleNeighborhoods?: (enabled: boolean) => void;
	onTimeChange?: (time: number) => void;
	onExportPNG?: () => void;
	onExportPDF?: () => void;
	onZoomIn?: () => void;
	onZoomOut?: () => void;
	onResetView?: () => void;
	currentTime?: number;
	minTime?: number;
	maxTime?: number;
}

export default function MapControls({
	showRoutes = true,
	showStops = true,
	showShade = false,
	showNeighborhoods = false,
	onToggleRoutes,
	onToggleStops,
	onToggleShade,
	onToggleNeighborhoods,
	onTimeChange,
	onExportPNG,
	onExportPDF,
	onZoomIn,
	onZoomOut,
	onResetView,
	currentTime,
	minTime,
	maxTime,
}: MapControlsProps) {
	const [timeValue, setTimeValue] = useState(currentTime || Date.now());

	const handleTimeChange = (value: number) => {
		setTimeValue(value);
		onTimeChange?.(value);
	};

	const formatTime = (timestamp: number) => {
		const date = new Date(timestamp);
		return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
	};

	return (
		<div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
			{/* Zoom Controls */}
			<div className="flex flex-col gap-1 rounded-lg border bg-white p-2 shadow-md">
				<Button variant="outline" size="icon" onClick={onZoomIn} className="h-8 w-8">
					<ZoomIn className="h-4 w-4" />
				</Button>
				<Button variant="outline" size="icon" onClick={onZoomOut} className="h-8 w-8">
					<ZoomOut className="h-4 w-4" />
				</Button>
				<Button variant="outline" size="icon" onClick={onResetView} className="h-8 w-8">
					<Compass className="h-4 w-4" />
				</Button>
			</div>

			{/* Time Slider */}
			{(minTime !== undefined && maxTime !== undefined) && (
				<div className="rounded-lg border bg-white p-4 shadow-md">
					<div className="flex items-center gap-2 mb-2">
						<Clock className="h-4 w-4 text-muted-foreground" />
						<Label className="text-sm font-medium">Horário</Label>
					</div>
					<input
						type="range"
						min={minTime}
						max={maxTime}
						value={timeValue}
						onChange={(e) => handleTimeChange(Number(e.target.value))}
						className="w-full"
					/>
					<div className="text-center text-sm text-muted-foreground mt-1">
						{formatTime(timeValue)}
					</div>
				</div>
			)}

			{/* Layer Controls */}
			<div className="rounded-lg border bg-white p-4 shadow-md">
				<div className="flex items-center gap-2 mb-3">
					<Layers className="h-4 w-4 text-muted-foreground" />
					<Label className="text-sm font-medium">Camadas</Label>
				</div>
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<Checkbox
							id="routes"
							checked={showRoutes}
							onCheckedChange={(checked) => onToggleRoutes?.(checked === true)}
						/>
						<Label htmlFor="routes" className="text-sm cursor-pointer">
							Rotas de Ônibus
						</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox
							id="stops"
							checked={showStops}
							onCheckedChange={(checked) => onToggleStops?.(checked === true)}
						/>
						<Label htmlFor="stops" className="text-sm cursor-pointer">
							Pontos de Parada
						</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox
							id="shade"
							checked={showShade}
							onCheckedChange={(checked) => onToggleShade?.(checked === true)}
						/>
						<Label htmlFor="shade" className="text-sm cursor-pointer">
							Sombra
						</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox
							id="neighborhoods"
							checked={showNeighborhoods}
							onCheckedChange={(checked) => onToggleNeighborhoods?.(checked === true)}
						/>
						<Label htmlFor="neighborhoods" className="text-sm cursor-pointer">
							Bairros
						</Label>
					</div>
				</div>
			</div>

			{/* Export Buttons */}
			<div className="flex flex-col gap-2">
				<Button variant="outline" size="sm" onClick={onExportPNG} className="w-full">
					<Download className="h-4 w-4 mr-2" />
					Exportar PNG
				</Button>
				<Button variant="outline" size="sm" onClick={onExportPDF} className="w-full">
					<Download className="h-4 w-4 mr-2" />
					Exportar PDF
				</Button>
			</div>
		</div>
	);
}
