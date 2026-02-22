import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const meetings = await prisma.qualityMeeting.findMany({
      include: {
        createdBy: {
          select: { id: true, fullNameAr: true, fullNameEn: true },
        },
      },
      orderBy: { meetingDate: "desc" },
    });

    return NextResponse.json({ success: true, data: meetings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch quality meetings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const meeting = await prisma.qualityMeeting.create({
      data: {
        meetingType: body.meetingType,
        titleAr: body.titleAr,
        meetingDate: body.meetingDate ? new Date(body.meetingDate) : undefined,
        location: body.location,
        attendees: body.attendees,
        agenda: body.agenda,
        createdById: body.createdById,
      },
    });

    return NextResponse.json({ success: true, data: meeting }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create quality meeting" },
      { status: 500 }
    );
  }
}
