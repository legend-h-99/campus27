import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";
import { guardRequest } from "@/lib/authorization";

export async function GET(request: NextRequest) {
  const check = await guardRequest(request, [PERMISSIONS.QUALITY_VIEW], "quality_documents", "GET");
  if (!check.ok) return check.response;

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
        owner: { select: { id: true, fullNameAr: true, fullNameEn: true } },
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

export async function POST(request: NextRequest) {
  const check = await guardRequest(request, [PERMISSIONS.QUALITY_DOCS_MANAGE], "quality_documents", "POST");
  if (!check.ok) return check.response;

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
