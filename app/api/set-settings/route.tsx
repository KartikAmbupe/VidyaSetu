import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; // Assumes you have this helper

export async function POST(request: Request) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const { childId, gameTimeLimitMinutes, cooldownMinutes } = await request.json();

        if (!childId || gameTimeLimitMinutes === undefined) {
            return NextResponse.json({ success: false, error: 'childId and time limit are required' }, { status: 400 });
        }

        const result = await db.collection('settings').updateOne(
            { childId: childId }, // Filter: Find the existing settings for this child
            { $set: { gameTimeLimitMinutes, cooldownMinutes } }, // Update: Set the new values
            { upsert: true } // Upsert: Create the document if it doesn't exist
        );

        return NextResponse.json({ success: true, modifiedCount: result.modifiedCount }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, error: 'Failed to set settings' }, { status: 500 });
    }
}