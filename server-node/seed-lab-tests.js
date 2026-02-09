const mongoose = require("mongoose");
const dotenv = require("dotenv");
const LabTest = require("./models/labTest.model");

dotenv.config();

const tests = [
  {
    name: "Complete Blood Count (CBC)",
    category: "Blood Test",
    price: 499,
    description: "Evaluates overall health and detects a wide range of disorders, including anemia, infection and leukemia.",
    turnaroundTime: "12 Hours",
    fastingRequired: false,
    imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=500"
  },
  {
    name: "Thyroid Profile (Total)",
    category: "Blood Test",
    price: 899,
    description: "T3, T4, and TSH tests to check thyroid gland function.",
    turnaroundTime: "24 Hours",
    fastingRequired: true,
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500"
  },
  {
    name: "Full Body Checkup (Advanced)",
    category: "Health Checkup",
    price: 2499,
    description: "Includes 75+ parameters: Liver, Kidney, Heart, Thyroid, Iron, and more.",
    turnaroundTime: "48 Hours",
    fastingRequired: true,
    imageUrl: "https://images.unsplash.com/photo-1516574187841-693083f05b1e?w=500"
  },
  {
    name: "MRI Scan - Brain",
    category: "Imaging",
    price: 6500,
    description: "Detailed imaging of the brain to detect tumors, injuries, or abnormalities.",
    turnaroundTime: "24 Hours",
    fastingRequired: false,
    imageUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=500"
  },
  {
    name: "Diabetes Screen (HbA1c)",
    category: "Blood Test",
    price: 600,
    description: "Measures average blood sugar for the past 2 to 3 months.",
    turnaroundTime: "6 Hours",
    fastingRequired: false,
    imageUrl: "https://images.unsplash.com/photo-1579684385180-1ea16c80e210?w=500"
  },
  {
    name: "Covid-19 RT-PCR",
    category: "Covid-19",
    price: 1200,
    description: "Gold standard test for detecting active coronavirus infection.",
    turnaroundTime: "12-24 Hours",
    fastingRequired: false,
    imageUrl: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=500"
  }
];

const seedLab = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    await LabTest.deleteMany({});
    await LabTest.insertMany(tests);
    console.log("🧪 Added 6 Lab Tests successfully!");
    process.exit();
  } catch (error) {
    console.log("❌ Error:", error);
    process.exit(1);
  }
};

seedLab();