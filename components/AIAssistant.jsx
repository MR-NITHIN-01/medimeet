"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Bot, Volume2 } from "lucide-react";

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendToAI = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const res = await fetch("/api/ai/medimeet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });

    const data = await res.json();
    const aiResponse = data.reply;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: input },
      { sender: "ai", text: aiResponse },
    ]);

    setInput("");
    setLoading(false);

    // Optional: Speak the AI’s response
    const speech = new SpeechSynthesisUtterance(aiResponse);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="bg-emerald-900/10 border border-emerald-900/30 rounded-xl p-4 text-white max-w-md mx-auto mt-6">
      <div className="flex items-center mb-3">
        <Bot className="text-emerald-400 mr-2" />
        <h2 className="font-semibold text-lg">MediMeet AI Assistant</h2>
      </div>

      <div className="h-48 overflow-y-auto mb-3 bg-black/20 rounded-lg p-2 space-y-2">
        {messages.length === 0 && (
          <p className="text-sm text-gray-400 italic">
            Ask me about symptoms, prescriptions, or next steps...
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-md ${
              m.sender === "ai" ? "bg-emerald-800/20" : "bg-emerald-950/20"
            }`}
          >
            <strong>{m.sender === "ai" ? "AI:" : "You:"}</strong> {m.text}
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          className="flex-1 px-3 py-2 rounded-md bg-black/40 text-white border border-emerald-900/30"
        />
        <Button
          onClick={sendToAI}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>
      </div>
    </div>
  );
}
