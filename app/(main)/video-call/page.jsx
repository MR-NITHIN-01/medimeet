import VideoCall from "./video-call-ui";

export default async function VideoCallPage({ searchParams }) {
  // Extract room name & user name from query string
  const roomName = searchParams.room || "medimeet-room";
  const userName = searchParams.user || "Guest";

  // Fetch a LiveKit token from your backend
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/livekit/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: userName, room: roomName }),
    cache: "no-store",
  });

  const { token } = await res.json();

  // Pass the room and token to the client UI
  return <VideoCall roomName={roomName} token={token} />;
}
