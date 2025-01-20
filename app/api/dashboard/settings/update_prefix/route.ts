"use strict";

import { NextResponse } from 'next/server';
import { connectToDatabase } from "../../../../../lib/mongodb";
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    console.log("API Route hit:", request.url);
    console.log("Request headers:", Object.fromEntries(request.headers.entries()));

    try {
        const body = await request.json();
        console.log("Request body received:", body);

        const { guild_id: guildId, prefix } = body;
        console.log("Parsed values:", { guildId, prefix });

        if (!guildId || typeof guildId !== 'string') {
            console.log("Invalid guildId:", { guildId, type: typeof guildId });
            return NextResponse.json(
                { error: 'Invalid guild_id provided' },
                { status: 400 }
            );
        }

        const trimmedPrefix = prefix?.trim();
        if (!trimmedPrefix) {
            return NextResponse.json(
                { error: 'Prefix cannot be empty' },
                { status: 400 }
            );
        }

        if (typeof trimmedPrefix !== 'string' || trimmedPrefix.length > 10) {
            return NextResponse.json(
                { error: 'Prefix must be 1-10 characters long' },
                { status: 400 }
            );
        }

        const db = await connectToDatabase();
        console.log("Database connection:", { success: !!db });

        if (!db) {
            throw new Error('Failed to connect to database');
        }

        const collection = db.collection("config");
        console.log("Attempting database update for:", { guildId, prefix: trimmedPrefix });

        const result = await collection.updateOne(
            { _id: guildId },
            { $set: { prefix: trimmedPrefix } },
            { upsert: true }
        );

        console.log("Database result:", result);

        if (!result.acknowledged) {
            throw new Error('Database operation failed');
        }

        return NextResponse.json({ 
            message: 'Prefix updated successfully',
            prefix: trimmedPrefix
        });

    } catch (error) {
        console.error("API Route error:", error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? `${error}` : undefined,
            timestamp: new Date().toISOString()
        }, { 
            status: 500
        });
    }
}
