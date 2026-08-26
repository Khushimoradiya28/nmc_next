const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load .env file
dotenv.config({ path: path.join(__dirname, "../.env") });

const OLD_DB_NAME = "runr-kids";
const NEW_DB_NAME = "nmc-portal";

const migrateAndCleanDB = async () => {
  try {
    console.log("==================================================");
    console.log(`🚀 Starting Database Rename/Migration to "${NEW_DB_NAME}"`);
    console.log("==================================================");

    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
    
    // Parse base connection string without DB name
    const uriMatch = mongoUri.match(/(mongodb(?:\+srv)?:\/\/[^\/\?]+)(?:\/([^\?]+))?(\?.*)?/);
    const baseUri = uriMatch ? uriMatch[1] : "mongodb://127.0.0.1:27017";
    const queryParams = uriMatch && uriMatch[3] ? uriMatch[3] : "";
    const currentDbName = (uriMatch && uriMatch[2]) || OLD_DB_NAME;

    console.log(`📡 Connecting to MongoDB...`);
    const client = await mongoose.connect(`${baseUri}/${currentDbName}${queryParams}`);
    const adminDb = mongoose.connection.getClient().db(currentDbName);
    const targetDb = mongoose.connection.getClient().db(NEW_DB_NAME);

    console.log(`✅ Connected. Source DB: [${currentDbName}] | Target DB: [${NEW_DB_NAME}]\n`);

    // 1. Fetch collections from current DB
    const collections = await adminDb.listCollections().toArray();
    console.log(`📋 Found ${collections.length} collections in source DB.`);

    const protectedCollections = ["users", "roles"];

    // 2. If source and target are different, copy users & roles to new DB
    for (const colName of protectedCollections) {
      const srcCol = adminDb.collection(colName);
      const destCol = targetDb.collection(colName);

      const docs = await srcCol.find({}).toArray();
      if (docs.length > 0) {
        // Clear destination collection first if exists
        await destCol.deleteMany({});
        await destCol.insertMany(docs);
        console.log(`✅ Copied "${colName}" collection (${docs.length} documents) to "${NEW_DB_NAME}".`);
      } else {
        console.log(`ℹ️  "${colName}" collection is empty or not found in source.`);
      }
    }

    // 3. Clean up non-users/roles collections in target DB (if any blank/unused ones exist)
    const targetCollections = await targetDb.listCollections().toArray();
    for (const col of targetCollections) {
      if (!protectedCollections.includes(col.name.toLowerCase()) && !col.name.startsWith("system.")) {
        await targetDb.dropCollection(col.name);
        console.log(`🗑️  Removed unused collection "${col.name}" from "${NEW_DB_NAME}".`);
      }
    }

    // 4. Optionally drop the old DB if it's different from the new DB
    if (currentDbName !== NEW_DB_NAME) {
      console.log(`\n🗑️  Dropping old database: "${currentDbName}"...`);
      await adminDb.dropDatabase();
      console.log(`✅ Old database "${currentDbName}" removed completely.`);
    }

    console.log("\n==================================================");
    console.log(`🎉 Database "${NEW_DB_NAME}" is now active with ONLY:`);
    console.log(`   - users`);
    console.log(`   - roles`);
    console.log("==================================================");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error during DB migration/cleanup:", error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

migrateAndCleanDB();
