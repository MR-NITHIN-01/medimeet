"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Bot, Volume2, Loader2 } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function AIConsultPage() {
  const [symptoms, setSymptoms] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // 🎤 Start Voice Input
  const handleVoiceInput = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  // 🛑 Stop Voice Input
  const stopVoiceInput = () => {
    SpeechRecognition.stopListening();
    setSymptoms(transcript);
  };

  // 🧠 Send to AI
  const handleCheck = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/symptom-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });

      const data = await res.json();
      setResponse(data.message);

      // 🎧 Speak the AI's response automatically
      speakText(data.message);
    } catch (error) {
      setResponse("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔊 Speak Output
  const speakText = (text) => {
    if (!text) return;
    setSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;

    utterance.onend = () => setSpeaking(false);

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      utterance.voice = voices.find(v => v.lang === "en-IN") || voices[0];
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <Card className="bg-muted/20 border-emerald-900/30 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <Bot className="text-emerald-400" /> MediMeet AI — Voice Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="Describe or speak your symptoms..."
              value={listening ? transcript : symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="flex-1"
            />
            <Button
              variant={listening ? "destructive" : "outline"}
              onClick={listening ? stopVoiceInput : handleVoiceInput}
              className={listening ? "bg-red-500 text-white" : ""}
            >
              <Mic className="h-5 w-5" />
            </Button>
          </div>

          <Button
            onClick={handleCheck}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 w-full"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Analyze Symptoms"}
          </Button>

          {response && (
            <div className="mt-6 p-4 rounded-lg bg-background border border-emerald-900/20">
              <p className="text-muted-foreground whitespace-pre-line">{response}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={speaking}
                  onClick={() => speakText(response)}
                >
                  <Volume2 className="h-4 w-4 mr-2" /> {speaking ? "Speaking..." : "Play Voice"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
