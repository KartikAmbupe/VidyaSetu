import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ModuleCompletion from "@/lib/models/ModuleCompletion";

export async function GET(req: Request) {
  try {
    await connectDB();
    const childId = new URL(req.url).searchParams.get("childId");

    if (!childId) {
      return NextResponse.json(
        { error: "Missing childId" },
        { status: 400 }
      );
    }

    // Get all completed modules for this child
    const completions = await ModuleCompletion.find({ childId })
      .sort({ completedAt: -1 });

    // Transform to a map for easy lookup: { "subject|moduleName": true }
    const completionMap: Record<string, boolean> = {};
    completions.forEach(completion => {
      const key = `${completion.subject}|${completion.moduleName}`;
      completionMap[key] = true;
    });

    return NextResponse.json({ 
      success: true,
      completions,
      completionMap 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

