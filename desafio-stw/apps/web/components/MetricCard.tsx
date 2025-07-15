"use client";

import { useEffect, useRef, useState } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  max?: string;
  status?: string;
  isOnline?: boolean;
}

export const MetricCard = ({
  title,
  value,
  max,
  status,
  isOnline = true,
}: MetricCardProps) => {
  const [trend, setTrend] = useState<"up" | "down" | null>(null);
  const prevNumericValue = useRef<number | null>(null);

  // Extrai o número inicial do value
  const extractNumber = (val: string): number | null => {
    const match = val.match(/[-+]?\d*\.?\d+/);
    return match ? parseFloat(match[0]) : null;
  };

  useEffect(() => {
    const current = extractNumber(value);
    if (current === null) return;

    if (prevNumericValue.current !== null) {
      if (current > prevNumericValue.current) {
        setTrend("up");
      } else if (current < prevNumericValue.current) {
        setTrend("down");
      }
    }

    prevNumericValue.current = current;
  }, [value]);

  const getLabel = (status: string) => {
    if (status === "RUNNING") return "LIGADO";
    if (status === "STOPPED") return "DESLIGADO";
    return status;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 w-full max-w-xs">
      <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</h4>
      <div className="text-3xl font-bold flex items-center gap-2">
        {getLabel(value)}
        {trend === "up" && isOnline && (
          <span className="text-green-500">▲</span>
        )}
        {trend === "down" && isOnline && (
          <span className="text-red-500">▼</span>
        )}
      </div>
      {max && <p className="text-xs text-gray-400 mt-1">Máx: {max}</p>}
      {status && <p className="text-xs text-gray-400 mt-1">Status: {status}</p>}
    </div>
  );
};
