import "dotenv/config";
import { PrismaClient } from "@prisma/client";

console.log("Testing Prisma 7 Client...");

try {
  const prisma = new PrismaClient({
    // @ts-ignore
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
  });
  console.log("Prisma Client instance created successfully.");
} catch (e) {
  console.error("Failed to create Prisma Client instance:", e);
}
