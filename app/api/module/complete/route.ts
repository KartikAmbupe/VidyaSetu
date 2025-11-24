import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ModuleCompletion from "@/lib/models/ModuleCompletion";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { childId, subject, moduleName } = await req.json();

    if (!childId || !subject || !moduleName) {
      return NextResponse.json(
        { error: "Missing childId, subject, or moduleName" },
        { status: 400 }
      );
    }

    // Check if already completed (upsert will handle this, but we check for better response)
    const existing = await ModuleCompletion.findOne({
      childId,
      subject,
      moduleName
    });

    if (existing) {
      return NextResponse.json({ 
        success: true, 
        message: "Module already completed",
        completion: existing 
      });
    }

    // Create new completion record
    const completion = await ModuleCompletion.create({
      childId,
      subject,
      moduleName,
      completedAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      completion 
    });
  } catch (err: any) {
    // Handle duplicate key error (if index didn't prevent it)
    if (err.code === 11000) {
      return NextResponse.json({ 
        success: true, 
        message: "Module already completed" 
      });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

