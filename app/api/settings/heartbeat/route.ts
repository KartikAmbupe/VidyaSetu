import { connectDB } from "@/lib/mongodb";
import Settings from "@/lib/models/Settings";

export async function POST(req: Request) {
    if (req.method !== 'POST') {
        return Response.json({ message: "Method Not Allowed" }, { status: 405 });
    }

    try {
        await connectDB();
        const { childId } = await req.json();

        if (!childId) {
            return Response.json({ message: "Child ID is required" }, { status: 400 });
        }

        // Find the current settings
        const settings = await Settings.findOne({ childId });

        if (!settings) {
            return Response.json({ message: "Settings not found for this child." }, { status: 404 });
        }

        // The only purpose of the Heartbeat is to ensure the currentSessionStart
        // field is set if, for some reason, it was cleared or missed the initial check.
        // The main time calculation logic happens in the `check-time` API.
        if (!settings.currentSessionStart) {
            settings.currentSessionStart = new Date();
            await settings.save();
            return Response.json({ message: "Session initiated by heartbeat." });
        }

        // If a session IS running, we just confirm success. 
        // The frontend ChildDashboard will continue to tick down the time.
        return Response.json({ message: "Heartbeat received. Session is active." });

    } catch (error) {
        console.error("Heartbeat error:", error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}