"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Room, RoomEvent, createLocalTracks } from "livekit-client";
import Link from "next/link";

export default function AiDoctorPage() {
  const [status, setStatus] = useState("Disconnected");
  const [reply, setReply] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [inSession, setInSession] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const roomRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  async function startConsultation() {
    try {
      setStatus("Connecting to Dr. Medi...");
      const res = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identity: "patient_" + Math.floor(Math.random() * 10000),
          roomName: "medimeet-room",
        }),
      });

      const data = await res.json();
      if (!data.token || !data.url) throw new Error("Token fetch failed");

      const room = new Room();
      roomRef.current = room;

      await room.connect(data.url, data.token);
      setInSession(true);
      setStatus("🟢 Connected to Dr. Medi");

      // Publish local tracks
      const tracks = await createLocalTracks({ audio: true, video: true });
      for (const t of tracks) await room.localParticipant.publishTrack(t);

      // Attach your local video
      const localVideo = tracks.find((t) => t.kind === "video");
      if (localVideo && videoRef.current) {
        const vidEl = localVideo.attach();
        vidEl.autoplay = true;
        vidEl.muted = true;
        vidEl.className =
          "rounded-lg border-2 border-emerald-400 w-[320px] h-[240px] object-cover";
        videoRef.current.innerHTML = "";
        videoRef.current.appendChild(vidEl);
      }

      // Remote AI audio
      room.on(RoomEvent.TrackSubscribed, (track, pub, participant) => {
        if (track.kind === "audio" && audioRef.current) {
          const audioEl = track.attach();
          audioEl.autoplay = true;
          audioEl.muted = false;
          audioRef.current.innerHTML = "";
          audioRef.current.appendChild(audioEl);
        }
      });

      // AI text messages (subtitles + doctor suggestion)
      room.on(RoomEvent.DataReceived, (payload, participant) => {
        const text = new TextDecoder().decode(payload);
        console.log("AI:", text);
        setReply(text);
        setIsSpeaking(true);

        setTimeout(() => setIsSpeaking(false), 4000);

        // 🧠 Dynamic recommendation logic
        if (text.toLowerCase().includes("fever") || text.toLowerCase().includes("cold")) {
          setRecommendation({
            name: "Dr. Anita Rao",
            specialty: "General Physician",
            availability: "Today, 5 PM–9 PM",
            link: "/doctors/anita-rao",
          });
        } else if (text.toLowerCase().includes("skin") || text.toLowerCase().includes("rash")) {
          setRecommendation({
            name: "Dr. Vivek Menon",
            specialty: "Dermatologist",
            availability: "Tomorrow, 10 AM–4 PM",
            link: "/doctors/vivek-menon",
          });
        } else if (text.toLowerCase().includes("heart") || text.toLowerCase().includes("chest")) {
          setRecommendation({
            name: "Dr. Priya Nair",
            specialty: "Cardiologist",
            availability: "Today, 3 PM–8 PM",
            link: "/doctors/priya-nair",
          });
        } else if (text.toLowerCase().includes("diabetes") || text.toLowerCase().includes("sugar")) {
          setRecommendation({
            name: "Dr. Kiran Kumar",
            specialty: "Endocrinologist",
            availability: "Mon–Fri, 10 AM–6 PM",
            link: "/doctors/kiran-kumar",
          });
        } else {
          setRecommendation({
            name: "Dr. Medi AI",
            specialty: "Virtual Assistant",
            availability: "24/7 AI Consultation",
            link: "/ai-doctor",
          });
        }
      });

      room.on(RoomEvent.Disconnected, () => {
        setStatus("🔴 Disconnected");
        setInSession(false);
        setReply("");
        setRecommendation(null);
      });
    } catch (err) {
      console.error("Join error:", err);
      setStatus("❌ " + err.message);
    }
  }

  function endConsultation() {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
      setStatus("🔴 Consultation ended");
      setInSession(false);
      setReply("");
      setRecommendation(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center text-white p-6">
      <h1 className="text-4xl font-bold text-emerald-400 mb-2 tracking-wide">
        🩺 MediMeet — AI Doctor Consultation
      </h1>
      <p className="text-gray-400 mb-8">{status}</p>

      {/* Video + Audio */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
        <div
          ref={videoRef}
          className="w-[320px] h-[240px] bg-gray-800 rounded-lg flex items-center justify-center shadow-lg"
        >
          {!inSession && <span className="text-gray-500">Camera preview</span>}
        </div>
        <div ref={audioRef} className="hidden"></div>
      </div>

      {/* Buttons */}
      <div className="mt-8">
        {!inSession ? (
          <button
            onClick={startConsultation}
            className="bg-emerald-600 hover:bg-emerald-700 transition px-8 py-3 rounded-lg font-semibold text-lg shadow-md"
          >
            Start Consultation
          </button>
        ) : (
          <button
            onClick={endConsultation}
            className="bg-red-600 hover:bg-red-700 transition px-8 py-3 rounded-lg font-semibold text-lg shadow-md"
          >
            End Consultation
          </button>
        )}
      </div>

      {/* AI Subtitles */}
      {reply && (
        <motion.div
          key={reply}
          className="mt-8 text-center bg-gray-900/70 px-6 py-4 rounded-xl border border-emerald-500 max-w-lg shadow-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-emerald-300 text-lg font-medium">
            <span className={isSpeaking ? "animate-pulse" : ""}>💬 Dr. AI Medi:</span>{" "}
            {reply}
          </p>
        </motion.div>
      )}

      {/* Doctor Recommendation */}
      {recommendation && (
        <motion.div
          key={recommendation.name}
          className="mt-6 p-5 bg-gray-800 rounded-xl border border-amber-500 shadow-xl text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-amber-400 text-xl font-bold">🧑‍⚕️ Doctor Recommendation</h3>
          <p className="mt-2 text-gray-300">
            <strong>{recommendation.name}</strong> — {recommendation.specialty}
          </p>
          <p className="text-sm text-gray-400">{recommendation.availability}</p>
          <Link
            href={recommendation.link}
            className="inline-block mt-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg transition"
          >
            View Profile
          </Link>
        </motion.div>
      )}
    </div>
  );
}
