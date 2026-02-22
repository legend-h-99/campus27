import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const docType = searchParams.get("docType");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (docType) where.docType = docType;
    if (status) where.status = status;

    const documents = await prisma.qualityDocument.findMany({
      where,
      include: {
        owner: {
          select: { id: true, fullNameAr: true, fullNameEn: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: documents });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch quality documents" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const document = await prisma.qualityDocument.create({
      data: {
        docType: body.docType,
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        docCode: body.docCode,
        version: body.version,
        descriptionAr: body.descriptionAr,
        effectiveDate: body.effectiveDate ? new Date(body.effectiveDate) : undefined,
        reviewDate: body.reviewDate ? new Date(body.reviewDate) : undefined,
        ownerId: body.ownerId,
      },
    });

    return NextResponse.json({ success: true, data: document }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create quality document" },
      { status: 500 }
    );
  }
}
