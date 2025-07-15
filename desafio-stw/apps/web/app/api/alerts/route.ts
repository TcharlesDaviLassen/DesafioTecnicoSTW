import { prisma } from "@repo/db-prisma/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  // await prisma.alert.deleteMany({});
  const alerts = await prisma.alert.findMany({});

  return NextResponse.json(alerts);
}
