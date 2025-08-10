import { NextResponse } from 'next/server';
import stripe from '@/app/libs/stripe';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { listingId, startDate, endDate } = body;
  if (!listingId || !startDate || !endDate) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  // Fetch listing to include title and image
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  // Compute total amount server-side
  const start = new Date(startDate);
  const end = new Date(endDate);
  const millis = end.getTime() - start.getTime();
  const nights = Math.ceil(millis / (1000 * 60 * 60 * 24));
  if (Number.isNaN(nights) || nights <= 0) {
    return NextResponse.json({ error: 'Invalid date range' }, { status: 400 });
  }
  const unitAmountCents = Math.max(0, listing.price * nights * 100);

  // Platform fee (for future Connect setup)
  const feePercent = parseInt(process.env.PLATFORM_FEE_PERCENT || '10', 10);
  const feeAmount = Math.round((unitAmountCents * feePercent) / 100);

  try {
    const session = await stripe.checkout.sessions.create({
      metadata: {
        listingId,
        userId: currentUser.id,
        startDate,
        endDate,
      },
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: unitAmountCents, // in cents
            product_data: {
              name: listing.title,
              images: [listing.imageSrc],
            },
          },
        },
      ],
      // Consider adding application_fee_amount and transfer_data for Stripe Connect
      success_url: `${process.env.NEXTAUTH_URL}/trips?success=1`,
      cancel_url: `${process.env.NEXTAUTH_URL}/listings/${listingId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
