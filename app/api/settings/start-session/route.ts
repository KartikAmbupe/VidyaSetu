import { connectDB } from "@/lib/mongodb";
import Settings from "@/lib/models/Settings";
import { startOfDay } from 'date-fns';

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const { childId } = body;

  if (!childId) {
    return Response.json({ success: false, message: "Missing childId" }, { status: 400 });
  }

  // 1. Check if the daily timer needs a reset (i.e., last check was before today)
  const settings = await Settings.findOne({ childId });
  const today = startOfDay(new Date());

  if (settings && settings.lastTimeCheckDate.getTime() < today.getTime()) {
    // Reset needed, but time spent is aggregated in check-time route.
    // For now, just update the check date and start the session.
    console.log(`Daily timer reset triggered for childId: ${childId}`);
  }

  // 2. Start the new session
  const sessionUpdate = await Settings.findOneAndUpdate(
    { childId },
    { 
      currentSessionStart: Date.now(), 
      lastTimeCheckDate: new Date() 
    },
    { upsert: true, new: true },
  );

  return Response.json({ success: true, settings: sessionUpdate });
}