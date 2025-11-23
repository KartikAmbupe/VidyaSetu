import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/lib/models/Settings";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { childId, dailyTimeLimit } = await req.json();

    if (!childId || !dailyTimeLimit) {
      return NextResponse.json(
        { error: "Missing childId or dailyTimeLimit" },
        { status: 400 }
      );
    }

    const updated = await Settings.findOneAndUpdate(
      { childId },
      { dailyTimeLimit },
      { new: true }
    );

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
