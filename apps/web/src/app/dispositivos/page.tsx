"use client";

import { useQuery } from "convex/react";
import { api } from "@thermora-dashboard/backend/convex/_generated/api";
import { useRouter } from "next/navigation";
import DashboardTopbar from "@/components/dashboard-topbar";
import { Root, Header, Body, Head, Row, Cell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Bus,
  CheckCircle2,
  Clock,
  WifiOff,
  Thermometer,
  Calendar,
  Timer,
} from "lucide-react";

export default function DispositivosPage() {
  const router = useRouter();
  const devices = useQuery(api.thermalData.getDevices);

  const formatLastReading = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) {
      return "Agora";
    } else if (minutes < 60) {
      return `${minutes} min atrás`;
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else {
      const date = new Date(timestamp);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const formatTimeOnRoute = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const getStatusBadge = (status: "online" | "late" | "offline") => {
    const config = {
      online: {
        containerStyle:
          "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/60",
        textStyle: "text-emerald-700",
        iconContainerStyle: "bg-emerald-500",
        icon: CheckCircle2,
        label: "Online",
      },
      late: {
        containerStyle:
          "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/60",
        textStyle: "text-amber-700",
        iconContainerStyle: "bg-amber-500",
        icon: Clock,
        label: "Atrasado",
      },
      offline: {
        containerStyle:
          "bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-200/60",
        textStyle: "text-slate-600",
        iconContainerStyle: "bg-slate-400",
        icon: WifiOff,
        label: "Offline",
      },
    };

    const {
      containerStyle,
      textStyle,
      iconContainerStyle,
      icon: Icon,
      label,
    } = config[status];

    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full text-xs font-semibold border shadow-sm",
          containerStyle
        )}
      >
        <span
          className={cn(
            "flex items-center justify-center h-5 w-5 rounded-full",
            iconContainerStyle
          )}
        >
          <Icon className="h-3 w-3 text-white" />
        </span>
        <span className={textStyle}>{label}</span>
      </span>
    );
  };

  const TemperatureGauge = ({ temperature }: { temperature: number }) => {
    // Temperature range: 30°C (cool) to 45°C (hot)
    const minTemp = 30;
    const maxTemp = 45;
    const percentage = Math.max(
      0,
      Math.min(100, ((temperature - minTemp) / (maxTemp - minTemp)) * 100)
    );

    // Color gradient based on temperature
    const getColor = () => {
      if (temperature < 32) return "bg-blue-500";
      if (temperature < 35) return "bg-green-500";
      if (temperature < 38) return "bg-yellow-500";
      if (temperature < 41) return "bg-orange-500";
      return "bg-red-500";
    };

    return (
      <div className="flex items-center gap-3">
        <Thermometer className="h-4 w-4 text-slate-400" />
        <div className="flex-1 min-w-[120px]">
          <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-300 via-yellow-300 to-red-400 opacity-30" />
            {/* Indicator */}
            <div
              className={cn(
                "absolute left-0 top-0 bottom-0 rounded-full transition-all duration-300",
                getColor()
              )}
              style={{ width: `${percentage}%` }}
            />
            {/* Pointer */}
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-white shadow-md transition-all duration-300",
                getColor()
              )}
              style={{ left: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 px-0.5">
            <span className="text-[10px] text-slate-400">{minTemp}°</span>
            <span className="text-xs font-semibold text-slate-700">
              {temperature.toFixed(1)}°C
            </span>
            <span className="text-[10px] text-slate-400">{maxTemp}°</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen flex-col bg-white overflow-hidden">
      <DashboardTopbar />
      <div className="flex-1 overflow-auto bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              Dispositivos
            </h1>
            <p className="text-sm text-slate-600">
              Monitoramento de dispositivos de temperatura em tempo real
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {devices === undefined ? (
              <div className="text-center text-slate-600 py-16">
                <div className="inline-flex items-center gap-3">
                  <div className="h-5 w-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                  <span>Carregando dispositivos...</span>
                </div>
              </div>
            ) : devices.length === 0 ? (
              <div className="text-center text-slate-600 py-16">
                <Bus className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium text-slate-700 mb-2">
                  Nenhum dispositivo encontrado
                </p>
                <p className="text-sm text-slate-500">
                  Aguardando conexão de dispositivos
                </p>
              </div>
            ) : (
              <Root>
                <Header>
                  <Row>
                    <Head className="w-[280px]">Dispositivo</Head>
                    <Head className="w-[140px]">Status</Head>
                    <Head className="w-[240px]">Temperatura</Head>
                    <Head className="w-[160px]">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        Última Leitura
                      </div>
                    </Head>
                    <Head className="w-[140px]">
                      <div className="flex items-center gap-2">
                        <Timer className="h-3.5 w-3.5 text-slate-400" />
                        Tempo em Rota
                      </div>
                    </Head>
                  </Row>
                </Header>
                <Body>
                  {devices.map((device) => {
                    const devicePath = `/dispositivos/${device.deviceId}`;
                    return (
                      <Row
                        key={device.deviceId}
                        onClick={() => router.push(devicePath as never)}
                        className="cursor-pointer hover:bg-slate-50/80 transition-colors group"
                      >
                        <Cell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="shrink-0 h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                              <Bus className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-mono text-sm font-medium text-slate-900 truncate">
                                {device.deviceId}
                              </span>
                              <span className="text-xs text-slate-500 truncate">
                                {device.routeName}
                              </span>
                            </div>
                          </div>
                        </Cell>
                        <Cell className="py-4">
                          {getStatusBadge(device.status)}
                        </Cell>
                        <Cell className="py-4">
                          <TemperatureGauge temperature={device.currentTemp} />
                        </Cell>
                        <Cell className="py-4">
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {formatLastReading(device.lastReading)}
                          </div>
                        </Cell>
                        <Cell className="py-4">
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Timer className="h-3.5 w-3.5 text-slate-400" />
                            {formatTimeOnRoute(device.timeOnRoute)}
                          </div>
                        </Cell>
                      </Row>
                    );
                  })}
                </Body>
              </Root>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
