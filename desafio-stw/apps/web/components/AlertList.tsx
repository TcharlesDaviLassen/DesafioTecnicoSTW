"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { playAlertSound } from "../../../apps/web/utils/playAlertSound";
import { IAlert, IMachineStatus } from "@repo/types/index";
import { useConnection } from "provider/ConnectionProvider";

interface Props {
  alerts: IAlert[];
  machineStatus: IMachineStatus;
}

export const AlertList = ({ alerts, machineStatus }: Props) => {
  const { isOnline } = useConnection();

  const [orderedAlerts, setOrderedAlerts] = useState<IAlert[]>([]);

  useEffect(() => {
    if (!alerts || !isOnline || alerts.length === 0) return;

    if (alerts.some((a) => a.level === "CRITICAL" || a.level === "WARNING")) {
      if (
        machineStatus.metrics.temperature >= 85 ||
        machineStatus.metrics.temperature <= 70 ||
        machineStatus.metrics.rpm >= 1500 ||
        machineStatus.metrics.rpm <= 1100
      ) {
        playAlertSound();
      }
    }

    // Atualiza lista ordenada quando os alerts mudam
    const sorted: IAlert[] = [...alerts].sort((a, b) => {
      const priority = { CRITICAL: 3, WARNING: 2, INFO: 1 };
      return (
        priority[b.level] - priority[a.level] ||
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    });
    setOrderedAlerts(sorted.slice(0, 10));
  }, [alerts]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Alertas Recentes</h3>
      <ul className="space-y-2">
        {orderedAlerts.map((alert) => (
          <motion.li
            key={alert.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex items-start gap-2 border-l-4 ${
              alert.level === "CRITICAL"
                ? "border-red-600"
                : alert.level === "WARNING"
                  ? "border-yellow-500"
                  : "border-blue-500"
            } p-2`}
          >
            <span className="w-3 h-3 mt-1 rounded-full" />
            <div>
              <p className="text-sm font-medium">{alert.message}</p>
              <p className="text-xs text-gray-400">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};
