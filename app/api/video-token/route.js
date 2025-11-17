import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function GET() {
  try {
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_SECRET,
      {
        identity: "user-" + Math.random().toString(36).substring(7),
        ttl: "1h",
      }
    );
    at.addGrant({ roomJoin: true, room: "mediMeetRoom" });

    return NextResponse.json({ token: at.toJwt() });
  } catch (error) {
    console.error("Video token error:", error);
    return NextResponse.json({ error: "Failed to create token" }, { status: 500 });
  }
}
