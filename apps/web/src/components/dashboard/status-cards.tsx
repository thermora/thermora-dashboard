"use client";

import { cn } from "@/lib/utils";
import {
  RiFireFill,
  RiTempHotFill,
  RiAlertFill,
  RiBusFill,
  RiArrowRightUpLine,
  RiArrowRightLine,
} from "react-icons/ri";

interface StatusCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  borderColor: string;
}

function StatusCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconBgColor,
  iconColor,
  borderColor,
}: StatusCardProps) {
  const formatChange = () => {
    if (change === undefined || change === 0) return "100%";
    const sign = change > 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}°C`;
  };

  const getChangeIcon = () => {
    if (change === undefined || change === 0)
      return <RiArrowRightLine className="h-3 w-3" />;
    return <RiArrowRightUpLine className="h-3 w-3" />;
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-white p-4",
        borderColor
      )}
    >
      {/* Left colored border accent */}
      <div className={cn("absolute left-0 top-0 h-full w-1", iconBgColor)} />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
          <div className="flex items-center gap-1.5 text-xs text-orange-600">
            {getChangeIcon()}
            <span className="font-medium">{formatChange()}</span>
            <span className="text-slate-500">{changeLabel || "vs yesterday"}</span>
          </div>
        </div>
        <div className={cn("rounded-2xl p-3", iconBgColor)}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </div>
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
        title="Max Temperature"
        value={`${maxTemp.toFixed(1)} °C`}
        change={maxTempChange}
        changeLabel="vs yesterday"
        icon={<RiFireFill className="h-6 w-6" />}
        iconBgColor="bg-red-50"
        iconColor="text-red-500"
        borderColor="border-slate-200/50"
      />
      <StatusCard
        title="City Average"
        value={`${avgTemp.toFixed(1)} °C`}
        change={avgTempChange}
        changeLabel="vs yesterday"
        icon={<RiTempHotFill className="h-6 w-6" />}
        iconBgColor="bg-amber-50"
        iconColor="text-amber-500"
        borderColor="border-slate-200/50"
      />
      <StatusCard
        title="Active Hotspots"
        value={activeHotspots}
        change={activeHotspotsChange}
        changeLabel="vs yesterday"
        icon={<RiAlertFill className="h-6 w-6" />}
        iconBgColor="bg-amber-50"
        iconColor="text-amber-500"
        borderColor="border-slate-200/50"
      />
      <StatusCard
        title="Monitored Routes"
        value={monitoredRoutes}
        change={monitoredRoutesChange}
        changeLabel="vs yesterday"
        icon={<RiBusFill className="h-6 w-6" />}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-500"
        borderColor="border-slate-200/50"
      />
    </div>
  );
}
