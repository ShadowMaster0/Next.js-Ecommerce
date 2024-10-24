import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Extending the global type definitions
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Ensure that 'prisma' can be set on 'globalThis'
if (!globalThis.prisma) {
  globalThis.prisma = prismaClientSingleton();
}

export default globalThis.prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prismaClientSingleton();
}
