interface OEEMetricsProps {
  overall: number;
  availability: number;
  performance: number;
  quality: number;
}

export const OEEMetrics = ({
  overall,
  availability,
  performance,
  quality,
}: OEEMetricsProps) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow w-full">
    <h3 className="text-lg font-semibold mb-4">Métricas de Eficiência</h3>
    <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-800 dark:text-gray-200">
      <li>
        <strong>OEE:</strong> {overall.toFixed(1)}%
      </li>
      <li>
        <strong>Disponibilidade:</strong> {availability.toFixed(1)}%
      </li>
      <li>
        <strong>Performance:</strong> {performance.toFixed(1)}%
      </li>
      <li>
        <strong>Qualidade:</strong> {quality.toFixed(1)}%
      </li>
    </ul>
  </div>
);
