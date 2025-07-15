"use client";

import { useEffect, useState } from "react";

import { IAlert } from "@repo/types/index";
import { AlertList } from "components/AlertList";
import CriticalAlertModal from "components/CriticalAlertModal";
import { MetricCard } from "components/MetricCard";
import { MetricChart } from "components/MetricChart";
import { OEEMetrics } from "components/OEEMetrics";
import { HeaderComponent } from "components/templates/HeaderComponent";
import { useMachineStatus } from "hooks/useMachineStatus";
import { useConnection } from "provider/ConnectionProvider";

interface MetricHistory {
  timestamp: Date;
  temperature: number;
  rpm: number;
  efficiency: number;
}

export interface MetricChartProps {
  data: MetricHistory[];
}

export default function Home() {
  const { isOnline } = useConnection();

  const [alerts, setAlerts] = useState<IAlert[]>([]);
  const [history, setHistory] = useState<MetricHistory[]>([]);

  // Hook de status da máquina
  const { data, isLoading } = useMachineStatus(isOnline ?? false);

  // Buscar alertas
  useEffect(() => {
    if (!isOnline) return;

    async function fetchAlerts() {
      const res = await fetch("/api/alerts");
      const data = await res.json();
      setAlerts(data);
    }
    fetchAlerts();

    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, [data]);

  // Histórico de métricas
  useEffect(() => {
    if (data?.metrics) {
      const entry: MetricHistory = {
        timestamp: new Date(),
        temperature: data.metrics.temperature,
        rpm: data.metrics.rpm,
        efficiency: data.metrics.efficiency,
      };
      setHistory((prev) => [...prev.slice(-20), entry]);
    }
  }, [data]);

  if (isLoading || !data) return <p className="p-4">Carregando...</p>;

  const { metrics, state, oee } = data;

  // Formatador de tempo hh:mm:ss
  const formatUptime = (totalSeconds: number) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <>
      <HeaderComponent />

      <main className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold dark:text-white">
            Dashboard Industrial
          </h1>
        </div>

        <CriticalAlertModal status={data} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Estado Máquina" value={state} status={isOnline ? "OK": "EM MANUTENÇÃO"} />
          <MetricCard
            title="Temperatura"
            value={`${metrics.temperature.toFixed(1)} °C`}
            // trend="up"
            max="85°C"
            isOnline={isOnline}
          />
          <MetricCard
            title="RPM"
            value={`${metrics.rpm.toFixed(0)}`}
            // trend="down"
            max="1500"
            isOnline={isOnline}
          />
          <MetricCard
            title="Tempo de Operação"
            value={formatUptime(metrics.uptime)}
          />
        </div>

        <MetricChart data={isOnline ? history : []} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <AlertList alerts={alerts} machineStatus={data} />
          <OEEMetrics
            overall={oee.overall}
            availability={oee.availability}
            performance={oee.performance}
            quality={oee.quality}
          />
        </div>
      </main>
    </>
  );
}
