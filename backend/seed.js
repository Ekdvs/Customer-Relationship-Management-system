

import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDB from "./config/db.js";
import Lead from "./models/leadModel.js";
import User from "./models/userModel.js";



configDotenv();

const seed = async () => {
  await connectDB();

  console.log("🌱 Seeding database...");

  // Clear existing data
  await User.deleteMany({});
  await Lead.deleteMany({});

  // Create Admin user (as per assessment requirements)
  const adminPassword = await bcrypt.hash("password123", 12);
  const admin = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: adminPassword,
    role: "Admin",
  });
  console.log("✅ Admin user created: admin@example.com / password123");

  // Create Sales users
  const salesPassword = await bcrypt.hash("password123", 12);
  const sales1 = await User.create({
    name: "Alice Johnson",
    email: "alice@example.com",
    password: salesPassword,
    role: "Sales",
  });
  const sales2 = await User.create({
    name: "Bob Smith",
    email: "bob@example.com",
    password: salesPassword,
    role: "Sales",
  });
  console.log("✅ Sales users created");

  console.log("  Admin:  admin@example.com / password123");
  console.log("  Sales:  alice@example.com / password123");
  console.log("  Sales:  bob@example.com   / password123");
  console.log("─────────────────────────────────────");

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});