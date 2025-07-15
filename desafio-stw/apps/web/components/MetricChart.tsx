"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MetricHistory {
  timestamp: Date;
  temperature: number;
  rpm: number;
}

interface MetricChartProps {
  data: MetricHistory[];
}

export const MetricChart = ({ data }: MetricChartProps) => {
  const formattedData = data.map((item) => ({
    ...item,
    timestamp: new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  }));

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow w-full h-[300px]">
      <h3 className="text-lg font-semibold mb-2">
        Gráfico de Temperatura e RPM
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis
            yAxisId="left"
            label={{ value: "°C", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "RPM", angle: -90, position: "insideRight" }}
          />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperature"
            stroke="#f97316"
            name="Temperatura"
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="rpm"
            stroke="#3b82f6"
            name="RPM"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
