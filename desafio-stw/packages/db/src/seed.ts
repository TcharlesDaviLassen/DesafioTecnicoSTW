import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const now = new Date();

async function seed() {
  const oee = await prisma.overallOEE.create({
    data: {
      overall: 92.3,
      availability: 98,
      performance: 95,
      quality: 94,
    },
  });

  const metrics = await prisma.machineMetrics.create({
    data: {
      temperature: 78.5,
      rpm: 1200,
      uptime: 3600,
      efficiency: 91,
    },
  });

  await prisma.machineStatus.create({
    data: {
      timestamp: new Date(),
      state: "RUNNING",
      metricsId: metrics.id,
      oeeId: oee.id,
    },
  });

  await prisma.alert.createMany({
    data: [
      {
        level: "CRITICAL",
        message: "Temp. Alta",
        component: "Misturador",
        timestamp: new Date(now.getTime() - 2 * 60000),
        acknowledged: false,
      },
      {
        level: "WARNING",
        message: "RPM Baixo",
        component: "Misturador",
        timestamp: new Date(now.getTime() - 5 * 60000),
        acknowledged: false,
      },
      {
        level: "INFO",
        message: "Manutenção Próxima",
        component: "Misturador",
        timestamp: new Date(now.getTime() - 10 * 60000),
        acknowledged: true,
      },
    ],
  });
}

seed().finally(() => prisma.$disconnect());
