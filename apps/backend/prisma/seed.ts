import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create test user
  const hashedPassword = await bcrypt.hash("Test123!", 10);

  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      username: "testuser",
      displayName: "Test User",
      password: hashedPassword,
      isEmailVerified: true,
    },
  });

  console.log("Created test user:", testUser.email);

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin123!", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@quizapp.com" },
    update: {},
    create: {
      email: "admin@quizapp.com",
      username: "admin",
      displayName: "Admin User",
      password: adminPassword,
      isEmailVerified: true,
    },
  });

  console.log("Created admin user:", adminUser.email);

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
