import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const data = await request.json();

    // Add a server-side timestamp
    const logEntry = {
      ...data,
      timestamp: new Date(),
    };

    await db.collection('progress_logs').insertOne(logEntry);
    return NextResponse.json({ success: true }, { status: 201 });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: 'Failed to log progress' }, { status: 500 });
  }
}