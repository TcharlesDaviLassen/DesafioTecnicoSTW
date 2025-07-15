"use client";

import { IAlert, IMachineStatus } from "@repo/types/index";
import { useConnection } from "provider/ConnectionProvider";
import { useEffect, useState } from "react";

interface Props {
  status: IMachineStatus;
}

export default function CriticalAlertModal({ status }: Props) {
  const { isOnline } = useConnection();

  const [alert, setAlert] = useState<IAlert | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isOnline) return;

    const { temperature, rpm } = status.metrics;

    let newAlert: IAlert | null = null;

    if (temperature >= 85 || rpm >= 1500) {
      newAlert = {
        id: crypto.randomUUID(),
        level: "CRITICAL",
        message:
          temperature >= 85
            ? `Temperatura crítica: ${temperature.toFixed(2)}°C`
            : `RPM crítico: ${rpm.toFixed(2)}`,
        component:
          temperature >= 85 ? "Sensor de Temperatura" : "Sensor de RPM",
        timestamp: new Date(new Date().toISOString()),
        acknowledged: false,
      };
    } else if (temperature <= 75 || rpm <= 1100) {
      newAlert = {
        id: crypto.randomUUID(),
        level: "WARNING",
        message:
          temperature <= 75
            ? `Temperatura baixa: ${temperature.toFixed(2)}°C`
            : `RPM baixo: ${rpm.toFixed(2)}`,
        component:
          temperature <= 75 ? "Sensor de Temperatura" : "Sensor de RPM",
        timestamp: new Date(new Date().toISOString()),
        acknowledged: false,
      };
    } else if (
      status.metrics.uptime >= 600 &&
      status.metrics.uptime % 600 < 5
    ) {
      newAlert = {
        id: crypto.randomUUID(),
        level: "INFO",
        message: `Manutenção recomendada após ${Math.floor(
          status.metrics.uptime / 60
        )} minutos de operação.`,
        component: "Misturador",
        timestamp: new Date(new Date().toISOString()),
        acknowledged: false,
      };
    }

    if (newAlert) {
      setAlert(newAlert);
      setShow(true);
    }
  }, [status]);

  const acknowledge = () => {
    if (alert) {
      setAlert({ ...alert, acknowledged: true });
    }
    setShow(false);
  };

  if (!show || !alert) return null;

  // Estilização dinâmica por nível
  const getStyle = (level: IAlert["level"]) => {
    switch (level) {
      case "CRITICAL":
        return {
          title: "⚠️ Alerta Crítico",
          color: "red",
          bg: "bg-red-600",
          hover: "hover:bg-red-700",
        };
      case "WARNING":
        return {
          title: "⚠️ Alerta de Atenção",
          color: "yellow",
          bg: "bg-yellow-500",
          hover: "hover:bg-yellow-600",
        };
      case "INFO":
        return {
          title: "ℹ️ Alerta de Informação",
          color: "blue",
          bg: "bg-blue-500",
          hover: "hover:bg-blue-600",
        };
    }
  };

  const style = getStyle(alert.level);

  return (
    <div className="fixed inset-0 bg-black critical bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className={`text-${style.color}-600 text-xl font-bold mb-2`}>
          {style.title}
        </h2>
        <p className="text-gray-800 dark:text-gray-200 mb-2">{alert.message}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Componente: {alert.component}
          <br />
          Horário: {new Date(alert.timestamp).toLocaleString()}
        </p>
        <button
          onClick={acknowledge}
          className={`${style.bg} ${style.hover} text-white px-4 py-2 rounded`}
        >
          Acknowledged
        </button>
      </div>
    </div>
  );
}
