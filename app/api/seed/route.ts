import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Settings from "@/lib/models/Settings";
import mongoose from "mongoose";

export async function GET() {
  await connectDB();

  // This matches the ID in your ChildDashboard.tsx
  const HARDCODED_ID = "654c6014e760c41d117462fa"; 

  try {
    // 1. Create or Update the User
    // We use findOneAndUpdate with 'upsert: true' to create it if it doesn't exist
    const user = await User.findByIdAndUpdate(
      HARDCODED_ID,
      { 
        _id: new mongoose.Types.ObjectId(HARDCODED_ID), // Force this specific ID
        name: "Sam",
        role: "child",
        grade: "2nd Grade"
      },
      { upsert: true, new: true }
    );

    // 2. Create or Update the Settings for this child
    const settings = await Settings.findOneAndUpdate(
      { childId: HARDCODED_ID },
      {
        childId: HARDCODED_ID,
        dailyTimeLimit: 30, // 30 Minutes limit
        cooldownPeriod: 10,
        lastTimeCheckDate: new Date(), // Reset for today
        currentSessionStart: null // Ensure session is clear
      },
      { upsert: true, new: true }
    );

    return Response.json({ 
      success: true, 
      message: "Database seeded successfully! You can now use the dashboard.",
      user, 
      settings 
    });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}