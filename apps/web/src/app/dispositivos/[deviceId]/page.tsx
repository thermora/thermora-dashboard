'use client';

import { useQuery } from 'convex/react';
import { api } from '@thermora-dashboard/backend/convex/_generated/api';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import DashboardTopbar from '@/components/dashboard-topbar';
import ThermalMap from '@/components/map/thermal-map';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function DeviceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const deviceId = params.deviceId as string;
  const device = useQuery(api.thermalData.getDeviceDetails, { deviceId });
  const mapRef = useRef<{ flyTo: (lat: number, lng: number) => void }>(null);

  useEffect(() => {
    if (device && device.lat && device.lng && mapRef.current) {
      mapRef.current.flyTo(device.lat, device.lng);
    }
  }, [device]);

  const formatLastReading = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) {
      return 'Agora';
    } else if (minutes < 60) {
      return `${minutes} min atrás`;
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else {
      const date = new Date(timestamp);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
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

  const getStatusBadge = (status: 'online' | 'late' | 'offline') => {
    const styles = {
      online: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      late: 'bg-amber-100 text-amber-700 border-amber-200',
      offline: 'bg-slate-100 text-slate-600 border-slate-200',
    };

    const labels = {
      online: 'Online',
      late: 'Atrasado',
      offline: 'Offline',
    };

    return (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
          styles[status]
        )}
      >
        {labels[status]}
      </span>
    );
  };

  if (device === undefined) {
    return (
      <div className='flex h-screen flex-col bg-white overflow-hidden'>
        <DashboardTopbar />
        <div className='flex-1 overflow-auto bg-slate-50 flex items-center justify-center'>
          <div className='text-center text-slate-600'>
            Carregando dispositivo...
          </div>
        </div>
      </div>
    );
  }

  if (device === null) {
    return (
      <div className='flex h-screen flex-col bg-white overflow-hidden'>
        <DashboardTopbar />
        <div className='flex-1 overflow-auto bg-slate-50 flex items-center justify-center'>
          <div className='text-center'>
            <h2 className='text-xl font-semibold text-slate-900 mb-2'>
              Dispositivo não encontrado
            </h2>
            <p className='text-slate-600 mb-4'>
              O dispositivo solicitado não foi encontrado.
            </p>
            <Button onClick={() => router.push('/dispositivos')}>
              Voltar para Dispositivos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-screen flex-col bg-white overflow-hidden'>
      <DashboardTopbar />
      <div className='flex-1 overflow-auto bg-slate-50'>
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <Button
            variant='ghost'
            onClick={() => router.push('/dispositivos')}
            className='mb-6'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Voltar para Dispositivos
          </Button>

          <div className='mb-6'>
            <h1 className='text-2xl font-semibold text-slate-900 mb-2'>
              Detalhes do Dispositivo
            </h1>
            <p className='text-sm text-slate-600'>
              Informações completas e localização em tempo real
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
            <Card className='p-6'>
              <div className='space-y-4'>
                <div>
                  <label className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
                    ID do Dispositivo
                  </label>
                  <p className='mt-1 font-mono text-sm text-slate-900'>
                    {device.deviceId}
                  </p>
                </div>
                <div>
                  <label className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
                    Linha/Rota
                  </label>
                  <p className='mt-1 text-slate-900'>{device.routeName}</p>
                </div>
                <div>
                  <label className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
                    Status
                  </label>
                  <div className='mt-1'>{getStatusBadge(device.status)}</div>
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='space-y-4'>
                <div>
                  <label className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
                    Temperatura Atual
                  </label>
                  <p className='mt-1 text-2xl font-semibold text-slate-900'>
                    {device.currentTemp.toFixed(1)}°C
                  </p>
                </div>
                <div>
                  <label className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
                    Última Leitura
                  </label>
                  <p className='mt-1 text-slate-900'>
                    {formatLastReading(device.lastReading)}
                  </p>
                </div>
                <div>
                  <label className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
                    Tempo em Rota
                  </label>
                  <p className='mt-1 text-slate-900'>
                    {formatTimeOnRoute(device.timeOnRoute)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='space-y-4'>
                <div>
                  <label className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
                    Localização
                  </label>
                  <p className='mt-1 text-sm text-slate-900'>
                    {device.lat.toFixed(6)}, {device.lng.toFixed(6)}
                  </p>
                </div>
                <div>
                  <label className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
                    Leituras Hoje
                  </label>
                  <p className='mt-1 text-slate-900'>
                    {device.readings.length} leituras
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className='p-0 overflow-hidden'>
            <div className='h-[600px] w-full'>
              <ThermalMap
                ref={mapRef}
                readings={device.readings}
                routes={
                  device.route
                    ? [
                        {
                          id: device.route.id,
                          name: device.route.name,
                          coordinates: device.route.coordinates,
                        },
                      ]
                    : []
                }
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

