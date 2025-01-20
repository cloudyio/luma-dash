import { auth } from "./../../../auth";
import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  console.log('Access Token:', session?.accessToken);

  const url = new URL(request.url);
  const guildId = url.searchParams.get('guildId');
  console.log(guildId);

  if (!guildId) {
    return NextResponse.json({ message: "Bad Request: Missing guildId" }, { status: 400 });
  }

  try {
    const response = await axios.get(`http://localhost:8000/guild_info`, {
      params: { guild_id: guildId },
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    const guild_info = response.data;

    return NextResponse.json(guild_info);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Discord API error:', error.response.data);
    } else {
      console.error('Error fetching guild info:', error);
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
