// force this route to run in a Node server function (not Edge)
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const context =
      "You are MediMeet's AI assistant helping doctors and patients during online consultations. Be concise, empathetic, and medically accurate.";

    // NOTE: API and SDK return shape can vary. This was your original pattern.
    const result = await model.generateContent(`${context}\n\nUser: ${prompt}`);

    // safer extraction with fallback
    let reply = "";
    if (result?.response?.text) {
      reply = result.response.text();
    } else if (result?.response?.content?.[0]?.text) {
      reply = result.response.content[0].text;
    } else {
      reply = JSON.stringify(result?.response ?? result);
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json({ error: "AI error", details: String(error) }, { status: 500 });
  }
}
