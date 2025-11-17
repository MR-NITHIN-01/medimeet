import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { symptoms } = await req.json();

    if (!symptoms) {
      return NextResponse.json({ message: "Please provide symptoms." }, { status: 400 });
    }

    const prompt = `
You are a medical assistant named MediMeet AI.
Analyze the following symptoms and provide:
1. A brief possible cause.
2. Recommended doctor specialty (like Neurology, Dermatology, Pediatrics, Cardiology, General Medicine).
Symptoms: ${symptoms}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const message = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("AI error:", error);
    return NextResponse.json(
      { message: "Error processing your request." },
      { status: 500 }
    );
  }
}
