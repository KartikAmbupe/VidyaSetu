import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Settings from "@/lib/models/Settings";
import mongoose from "mongoose";

export async function GET() {
  await connectDB();

  // --- HARDCODED IDS ---
  // The Child ID is the one used in your ChildDashboard.
  const HARDCODED_CHILD_ID = "654c6014e760c41d117462fa"; 
  // A unique ID for the Parent.
  const HARDCODED_PARENT_ID = "654c6014e760c41d117462fb"; 
  // --- END IDS ---

  try {
    // 1. Create or Update the PARENT User (Role: parent, Children: Sam)
    console.log("Seeding Parent user...");
    const parent = await User.findByIdAndUpdate(
      HARDCODED_PARENT_ID,
      { 
        _id: new mongoose.Types.ObjectId(HARDCODED_PARENT_ID), 
        name: "Alex (Parent)",
        role: "parent",
        // Establish the link to the child
        $addToSet: { childrenIds: HARDCODED_CHILD_ID }
      },
      { upsert: true, new: true, runValidators: true }
    );

    // 2. Create or Update the CHILD User ("Sam") (Role: child, Parent: Alex)
    console.log("Seeding Child user (Sam)...");
    const child = await User.findByIdAndUpdate(
      HARDCODED_CHILD_ID,
      { 
        _id: new mongoose.Types.ObjectId(HARDCODED_CHILD_ID), 
        name: "Sam",
        role: "child",
        grade: "2nd Grade",
        // Establish the link back to the parent
        parentId: HARDCODED_PARENT_ID 
      },
      { upsert: true, new: true, runValidators: true }
    );

    // 3. Create or Update the SETTINGS for the child (This holds the limits, NOT the User model)
    console.log("Seeding Settings for Sam...");
    const settings = await Settings.findOneAndUpdate(
      { childId: HARDCODED_CHILD_ID },
      {
        childId: HARDCODED_CHILD_ID,
        dailyTimeLimit: 30, // The limit field
        cooldownPeriod: 10,
        lastTimeCheckDate: new Date(), 
        currentSessionStart: null 
      },
      { upsert: true, new: true, runValidators: true }
    );

    console.log("Database seeded successfully!");

    return Response.json({ 
      success: true, 
      message: "Database seeded successfully! Parent and Child accounts are linked.",
      parent,
      child, 
      settings 
    });

  } catch (error: any) {
    console.error("Seeding Error:", error);
    return Response.json({ error: error.message, details: error }, { status: 500 });
  }
}