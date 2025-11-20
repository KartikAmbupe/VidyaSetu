import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; // Assumes you have this helper

export async function GET(request: Request) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        const { searchParams } = new URL(request.url);
        const childId = searchParams.get('childId');

        if (!childId) {
            return NextResponse.json({ success: false, error: 'childId is required' }, { status: 400 });
        }

        // Find the settings document for the specified childId
        const settings = await db.collection('settings').findOne({ childId });

        // Provide default values if no settings are found
        const defaultSettings = {
            gameTimeLimitMinutes: 5,
            cooldownMinutes: 30,
        };

        return NextResponse.json({ 
            success: true, 
            data: settings || defaultSettings 
        }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
    }
}