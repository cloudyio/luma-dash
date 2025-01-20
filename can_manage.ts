import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function can_manage(request: NextRequest) {
    console.log('Middleware triggered for:', request.url);

    const token = request.headers.get('Authorization');
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const guildId = body.guild_id;

    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };

    const response = await fetch(`https://discord.com/api/v9/users/@me/guilds`, { headers });

    if (response.status === 401) {
        return NextResponse.json({ message: 'Invalid Discord token' }, { status: 401 });
    } else if (response.status !== 200) {
        return NextResponse.json({ message: `Discord API error: ${await response.text()}` }, { status: response.status });
    }

    const user_guilds = await response.json();

    const isGuildManager = user_guilds.some((guild: any) => guild.id === guildId);
    console.log('isGuildManager:', isGuildManager);

    if (isGuildManager) {
        return NextResponse.next();
    }

    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
}

export const config = {
  matcher: '/api/dashboard/:path*',
};
