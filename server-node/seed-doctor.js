const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Doctor = require("./models/doctor.model");

dotenv.config();

const doctors = [
  {
    name: "Dr. Rajesh Koothrappali",
    specialization: "Cardiologist",
    experience: 12,
    consultationFee: 800,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500",
    hospital: "Apollo Jubilee Hills",
    bio: "Expert in interventional cardiology with over a decade of experience."
  },
  {
    name: "Dr. Anjali Gupta",
    specialization: "Dermatologist",
    experience: 8,
    consultationFee: 600,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500",
    hospital: "Care Hospitals",
    bio: "Specialist in clinical and aesthetic dermatology."
  },
  {
    name: "Dr. Vikram Singh",
    specialization: "Neurologist",
    experience: 15,
    consultationFee: 1200,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500",
    hospital: "KIMS Secunderabad",
    bio: "Focused on treating complex neurological disorders."
  },
  {
    name: "Dr. Priya Sharma",
    specialization: "Pediatrician",
    experience: 5,
    consultationFee: 500,
    image: "https://images.unsplash.com/photo-1651008325506-7c77419c3ad4?w=500",
    hospital: "Rainbow Children's Hospital",
    bio: "Compassionate care for infants, children, and adolescents."
  },
  {
    name: "Dr. Arjun Reddy",
    specialization: "Orthopedic",
    experience: 7,
    consultationFee: 900,
    image: "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=500",
    hospital: "Yashoda Hospitals",
    bio: "Specializing in sports medicine and joint replacement."
  },
  {
    name: "Dr. Meera Iyer",
    specialization: "General Physician",
    experience: 20,
    consultationFee: 400,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500",
    hospital: "MediFlow Clinic",
    bio: "Comprehensive primary care for the whole family."
  }
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 1. Clear old data
    await Doctor.deleteMany({});
    console.log("🧹 Old doctors removed");

    // 2. Insert new doctors with FAKE User IDs
    // We map over the array to add a random ObjectId for each doctor
    const doctorsWithIds = doctors.map(doc => ({
        ...doc,
        userId: new mongoose.Types.ObjectId() // 👈 Generating a fake ID to satisfy the schema
    }));

    await Doctor.insertMany(doctorsWithIds);
    console.log("👨‍⚕️ Added 6 Doctors successfully!");

    process.exit();
  } catch (error) {
    console.log("❌ Error:", error);
    process.exit(1);
  }
};

seedDoctors();