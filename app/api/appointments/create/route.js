import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { doctorId, patientId, date, time } = await req.json();

    if (!doctorId || !patientId || !date || !time)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const appointment = await prisma.appointment.create({
      data: {
        doctorId,
        patientId,
        date,
        time,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
