"use client";

import React from "react";
import { Badge } from "@/components/ui/badge-2";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/line-charts-1";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardToolbar,
} from "@/components/ui/card";
import { RiLineChartLine, RiArrowUpLine, RiArrowDownLine } from "react-icons/ri";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

interface ThermalEvolutionChartProps {
  today?: Array<{ hour: number; temperature: number }>;
  historical?: Array<{ hour: number; temperature: number }>;
}

// Chart config
const chartConfig = {
  historical: {
    label: "Média Histórica",
    color: "var(--color-pink-500)",
  },
  today: {
    label: "Hoje",
    color: "var(--color-teal-500)",
  },
} satisfies ChartConfig;

// Custom Tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const ChartLabel = ({
  label,
  color = chartConfig.today.color,
}: {
  label: string;
  color: string;
}) => {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="size-3.5 border-4 rounded-full bg-background"
        style={{ borderColor: color }}
      ></div>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    // Filter out todayArea from tooltip
    const filteredPayload = payload.filter(
      (entry) => entry.dataKey !== "todayArea"
    );

    return (
      <div className="rounded-lg border bg-popover p-3 shadow-sm shadow-black/5 min-w-[180px]">
        <div className="text-xs font-medium text-muted-foreground tracking-wide mb-2.5">
          {label}
        </div>
        <div className="space-y-2">
          {filteredPayload.map((entry, index) => {
            const config =
              chartConfig[entry.dataKey as keyof typeof chartConfig];
            return (
              <div key={index} className="flex items-center gap-2 text-xs">
                <ChartLabel label={config?.label + ":"} color={entry.color} />
                <span className="font-semibold text-popover-foreground">
                  {entry.value.toFixed(1)}°C
                </span>
                {config?.label === "Média Histórica" &&
                  filteredPayload[0] &&
                  filteredPayload[0].value !== entry.value && (
                    <Badge
                      variant={
                        ((entry.value - filteredPayload[0].value) /
                          filteredPayload[0].value) *
                          100 >
                        0
                          ? "success"
                          : "destructive"
                      }
                      appearance="light"
                      className="text-xs flex items-center gap-1"
                      size="sm"
                    >
                      {((entry.value - filteredPayload[0].value) /
                        filteredPayload[0].value) *
                        100 >
                      0 ? (
                        <RiArrowUpLine className="size-3" />
                      ) : (
                        <RiArrowDownLine className="size-3" />
                      )}
                      {Math.abs(
                        ((entry.value - filteredPayload[0].value) /
                          filteredPayload[0].value) *
                          100
                      ).toFixed(0)}
                      %
                    </Badge>
                  )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default function ThermalEvolutionChart({
  today = [],
  historical = [],
}: ThermalEvolutionChartProps) {
  // Combine data for chart
  const chartData = Array.from({ length: 24 }, (_, i) => {
    const todayData = today.find((d) => d.hour === i);
    const historicalData = historical.find((d) => d.hour === i);

    return {
      hour: `${i.toString().padStart(2, "0")}:00`,
      today: todayData?.temperature || 0,
      todayArea: todayData?.temperature || 0,
      historical: historicalData?.temperature || 0,
    };
  });

  // Calculate average difference
  const avgDifference =
    today.length > 0 && historical.length > 0
      ? today.reduce((sum, d) => {
          const hist = historical.find((h) => h.hour === d.hour);
          return sum + (d.temperature - (hist?.temperature || 0));
        }, 0) / today.length
      : 0;

  // Get current hour for reference line
  const currentHour = new Date().getHours();
  const currentHourLabel = `${currentHour.toString().padStart(2, "0")}:00`;

  return (
    <Card>
      <CardHeader className="border-0 min-h-auto pt-6 pb-6">
        <CardTitle className="text-base font-semibold flex items-center gap-2.5">
          <RiLineChartLine className="h-5 w-5 text-slate-700" />
          Evolução Térmica 24h
        </CardTitle>
        <CardToolbar>
          <div className="flex items-center gap-4 text-sm">
            <ChartLabel label="Hoje" color={chartConfig.today.color} />
            <ChartLabel
              label="Média Histórica"
              color={chartConfig.historical.color}
            />
          </div>
        </CardToolbar>
      </CardHeader>
      <CardContent className="px-2.5 flex flex-col items-end">
        <ChartContainer
          config={chartConfig}
          className="h-[350px] w-full [&_.recharts-curve.recharts-tooltip-cursor]:stroke-initial"
        >
          <ComposedChart
            data={chartData}
            margin={{
              top: 5,
              right: 15,
              left: 5,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="todayGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={chartConfig.today.color}
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor={chartConfig.today.color}
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="var(--input)"
              strokeOpacity={1}
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, className: "text-muted-foreground" }}
              dy={5}
              tickMargin={12}
              interval={2}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, className: "text-muted-foreground" }}
              tickFormatter={(value) => `${value}°C`}
              domain={["dataMin - 5", "dataMax + 5"]}
              tickMargin={12}
            />
            {/* Current hour reference line */}
            <ReferenceLine
              x={currentHourLabel}
              stroke={chartConfig.today.color}
              strokeWidth={1}
            />
            {/* Tooltip */}
            <ChartTooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "var(--input)",
                strokeWidth: 1,
                strokeDasharray: "none",
              }}
            />
            {/* Today area with gradient background */}
            <Area
              type="linear"
              dataKey="todayArea"
              stroke="transparent"
              fill="url(#todayGradient)"
              strokeWidth={0}
              dot={false}
            />
            {/* Today line with dots */}
            <Line
              type="linear"
              dataKey="today"
              stroke={chartConfig.today.color}
              strokeWidth={2}
              dot={{
                fill: "var(--background)",
                strokeWidth: 2,
                r: 6,
                stroke: chartConfig.today.color,
              }}
            />
            {/* Historical line (dashed) */}
            <Line
              type="linear"
              dataKey="historical"
              stroke={chartConfig.historical.color}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{
                fill: "var(--background)",
                strokeWidth: 2,
                r: 6,
                stroke: chartConfig.historical.color,
                strokeDasharray: "0",
              }}
            />
          </ComposedChart>
        </ChartContainer>
        <div className="mt-4 text-sm px-6">
          {avgDifference > 0 ? (
            <span className="text-red-600 font-semibold flex items-center gap-1.5">
              <RiArrowUpLine className="h-4 w-4" />
              +{avgDifference.toFixed(1)}°C acima da média histórica hoje
            </span>
          ) : (
            <span className="text-green-600 font-semibold flex items-center gap-1.5">
              <RiArrowDownLine className="h-4 w-4" />
              {Math.abs(avgDifference).toFixed(1)}°C abaixo da média histórica
              hoje
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
