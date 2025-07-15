export interface IMachineStatus {
  id: string;
  timestamp: Date;
  state: "RUNNING" | "STOPPED" | "MAINTENANCE" | "ERROR";
  metrics: {
    temperature: number;
    rpm: number;
    uptime: number;
    efficiency: number;
  };
  oee: {
    overall: number;
    availability: number;
    performance: number;
    quality: number;
  };
}

export interface IAlert {
  id: string;
  level: "INFO" | "WARNING" | "CRITICAL";
  message: string;
  component: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface IMetricHistory {
  timestamp: Date;
  temperature: number;
  rpm: number;
  efficiency: number;
}

export enum EMachineState {
  RUNNING = "RUNNING",
  STOPPED = "STOPPED",
  MAINTENANCE = "MAINTENANCE",
  ERROR = "ERROR",
}

export type IMachineState = {
  state: "RUNNING" | "STOPPED" | "MAINTENANCE" | "ERROR";
}
