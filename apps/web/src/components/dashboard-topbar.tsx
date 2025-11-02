"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Filter, Plus, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    { href: "/dashboard/alertas", label: "Alertas" },
    { href: "/dashboard/dispositivos", label: "Dispositivos" },
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Left: Logo and Profile */}
          <div className="flex items-start gap-4 shrink-0">
            {/* Logo - Purple 'S' shape */}
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 text-white text-2xl font-bold shadow-sm">
              S
            </div>

            {/* Profile Section */}
            <div className="flex flex-col gap-1 pt-1">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-gray-400"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 leading-tight">
                    Vinicius Rocha
                  </span>
                  <span className="text-xs text-gray-600 leading-tight">
                    Bem vindo de volta ao Thermora 👋
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Navigation Tabs */}
          <div className="flex items-center gap-1 flex-1 justify-center">
            {tabs.map((tab) => {
              const isActive =
                pathname === tab.href ||
                (tab.href === "/dashboard" && pathname === "/dashboard");
              return (
                <Link key={tab.href} href={tab.href as any}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 h-auto font-medium"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 h-auto font-medium"
                    }
                  >
                    {tab.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right: Filters and Export */}
          <div className="flex items-center gap-3 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 h-9 px-3"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Últimos 7 dias</span>
                  <ChevronDown className="h-3 w-3" />
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
              className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 h-9 px-3"
            >
              <Filter className="h-4 w-4" />
              <span>Filtrar por</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white gap-2 h-9 px-4 shadow-sm"
              onClick={onExportClick}
            >
              <Plus className="h-4 w-4" />
              <span>Exportar Relatório</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
