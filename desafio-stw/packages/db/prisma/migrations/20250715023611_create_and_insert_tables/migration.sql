-- CreateTable
CREATE TABLE "MachineStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL,
    "state" TEXT NOT NULL,
    "metricsId" TEXT NOT NULL,
    "oeeId" TEXT NOT NULL,
    CONSTRAINT "MachineStatus_metricsId_fkey" FOREIGN KEY ("metricsId") REFERENCES "MachineMetrics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MachineStatus_oeeId_fkey" FOREIGN KEY ("oeeId") REFERENCES "OverallOEE" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MachineMetrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "temperature" REAL NOT NULL,
    "rpm" INTEGER NOT NULL,
    "uptime" INTEGER NOT NULL,
    "efficiency" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "OverallOEE" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "overall" REAL NOT NULL,
    "availability" REAL NOT NULL,
    "performance" REAL NOT NULL,
    "quality" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "component" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "acknowledged" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MachineStatus_metricsId_key" ON "MachineStatus"("metricsId");

-- CreateIndex
CREATE UNIQUE INDEX "MachineStatus_oeeId_key" ON "MachineStatus"("oeeId");
