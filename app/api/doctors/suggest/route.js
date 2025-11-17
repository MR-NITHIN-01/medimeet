import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/doctors/suggest?query=fever
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("query") || "").toLowerCase();

    if (!query)
      return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });

    // Basic mapping from symptom keyword → specialization
    const specializationMap = {
      fever: "General Physician",
      cold: "General Physician",
      cough: "General Physician",
      skin: "Dermatologist",
      rash: "Dermatologist",
      acne: "Dermatologist",
      heart: "Cardiologist",
      chest: "Cardiologist",
      diabetes: "Endocrinologist",
      sugar: "Endocrinologist",
      eye: "Ophthalmologist",
      vision: "Ophthalmologist",
      teeth: "Dentist",
      dental: "Dentist",
    };

    let matchedSpecialty = null;
    for (const [keyword, spec] of Object.entries(specializationMap)) {
      if (query.includes(keyword)) {
        matchedSpecialty = spec;
        break;
      }
    }

    let doctors = [];
    if (matchedSpecialty) {
      doctors = await prisma.doctor.findMany({
        where: {
          specialization: {
            contains: matchedSpecialty,
            mode: "insensitive",
          },
        },
        take: 3,
      });
    }

    return NextResponse.json({
      matchedSpecialty,
      doctors,
    });
  } catch (err) {
    console.error("Doctor suggestion error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
