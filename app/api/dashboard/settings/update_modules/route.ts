"use strict";

import { NextResponse } from 'next/server';
import { connectToDatabase } from "../../../../../lib/mongodb";
import type { NextRequest } from 'next/server';
import { modules as validModules } from "../../../../../app/dashboard/[guildId]/modules";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("Request body received:", body);

        const { guild_id: guildId, modules } = body;

        if (!guildId || typeof guildId !== 'string') {
            console.log("Invalid guildId:", { guildId, type: typeof guildId });
            return NextResponse.json(
                { error: 'Invalid guild_id provided' },
                { status: 400 }
            );
        }

        if (!modules || typeof modules !== 'object') {
            console.log("Invalid modules:", { modules, type: typeof modules });
            return NextResponse.json(
                { error: 'Invalid modules provided' },
                { status: 400 }
            );
        }

        const validModuleIds = validModules.map(module => module.id);
        const invalidModules = Object.keys(modules).filter(moduleId => !validModuleIds.includes(moduleId));

        if (invalidModules.length > 0) {
            return NextResponse.json(
                { error: 'Invalid module IDs provided', invalidModules },
                { status: 400 }
            );
        }

        const db = await connectToDatabase();
        console.log("Database connection:", { success: !!db });

        if (!db) {
            throw new Error('Failed to connect to database');
        }

        const collection = db.collection("config");

        const result = await collection.updateOne(
            { _id: guildId },
            { $set: { modules: modules } },
            { upsert: true }
        );

        if (!result.acknowledged) {
            throw new Error('Database operation failed');
        }

        return NextResponse.json({ 
            message: 'Modules updated successfully',
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
