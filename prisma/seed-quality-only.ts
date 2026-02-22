// Quick script to run ONLY the advanced quality seed on existing data
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { seedQualityAdvanced } from "./seed/15-quality-advanced";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter }) as unknown as PrismaClient;

async function main() {
  console.log("▶ Running advanced quality seed only...\n");
  await seedQualityAdvanced(prisma);
  console.log("\n✅ Done!");
}

main()
  .catch((e) => {
    console.error("❌ Failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
