import { NextResponse } from "next/server";
<<<<<<< HEAD
import prisma from '@/app/libs/prismadb';
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { listingId, startDate, endDate, totalPrice } = body;

    if (!listingId || !startDate || !endDate || !totalPrice) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Optional: Add type checks
    if (typeof listingId !== 'string' || typeof startDate !== 'string' || typeof endDate !== 'string' || typeof totalPrice !== 'number') {
        return NextResponse.json({ error: "Invalid data types" }, { status: 400 });
    }

    try {
        const listingAndReservation = await prisma.listing.update({
            where: {
                id: listingId,
            },
            data: {
                reservations: {
                    create: {
                        userId: currentUser.id,
                        startDate,
                        endDate,
                        totalPrice,
                    },
                },
            },
        });

        return NextResponse.json(listingAndReservation);
    } catch (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}
=======

import prisma from '@/app/libs/prismadb';
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(
    request: Request
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();

    const {
        listingId,
        startDate,
        endDate,
        totalPrice
    } = body;

    if (!listingId || !startDate || !endDate || !totalPrice) {
        return NextResponse.error();
    }

    const listingAndReservation = await prisma.listing.update({
        where: {
            id: listingId
        },
        data: {
            reservations: {
                create: {
                    userId: currentUser.id,
                    startDate,
                    endDate,
                    totalPrice
                }
            }
        }
    });

    return NextResponse.json(listingAndReservation);
}
>>>>>>> 67d4b9a4583a8b49e08794565fa9f2213416637d
