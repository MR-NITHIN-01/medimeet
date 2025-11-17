"use client";

import { useEffect, useState, useRef } from "react";
import { Room, RoomEvent, createLocalTracks } from "livekit-client";

export default function LivekitRoomClient({ roomName = "medimeet-room", identity = "patient_" + Math.floor(Math.random() * 10000) }) {
  const [status, setStatus] = useState("idle");
  const [reply, setReply] = useState("");
  const roomRef = useRef(null);
  const videoContainer = useRef(null);
  const remoteAudioRef = useRef(null);

  const joinRoom = async () => {
    try {
      if (roomRef.current) {
        console.log("Already connected, skipping rejoin.");
        return;
      }

      setStatus("Requesting LiveKit token...");
      const res = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity, roomName }),
      });

      const data = await res.json();
      if (!data.token || !data.url) {
        setStatus("Failed to get token");
        return;
      }

      const room = new Room();
      roomRef.current = room;

      setStatus("Connecting to room...");
      await room.connect(data.url, data.token);

      setStatus("✅ Connected to room");
      console.log("Connected as:", identity);

      // Create local camera + mic tracks
      const tracks = await createLocalTracks({ audio: true, video: true });

      // Publish once
      for (const t of tracks) await room.localParticipant.publishTrack(t);

      // Attach local video
      const localVideo = tracks.find((t) => t.kind === "video");
      if (localVideo && videoContainer.current) {
        const vidEl = localVideo.attach();
        vidEl.autoplay = true;
        vidEl.muted = true; // mute local video to prevent echo
        vidEl.className = "rounded-lg border-2 border-green-500 w-72 h-56 object-cover";
        videoContainer.current.innerHTML = "";
        videoContainer.current.appendChild(vidEl);
      }

      // Handle remote participants (like AI agent)
      room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        console.log("Subscribed:", track.kind, "from", participant.identity);
        if (track.kind === "audio" && remoteAudioRef.current) {
          const audioEl = track.attach();
          audioEl.autoplay = true;
          remoteAudioRef.current.innerHTML = "";
          remoteAudioRef.current.appendChild(audioEl);
        }
      });

      // Handle AI data messages (text replies)
      room.on(RoomEvent.DataReceived, (payload, participant) => {
        const text = new TextDecoder().decode(payload);
        console.log("AI:", text);
        setReply(text);
      });

      room.on(RoomEvent.ParticipantDisconnected, (p) => {
        console.log("Participant left:", p.identity);
      });
    } catch (err) {
      console.error("Join error:", err);
      setStatus("❌ " + err.message);
    }
  };

  // disconnect on unmount
  useEffect(() => {
    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
        console.log("Disconnected from room");
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-white space-y-4">
      <h2 className="text-xl font-bold">Live Consultation Room</h2>
      <button
        onClick={joinRoom}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Join Room
      </button>
      <p>{status}</p>
      <div ref={videoContainer} className="flex gap-4"></div>
      <div ref={remoteAudioRef}></div>
      {reply && (
        <div className="mt-4 p-3 bg-gray-800 rounded-lg text-emerald-400">
          <strong>Dr. Medi:</strong> {reply}
        </div>
      )}
    </div>
  );
}
