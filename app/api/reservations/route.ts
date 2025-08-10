import { NextResponse } from 'next/server';

import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

// Direct reservations should be disabled; use Stripe Checkout + webhook
export async function POST() {
  return NextResponse.json(
    { error: 'Direct reservations are disabled. Please complete payment to create a reservation.' },
    { status: 403 }
  );
}
