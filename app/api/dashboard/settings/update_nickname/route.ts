"use strict";

import { auth } from "../../../../../auth"
import { NextResponse } from 'next/server';
import { connectToDatabase } from "../../../../../lib/mongodb";
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const session = await auth()
    
    if (!session?.accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { guild_id: guildId, nickname } = body;

        const response = await fetch('http://localhost:8000/update_nickname', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`
            },
            body: JSON.stringify({ 
                guild_id: guildId, 
                nickname: nickname,
                oauth_token: session.accessToken
            }),
        });

        if (!response.ok) {
            throw new Error(`Bot API returned ${response.status}: ${await response.text()}`);
        }

        const result = await response.json();
        return NextResponse.json(result);

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
