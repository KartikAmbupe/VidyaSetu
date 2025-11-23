import { connectDB } from "@/lib/mongodb";
import Settings from "@/lib/models/Settings";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const { childId, dailyTimeLimit, cooldownPeriod } = body;

  const settings = await Settings.findOneAndUpdate(
    { childId },
    { dailyTimeLimit, cooldownPeriod },
    { upsert: true, new: true },
  );

  return Response.json({ success: true, settings });
}
