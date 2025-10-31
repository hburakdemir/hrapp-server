import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env" , path:".env.development" });

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
