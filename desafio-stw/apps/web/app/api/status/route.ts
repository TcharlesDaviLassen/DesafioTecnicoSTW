import { prisma } from "@repo/db-prisma/prisma";
import { EMachineState, IAlert, IMachineStatus } from "@repo/types/index";
import { NextRequest, NextResponse } from "next/server";

// Variáveis globais simples para uptime e alerta de manutenção
const globalForUptime = globalThis as any;

if (!globalForUptime.machineStartTime) {
  globalForUptime.machineStartTime = new Date();
  globalForUptime.isRunning = false;
  globalForUptime.lastMaintenanceAlert = null;
}

const MACHINE_ID = "machine-001";

export async function GET(req: NextRequest) {
  const now = new Date();
  const { searchParams } = new URL(req.url);
  const isOnlineParam = searchParams.get("isOnline") === "true";

  const globalForUptime = globalThis as any;

  if (!globalForUptime.machineStartTime) {
    globalForUptime.machineStartTime = new Date();
    globalForUptime.isRunning = false;
    globalForUptime.lastMaintenanceAlert = 0;
  }

  // Uptime
  if (isOnlineParam && !globalForUptime.isRunning) {
    globalForUptime.machineStartTime = new Date();
    globalForUptime.isRunning = true;
  } else if (!isOnlineParam) {
    globalForUptime.isRunning = false;
  }

  const uptimeSeconds = isOnlineParam
    ? Math.floor(
        (now.getTime() - globalForUptime.machineStartTime.getTime()) / 1000
      )
    : 0;

  // Simula os dados
  const temperature = isOnlineParam ? 80 + Math.random() * 6 : 0;
  const rpm = isOnlineParam ? 1100 + Math.random() * 500 : 0;
  const efficiency = isOnlineParam ? 92 : 0;

  const oeeData = {
    overall: isOnlineParam ? 80 + Math.random() * 10 : 0,
    availability: isOnlineParam ? 80 + Math.random() * 12 : 0,
    performance: isOnlineParam ? 80 + Math.random() * 8 : 0,
    quality: isOnlineParam ? 80 + Math.random() * 10 : 0,
  };

  // await prisma.machineStatus.deleteMany({});
  // await prisma.overallOEE.deleteMany({});

  // Atualizar métricas da máquina (por ID fixo)
  // const metrics = await prisma.machineMetrics.upsert({
  //   where: { id: MACHINE_ID },
  //   update: {
  //     temperature,
  //     rpm,
  //     uptime: uptimeSeconds,
  //     efficiency,
  //   },
  //   create: {
  //     id: MACHINE_ID,
  //     temperature,
  //     rpm,
  //     uptime: uptimeSeconds,
  //     efficiency,
  //   },
  // });

  const metrics = await prisma.machineMetrics.create({
    data: {
      temperature,
      rpm,
      uptime: uptimeSeconds,
      efficiency,
    },
  });

  // Atualizar OEE da máquina (por ID fixo)
  // const oee = await prisma.overallOEE.upsert({
  //   where: { id: MACHINE_ID },
  //   update: oeeData,
  //   create: {
  //     id: MACHINE_ID,
  //     ...oeeData,
  //   },
  // });

  const oee = await prisma.overallOEE.create({
    data: {
      ...oeeData,
    },
  });

  let stateMachine = EMachineState.STOPPED;

  if (isOnlineParam) {
    stateMachine = isOnlineParam
      ? EMachineState.RUNNING
      : EMachineState.STOPPED;
    if (
      !stateMachine.includes(EMachineState.RUNNING) ||
      stateMachine.includes(EMachineState.STOPPED)
    ) {
      stateMachine = EMachineState.ERROR;
    }
  }

  // Atualizar status principal da máquina
  // const simulatedData: IMachineStatus = await prisma.machineStatus.upsert({
  //   where: { id: MACHINE_ID },
  //   update: {
  //     timestamp: now,
  //     state: stateMachine,
  //     metricsId: metrics.id,
  //     oeeId: oee.id,
  //   },
  //   create: {
  //     id: MACHINE_ID,
  //     timestamp: now,
  //     state: stateMachine,
  //     metricsId: metrics.id,
  //     oeeId: oee.id,
  //   },
  //   include: {
  //     metrics: true,
  //     oee: true,
  //   },
  // });

  const simulatedData: IMachineStatus = await prisma.machineStatus.create({
    data: {
      timestamp: now,
      state: stateMachine,
      metricsId: metrics.id,
      oeeId: oee.id,
    },
    include: {
      metrics: true,
      oee: true,
    },
  });

  // --- ALERTAS ---
  const alertsToCreate: Omit<IAlert, "id">[] = [];

  if (temperature >= 85) {
    alertsToCreate.push({
      level: "CRITICAL",
      message: `Temp. Alta ${temperature.toFixed(1)}°C`,
      component: "Misturador",
      timestamp: now,
      acknowledged: false,
    });
  }

  if (rpm >= 1500) {
    alertsToCreate.push({
      level: "CRITICAL",
      message: `RPM Elevado: ${rpm.toFixed(0)}`,
      component: "Misturador",
      timestamp: now,
      acknowledged: false,
    });
  }

  if (temperature <= 75) {
    alertsToCreate.push({
      level: "WARNING",
      message: `Temp. Baixa ${temperature.toFixed(1)}°C`,
      component: "Misturador",
      timestamp: now,
      acknowledged: false,
    });
  }

  if (rpm <= 1100) {
    alertsToCreate.push({
      level: "WARNING",
      message: `RPM Baixo ${rpm.toFixed(0)}`,
      component: "Misturador",
      timestamp: now,
      acknowledged: false,
    });
  }

  const uptimeMinutes = Math.floor(uptimeSeconds / 60);
  const last = globalForUptime.lastMaintenanceAlert ?? 0;

  if (uptimeMinutes >= 1 && uptimeMinutes - last >= 1) {
    alertsToCreate.push({
      level: "INFO",
      message: `Manutenção Próxima`,
      component: "Misturador",
      timestamp: now,
      acknowledged: false,
    });

    globalForUptime.lastMaintenanceAlert = uptimeMinutes;
  }

  // Persistir alertas sem repetir (Ex: último mesmo texto em < 1 min)
  for (const alert of alertsToCreate) {
    const exists = await prisma.alert.findFirst({
      where: {
        message: alert.message,
        level: alert.level,
        component: alert.component,
        timestamp: {
          gte: new Date(now.getTime() - 1 * 60 * 1000),
        },
      },
    });

    if (!exists) {
      await prisma.alert.create({ data: alert });
    }
  }

  return NextResponse.json(simulatedData);
}
