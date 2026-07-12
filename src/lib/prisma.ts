import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

// Enable websocket support for Node environments
neonConfig.webSocketConstructor = ws;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma;
} else {
  console.log("ENV KEYS STARTING WITH DATA/NEON:", Object.keys(process.env).filter(k => k.startsWith("DATA") || k.startsWith("NEON")));
  const connectionString = (process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "")
    .replace(/^\uFEFF/, "")
    .replace(/channel_binding=require&?/g, "")
    .replace(/^[\\\"\']+|[\\\"\']+$/g, "")
    .trim();
  console.log("RESOLVED CONNECTION STRING FOR PRISMA:", JSON.stringify(connectionString));
  process.env.DATABASE_URL = connectionString;
  process.env.DATABASE_URL_UNPOOLED = connectionString;

  const adapter = new PrismaNeon({ connectionString });
  prisma = new PrismaClient({ adapter });
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
