import { connectDB } from "@/lib/mongodb";
import Settings from "@/lib/models/Settings";
import ActivityLog from "@/lib/models/ActivityLog";
import { startOfDay } from 'date-fns';

export async function GET(req: Request) {
  await connectDB();

  const childId = new URL(req.url).searchParams.get("childId");
  if (!childId) return Response.json({ success: false, message: "Missing childId" }, { status: 400 });

  const settings = await Settings.findOne({ childId });
  if (!settings) return Response.json({ status: "OK", minutesLeft: 30, limit: 30 }); // Default to 30 mins

  const now = Date.now();
  const today = startOfDay(new Date());

  // --- 1. Calculate Time Spent Today ---
  const dailyActivityLogs = await ActivityLog.aggregate([
    { $match: { 
        childId: settings.childId, 
        dateCompleted: { $gte: today } 
    }},
    { $group: {
        _id: null,
        totalSpent: { $sum: "$timeSpent" }
    }}
  ]);

  const totalSpentMinutes = Math.floor((dailyActivityLogs[0]?.totalSpent || 0) / 60);

  // --- 2. Calculate Minutes Left ---
  const dailyLimit = settings.dailyTimeLimit;
  const minutesLeft = Math.max(0, dailyLimit - totalSpentMinutes);

  // --- 3. Determine Status (LOCKED or OK) ---
  if (minutesLeft <= 0) {
    // LOCK status logic
    const cooldownEndTime = now + settings.cooldownPeriod * 60 * 1000;
    return Response.json({
      status: "LOCKED",
      minutesLeft: 0,
      limit: dailyLimit,
      until: cooldownEndTime,
    });
  }

  // OK status logic
  return Response.json({ 
    status: "OK", 
    minutesLeft,
    limit: dailyLimit 
  });
}