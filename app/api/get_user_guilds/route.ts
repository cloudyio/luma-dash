import { auth } from "./../../../auth";
import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';

const url = 'http://localhost:8000/check_guilds';

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const response = await axios.post(url, {}, {
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    const guilds = response.data;

    return NextResponse.json(guilds);
  }
  catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }

}
