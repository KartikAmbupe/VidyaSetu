import { connectDB } from "@/lib/mongodb";
import ActivityLog from "@/lib/models/ActivityLog";

export async function GET(req: Request) {
  await connectDB();

  const childId = new URL(req.url).searchParams.get("childId");

  const logs = await ActivityLog.find({ childId }).sort({ dateCompleted: -1 });

  // --- EXISTING STATS ---
  const totalTime = logs.reduce((a, b) => a + b.timeSpent, 0);
  const avgScore = logs.reduce((a, b) => a + (b.score || 0), 0) / logs.length || 0;

  // 🟢 NEW AGGREGATION: Count logs specific to 'Learning Module'
  const modulesCompleted = logs.filter(log => log.activityType === 'Learning Module').length;
  
  return Response.json({
    totalActivities: logs.length,
    totalMinutes: Math.floor(totalTime / 60),
    avgScore,
    logs,
    modulesCompleted, // 👈 ADDED to the response payload
  });
}