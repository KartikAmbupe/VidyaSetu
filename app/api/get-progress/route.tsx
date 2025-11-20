import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');

    if (!childId) {
      return NextResponse.json({ success: false, error: 'childId is required' }, { status: 400 });
    }

    const progress = await db
      .collection('progress_logs')
      .find({ childId: childId })
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: progress }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: 'Failed to fetch progress' }, { status: 500 });
  }
}