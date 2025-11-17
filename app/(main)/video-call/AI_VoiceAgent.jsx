"use client";

import { useEffect, useState } from "react";
import { connect } from "livekit-client";
import { toast } from "sonner";

export default function AIVoiceAgent({ roomName }) {
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const joinAI = async () => {
      try {
        const res = await fetch(`/api/livekit/token?roomName=${roomName}&participant=AI_Assistant`);
        const { token } = await res.json();

        const room = await connect(process.env.NEXT_PUBLIC_LIVEKIT_URL, token, {
          audio: true,
          video: false,
        });

        setJoined(true);
        toast.success("AI Assistant joined the call 🎧");

        // Optional: react to AI events
        room.on("participantConnected", (participant) => {
          console.log("AI Connected:", participant.identity);
        });

        room.on("participantDisconnected", () => {
          setJoined(false);
        });

      } catch (err) {
        console.error("AI join error:", err);
        toast.error("Failed to connect AI Voice Agent");
      }
    };

    joinAI();

    return () => {
      // cleanup when leaving
    };
  }, [roomName]);

  return (
    <div className="text-center mt-4 text-sm text-gray-300">
      {joined ? "🤖 MediMeet AI is active in this call" : "Connecting AI..."}
    </div>
  );
}
