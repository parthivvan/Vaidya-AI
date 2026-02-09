const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const Medicine = require("./models/medicine.model");

// 1. Load Config
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cleanup = async () => {
  try {
    // --- PART 1: MONGODB ---
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    
    const deleteResult = await Medicine.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} products from Database.`);

    // --- PART 2: CLOUDINARY ---
    console.log("☁️  Cleaning up Cloudinary folder 'mediflow-products'...");

    // 1. Get all images in that folder
    const { resources } = await cloudinary.search
      .expression('folder:mediflow-products')
      .execute();

    if (resources.length > 0) {
      // 2. Extract IDs
      const publicIds = resources.map((file) => file.public_id);
      
      // 3. Delete them
      await cloudinary.api.delete_resources(publicIds);
      console.log(`✨ Deleted ${resources.length} images from Cloudinary.`);
    } else {
      console.log("✨ Cloudinary folder was already empty.");
    }

    console.log("🎉 SYSTEM CLEAN. Ready for new data.");
    process.exit();

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

cleanup();