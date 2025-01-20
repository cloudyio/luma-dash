"use strict";

import { NextResponse } from 'next/server';
import { auth } from "../../../../../auth";
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await auth();
  
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const guildId = url.pathname.split('/').pop();

    const response = await fetch(`http://localhost:8000/get_channels_and_roles/${guildId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Bot API returned ${response.status}: ${await response.text()}`);
    }
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching channels and roles:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
