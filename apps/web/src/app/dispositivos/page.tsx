'use client';

import { useQuery } from 'convex/react';
import { api } from '@thermora-dashboard/backend/convex/_generated/api';
import { useRouter } from 'next/navigation';
import DashboardTopbar from '@/components/dashboard-topbar';
import { Root, Header, Body, Head, Row, Cell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

export default function DispositivosPage() {
  const router = useRouter();
  const devices = useQuery(api.thermalData.getDevices);

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

  return (
    <div className='flex h-screen flex-col bg-white overflow-hidden'>
      <DashboardTopbar />
      <div className='flex-1 overflow-auto bg-slate-50'>
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='mb-6'>
            <h1 className='text-2xl font-semibold text-slate-900 mb-2'>
              Dispositivos
            </h1>
            <p className='text-sm text-slate-600'>
              Monitoramento de dispositivos de temperatura em tempo real
            </p>
          </div>

          <div className='bg-white rounded-xl border border-slate-200 shadow-sm'>
            {devices === undefined ? (
              <div className='text-center text-slate-600 py-12'>
                Carregando dispositivos...
              </div>
            ) : devices.length === 0 ? (
              <div className='text-center text-slate-600 py-12'>
                Nenhum dispositivo encontrado
              </div>
            ) : (
              <Root>
                <Header>
                  <Row>
                    <Head>ID do Dispositivo</Head>
                    <Head>Linha/Rota</Head>
                    <Head>Status</Head>
                    <Head>Temperatura Atual</Head>
                    <Head>Última Leitura</Head>
                    <Head>Tempo em Rota</Head>
                  </Row>
                </Header>
                <Body>
                  {devices.map((device) => (
                    <Row
                      key={device.deviceId}
                      onClick={() =>
                        router.push(`/dispositivos/${device.deviceId}`)
                      }
                      className='cursor-pointer hover:bg-slate-50 transition-colors'
                    >
                      <Cell className='font-mono text-sm text-slate-900'>
                        {device.deviceId}
                      </Cell>
                      <Cell className='text-slate-700'>{device.routeName}</Cell>
                      <Cell>{getStatusBadge(device.status)}</Cell>
                      <Cell className='font-medium text-slate-900'>
                        {device.currentTemp.toFixed(1)}°C
                      </Cell>
                      <Cell className='text-slate-600 text-sm'>
                        {formatLastReading(device.lastReading)}
                      </Cell>
                      <Cell className='text-slate-600 text-sm'>
                        {formatTimeOnRoute(device.timeOnRoute)}
                      </Cell>
                    </Row>
                  ))}
                </Body>
              </Root>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
