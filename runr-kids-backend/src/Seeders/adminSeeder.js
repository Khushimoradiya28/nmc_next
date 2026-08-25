const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("../Config/db");
const Role = require("../Model/role");
const User = require("../Model/user");

const seedAdmin = async () => {
  try {
    await connectDB();

    // 1. Create Admin role if it doesn't exist
    let adminRole = await Role.findOne({ role_name: "Admin" });

    if (!adminRole) {
      adminRole = await Role.create({
        role_name: "Admin",
        status: 1,
      });
      console.log("✅ Admin role created successfully");
    } else {
      console.log("ℹ️  Admin role already exists");
    }

    // 2. Create superadmin user if it doesn't exist
    let adminUser = await User.findOne({ email: "superadmin@gmail.com" });

    if (!adminUser) {
      adminUser = new User({
        first_name: "Super",
        last_name: "Admin",
        email: "superadmin@gmail.com",
        password: "Admin@123",
        mobile: undefined,
        role: adminRole._id,
        status: "1",
      });
      await adminUser.save({ validateModifiedOnly: true });
      console.log("✅ Superadmin user created successfully");
      console.log("   Email: superadmin@gmail.com");
      console.log("   Password: Admin@123");
    } else {
      console.log("ℹ️  Superadmin user already exists");
    }

    console.log("\n🎉 Seeding completed!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedAdmin();
