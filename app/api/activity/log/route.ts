import { connectDB } from "@/lib/mongodb";
import ActivityLog from "@/lib/models/ActivityLog";
import Settings from "@/lib/models/Settings"; // Import Settings

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const { childId, timeSpent } = body; // Destructure timeSpent

  if (!childId || timeSpent === undefined) {
    return Response.json({ success: false, message: "Missing childId or timeSpent" }, { status: 400 });
  }

  // 1. Create the activity log
  const log = await ActivityLog.create(body);

  // 2. Mark the session as ended in Settings
  await Settings.findOneAndUpdate(
    { childId },
    { currentSessionStart: null }
  );

  return Response.json({ success: true, log });
}