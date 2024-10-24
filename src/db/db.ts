// src/db/db.ts
import { PrismaClient } from "@prisma/client";

// A singleton pattern to ensure we only have one instance of PrismaClient.
const prismaClientSingleton = (): PrismaClient => {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  return globalThis.prisma;
};

// Initialize and export the singleton instance
const db = prismaClientSingleton();

export default db;

// Extend the global object to avoid TypeScript errors
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}
