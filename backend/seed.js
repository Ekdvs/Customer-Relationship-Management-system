

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

  // Create sample leads
  const leads = [
    {
      leadName: "John Carter",
      companyName: "TechCorp Inc",
      email: "john@techcorp.com",
      phoneNumber: "+1-555-0101",
      leadSource: "LinkedIn",
      assignedTo: sales1._id,
      status: "Qualified",
      dealValue: 15000,
      tags: ["Hot"],
    },
    {
      leadName: "Sarah Williams",
      companyName: "StartupXYZ",
      email: "sarah@startupxyz.com",
      phoneNumber: "+1-555-0102",
      leadSource: "Website",
      assignedTo: sales2._id,
      status: "New",
      dealValue: 5000,
    },
    {
      leadName: "Mike Brown",
      companyName: "Enterprise Ltd",
      email: "mike@enterprise.com",
      phoneNumber: "+1-555-0103",
      leadSource: "Referral",
      assignedTo: sales1._id,
      status: "Won",
      dealValue: 50000,
      tags: ["Hot"],
    },
    {
      leadName: "Emma Davis",
      companyName: "SmallBiz Co",
      email: "emma@smallbiz.com",
      phoneNumber: "+1-555-0104",
      leadSource: "Cold Email",
      assignedTo: sales2._id,
      status: "Lost",
      dealValue: 3000,
    },
    {
      leadName: "James Wilson",
      companyName: "MidMarket Corp",
      email: "james@midmarket.com",
      phoneNumber: "+1-555-0105",
      leadSource: "Event",
      assignedTo: sales1._id,
      status: "Qualified",
      dealValue: 25000,
    },
  ];

  for (const leadData of leads) {
    await Lead.create(leadData);
  }
  console.log("✅ Sample leads created");

  console.log("\n🎉 Seed complete!");
  console.log("─────────────────────────────────────");
  console.log("Login credentials:");
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