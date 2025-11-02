"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RiLineChartLine } from "react-icons/ri";

interface ThermalEvolutionChartProps {
  today?: Array<{ hour: number; temperature: number }>;
  historical?: Array<{ hour: number; temperature: number }>;
}

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <RiLineChartLine className="h-5 w-5 text-slate-700" />
          <span>Evolução Térmica 24h</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" tick={{ fontSize: 12 }} interval={2} />
            <YAxis
              domain={[0, 40]}
              label={{
                value: "Temperatura (°C)",
                angle: -90,
                position: "insideLeft",
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="today"
              stroke="#f97316"
              strokeWidth={2}
              name="Hoje"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="historical"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Média Histórica"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm">
          {avgDifference > 0 ? (
            <span className="text-red-600 font-semibold">
              +{avgDifference.toFixed(1)}°C acima da média histórica hoje
            </span>
          ) : (
            <span className="text-green-600 font-semibold">
              {avgDifference.toFixed(1)}°C abaixo da média histórica hoje
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
