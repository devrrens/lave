import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

// Minimal interface for D1Database to avoid global type pollution
interface D1DatabaseLike {
  prepare(query: string): any;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: any[]): Promise<any[]>;
  exec(query: string): Promise<any>;
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createLocalClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export function getClient(env?: { DB?: D1DatabaseLike }): PrismaClient {
  if (env?.DB) {
    const adapter = new PrismaD1(env.DB as any);
    return new PrismaClient({ adapter });
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createLocalClient();
  }
  return globalForPrisma.prisma;
}

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient();
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
