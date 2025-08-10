import { NextResponse } from 'next/server';
import stripe from '@/app/libs/stripe';
import prisma from '@/app/libs/prismadb';

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature') || '';
  const body = await request.text();

  let event;
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const { listingId, userId, startDate, endDate } = session.metadata || {};
    const sessionId = session.id as string;

    if (!listingId || !userId || !startDate || !endDate || !sessionId) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    // Idempotency: avoid duplicate reservation creation
    const existing = await prisma.reservation.findFirst({ where: { stripeSessionId: sessionId } });
    if (existing) {
      return new NextResponse(null, { status: 200 });
    }

    await prisma.reservation.create({
      data: {
        listingId,
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice: session.amount_total ? Math.round(session.amount_total / 100) : 0,
        paymentStatus: 'paid',
        stripeSessionId: sessionId,
        stripePaymentIntentId: session.payment_intent || null,
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
