"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  RiCalendarLine,
  RiFilterLine,
  RiAddLine,
  RiArrowDownSLine,
  RiNotificationLine,
} from "react-icons/ri";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import IconThermora from "@/assets/icon.png";

interface DashboardTopbarProps {
  onTimeFilterChange?: (filter: "24h" | "7d" | "30d") => void;
  onExportClick?: () => void;
}

export default function DashboardTopbar({
  onTimeFilterChange,
  onExportClick,
}: DashboardTopbarProps) {
  const pathname = usePathname();

  const tabs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/alerts", label: "Alertas" },
    { href: "/devices", label: "Dispositivos" },
  ];

  return (
    <div className="bg-white">
      {/* Top Row - Logo and Navigation */}
      <div className="border-b border-slate-200">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src={IconThermora}
                alt="Thermora"
                width={56}
                height={56}
                quality={100}
              />
            </div>

            {/* Center: Navigation Tabs */}
            <div className="flex items-center gap-1">
              {tabs.map((tab) => {
                const isActive =
                  pathname === tab.href ||
                  (tab.href === "/dashboard" && pathname === "/dashboard");
                return (
                  <Link key={tab.href} href={tab.href as any}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-4 py-2 h-auto font-medium",
                        {
                          "bg-slate-100 text-slate-900": isActive,
                        }
                      )}
                    >
                      {tab.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Notification Bell */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="relative h-9 w-9 p-0 hover:bg-slate-50"
              >
                <RiNotificationLine className="h-5 w-5 text-slate-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Profile and Actions */}
      <div className="border-b border-slate-200">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Profile Section */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-slate-400"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-900 leading-tight">
                  Vinicius Rocha
                </span>
                <span className="text-xs text-slate-600 leading-tight">
                  Bem vindo de volta ao Thermora 👋
                </span>
              </div>
            </div>

            {/* Right: Filters and Export */}
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 h-9 px-3"
                  >
                    <RiCalendarLine className="h-4 w-4" />
                    <span>Últimos 7 dias</span>
                    <RiArrowDownSLine className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                  <DropdownMenuItem onClick={() => onTimeFilterChange?.("24h")}>
                    24 horas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onTimeFilterChange?.("7d")}>
                    7 dias
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onTimeFilterChange?.("30d")}>
                    30 dias
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 h-9 px-3"
              >
                <RiFilterLine className="size-5" />
                <span>Filtrar por</span>
              </Button>

              <Button
                variant="default"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-9 px-4 shadow-sm"
                onClick={onExportClick}
              >
                <RiAddLine className="h-4 w-4" />
                <span>Exportar Relatório</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
