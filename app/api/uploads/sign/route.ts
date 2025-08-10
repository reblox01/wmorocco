import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Server-side signing for Cloudinary uploads
// Expects JSON body with 'timestamp' and optional params to sign
export async function POST(request: Request) {
  try {
    const { timestamp } = await request.json();
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary env not configured' }, { status: 500 });
    }

    if (!timestamp) {
      return NextResponse.json({ error: 'Missing timestamp' }, { status: 400 });
    }

    // Construct signature string. Extend with allowed params if needed (folder, public_id, eager, etc.)
    const toSign = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(toSign).digest('hex');

    return NextResponse.json({ signature, apiKey, cloudName, timestamp });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
