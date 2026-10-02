import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding EcoRoute AI with strictly 3 sample complaints...");

  // Clean existing records
  await prisma.proofPhoto.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.complaint.deleteMany({});
  await prisma.worker.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.analytics.deleteMany({});
  await prisma.prediction.deleteMany({});

  const passwordHash = bcrypt.hashSync("password123", 10);

  // 1. Create Core Users for Authentication
  const citizen = await prisma.user.create({
    data: {
      name: "Aarav Mehta",
      email: "citizen@ecoroute.ai",
      passwordHash,
      role: "CITIZEN",
      phone: "+91 98201 11223",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Officer Dave",
      email: "admin@ecoroute.ai",
      passwordHash,
      role: "ADMIN",
      phone: "+91 98202 33445",
    },
  });

  const workerUser1 = await prisma.user.create({
    data: {
      name: "Carlos Rodriguez",
      email: "worker@ecoroute.ai",
      passwordHash,
      role: "WORKER",
      phone: "+91 98203 44556",
    },
  });

  const workerUser2 = await prisma.user.create({
    data: {
      name: "Sunil Shinde",
      email: "sunil.shinde@ecoroute.ai",
      passwordHash,
      role: "WORKER",
      phone: "+91 98204 55667",
    },
  });

  const workerUser3 = await prisma.user.create({
    data: {
      name: "Pooja Sawant",
      email: "pooja.sawant@ecoroute.ai",
      passwordHash,
      role: "WORKER",
      phone: "+91 98205 66778",
    },
  });

  // 2. Create Workers
  const worker1 = await prisma.worker.create({
    data: {
      userId: workerUser1.id,
      name: workerUser1.name,
      phone: workerUser1.phone || "+91 98203 44556",
      vehicleType: "E-Trike Rapid",
      status: "ON_DUTY",
      currentLat: 19.1363, // Andheri
      currentLng: 72.8277,
      maxCapacityKg: 250.0,
      activeMissionsCount: 1,
    },
  });

  const worker2 = await prisma.worker.create({
    data: {
      userId: workerUser2.id,
      name: workerUser2.name,
      phone: workerUser2.phone || "+91 98204 55667",
      vehicleType: "Electric Mini-Truck",
      status: "ACTIVE",
      currentLat: 19.0596, // Bandra
      currentLng: 72.8295,
      maxCapacityKg: 650.0,
      activeMissionsCount: 0,
    },
  });

  const worker3 = await prisma.worker.create({
    data: {
      userId: workerUser3.id,
      name: workerUser3.name,
      phone: workerUser3.phone || "+91 98205 66778",
      vehicleType: "Hydraulic Compactor",
      status: "ACTIVE",
      currentLat: 19.1176, // Powai
      currentLng: 72.9060,
      maxCapacityKg: 1200.0,
      activeMissionsCount: 0,
    },
  });

  // 3. Exactly 3 Sample Complaints as requested:
  // Complaint 1: Location: Andheri West, Waste Type: Plastic Waste, Status: Assigned
  // Complaint 2: Location: Bandra West, Waste Type: Organic Waste, Status: Pending
  // Complaint 3: Location: Powai, Waste Type: E-Waste, Status: Collected
  const complaint1 = await prisma.complaint.create({
    data: {
      ticketNo: "EC-20261002-101",
      title: "Commercial plastic packaging and bottle dump",
      description: "Discarded single-use plastics, beverage bottles, and shipping wrappers accumulated near market lane.",
      wasteType: "PLASTIC",
      quantity: "LARGE",
      estimatedWeightKg: 42.0,
      latitude: 19.1363,
      longitude: 72.8277,
      address: "Andheri West, Near Infinity Mall, Link Road, Mumbai",
      priorityLevel: "HIGH",
      priorityScore: 85,
      aiConfidence: 0.96,
      status: "ASSIGNED",
      assignedWorkerId: worker1.id,
      citizenId: citizen.id,
      citizenName: citizen.name,
      imageUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80",
    },
  });

  await prisma.assignment.create({
    data: {
      complaintId: complaint1.id,
      workerId: worker1.id,
      notes: "Assigned via EcoRoute AI Smart Proximity Dispatch",
    },
  });

  const complaint2 = await prisma.complaint.create({
    data: {
      ticketNo: "EC-20261002-102",
      title: "Organic market produce and culinary refuse",
      description: "Decomposing wet organic food matter overflowing near walkway; requires urgent clearance.",
      wasteType: "ORGANIC",
      quantity: "MEDIUM",
      estimatedWeightKg: 25.0,
      latitude: 19.0596,
      longitude: 72.8295,
      address: "Bandra West, Hill Road Commercial Arcade, Mumbai",
      priorityLevel: "MEDIUM",
      priorityScore: 55,
      aiConfidence: 0.95,
      status: "PENDING",
      citizenId: citizen.id,
      citizenName: citizen.name,
      imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    },
  });

  const complaint3 = await prisma.complaint.create({
    data: {
      ticketNo: "EC-20261002-103",
      title: "Hazardous electronic scrap and battery packs",
      description: "Discarded motherboards, power supplies, and lithium battery cells safely collected and sanitized.",
      wasteType: "E_WASTE",
      quantity: "SMALL",
      estimatedWeightKg: 16.0,
      latitude: 19.1176,
      longitude: 72.9060,
      address: "Powai, Near Hiranandani Tech Park, Mumbai",
      priorityLevel: "LOW",
      priorityScore: 25,
      aiConfidence: 0.98,
      status: "COLLECTED",
      assignedWorkerId: worker1.id,
      citizenId: citizen.id,
      citizenName: citizen.name,
      imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80",
    },
  });

  await prisma.assignment.create({
    data: {
      complaintId: complaint3.id,
      workerId: worker1.id,
      notes: "Cleared and verified on site",
      completedAt: new Date(Date.now() - 3600000),
    },
  });

  await prisma.proofPhoto.create({
    data: {
      complaintId: complaint3.id,
      workerId: worker1.id,
      photoUrl: "https://images.unsplash.com/photo-1582408921715-18e7806365c1?auto=format&fit=crop&w=600&q=80",
      notes: "Electronic waste packed into hazardous containment bins. Ground swept clean.",
      verifiedByAdmin: true,
      verifiedAt: new Date(),
    },
  });

  console.log("✅ Seed completed: Exactly 3 complaints created.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
