import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [transactions, budgetItems, totalIncome, totalExpense] =
      await Promise.all([
        prisma.financialTransaction.findMany({
          orderBy: { date: "desc" },
          take: 20,
          include: {
            approvedBy: { select: { nameAr: true, nameEn: true } },
          },
        }),
        prisma.budgetItem.findMany({
          where: { fiscalYear: 2024 },
          orderBy: { allocatedAmount: "desc" },
        }),
        prisma.financialTransaction.aggregate({
          where: { type: "INCOME", status: "COMPLETED" },
          _sum: { amount: true },
        }),
        prisma.financialTransaction.aggregate({
          where: { type: "EXPENSE", status: "COMPLETED" },
          _sum: { amount: true },
        }),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        budgetItems,
        totalIncome: totalIncome._sum.amount || 0,
        totalExpense: totalExpense._sum.amount || 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch financial data" },
      { status: 500 }
    );
  }
}
