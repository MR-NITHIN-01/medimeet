import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const context =
      "You are MediMeet's AI assistant helping doctors and patients during online consultations. Be concise, empathetic, and medically accurate.";

    const result = await model.generateContent(`${context}\n\nUser: ${prompt}`);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }
}
