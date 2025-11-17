// app/api/livekit/token/route.js
import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk"; // if not found try 'livekit-server-sdk' or '@livekit/node-sdk'

export async function POST(req) {
  try {
    const { identity, roomName } = await req.json();

    const { LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL } = process.env;
    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_URL) {
      throw new Error("Missing LIVEKIT_API_KEY / LIVEKIT_API_SECRET / LIVEKIT_URL in .env.local");
    }

    // Construct AccessToken with constructor signature used by many server sdks:
    // If your installed sdk expects (key, secret, opts) change accordingly.
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: identity || `user_${Math.floor(Math.random() * 10000)}`,
    });

    at.addGrant({
      roomJoin: true,
      room: roomName || "medimeet-room",
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    return NextResponse.json({
      token,
      url: LIVEKIT_URL,
    });
  } catch (err) {
    console.error("Token generation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
