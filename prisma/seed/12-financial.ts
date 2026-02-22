import type { PrismaClient } from "@prisma/client";
import { randomInt, randomDate, randomFrom } from "./helpers";

// =============================================================================
// Campus26 Financial Seed Data
// Budget items, transactions, procurement requests, warehouse items
// =============================================================================

// -----------------------------------------------------------------------------
// Budget Item Definitions
// -----------------------------------------------------------------------------

interface BudgetItemDef {
  nameAr: string;
  nameEn: string;
  category: string;
  allocatedAmount: number;
  spentAmount: number;
}

const BUDGET_ITEMS: BudgetItemDef[] = [
  { nameAr: "رواتب المدربين", nameEn: "Trainer Salaries", category: "salaries", allocatedAmount: 12_000_000, spentAmount: 9_000_000 },
  { nameAr: "معدات ومختبرات", nameEn: "Equipment & Labs", category: "equipment", allocatedAmount: 5_000_000, spentAmount: 3_500_000 },
  { nameAr: "تشغيل وصيانة", nameEn: "Operations & Maintenance", category: "operations", allocatedAmount: 3_000_000, spentAmount: 2_200_000 },
  { nameAr: "أنشطة طلابية", nameEn: "Student Activities", category: "activities", allocatedAmount: 2_000_000, spentAmount: 1_500_000 },
  { nameAr: "تطوير مهني", nameEn: "Professional Development", category: "development", allocatedAmount: 1_500_000, spentAmount: 800_000 },
  { nameAr: "بحث علمي", nameEn: "Scientific Research", category: "research", allocatedAmount: 1_500_000, spentAmount: 500_000 },
  { nameAr: "تقنية المعلومات", nameEn: "IT Infrastructure", category: "it", allocatedAmount: 2_500_000, spentAmount: 1_800_000 },
  { nameAr: "مكتبة ومصادر تعلم", nameEn: "Library & Learning Resources", category: "library", allocatedAmount: 800_000, spentAmount: 600_000 },
  { nameAr: "نظافة وأمن", nameEn: "Cleaning & Security", category: "services", allocatedAmount: 1_200_000, spentAmount: 900_000 },
  { nameAr: "سفر ومؤتمرات", nameEn: "Travel & Conferences", category: "travel", allocatedAmount: 600_000, spentAmount: 350_000 },
  { nameAr: "تأمين وتراخيص", nameEn: "Insurance & Licenses", category: "insurance", allocatedAmount: 400_000, spentAmount: 380_000 },
  { nameAr: "طوارئ واحتياطي", nameEn: "Emergency Reserve", category: "reserve", allocatedAmount: 1_000_000, spentAmount: 200_000 },
];

// -----------------------------------------------------------------------------
// Transaction Template Definitions
// -----------------------------------------------------------------------------

interface TransactionTemplate {
  type: "INCOME" | "EXPENSE";
  category: string;
  descriptionAr: string;
  descriptionEn: string;
  minAmount: number;
  maxAmount: number;
}

const INCOME_TEMPLATES: TransactionTemplate[] = [
  { type: "INCOME", category: "tuition", descriptionAr: "رسوم دراسية - الفصل الأول", descriptionEn: "Tuition fees - First semester", minAmount: 50_000, maxAmount: 500_000 },
  { type: "INCOME", category: "tuition", descriptionAr: "رسوم دراسية - الفصل الثاني", descriptionEn: "Tuition fees - Second semester", minAmount: 50_000, maxAmount: 500_000 },
  { type: "INCOME", category: "government_fund", descriptionAr: "دعم حكومي - المؤسسة العامة للتدريب", descriptionEn: "Government funding - TVTC support", minAmount: 200_000, maxAmount: 500_000 },
  { type: "INCOME", category: "government_fund", descriptionAr: "ميزانية تشغيلية حكومية", descriptionEn: "Government operational budget", minAmount: 100_000, maxAmount: 400_000 },
  { type: "INCOME", category: "partnership", descriptionAr: "عوائد شراكة - شركة أرامكو", descriptionEn: "Partnership revenue - Aramco", minAmount: 100_000, maxAmount: 300_000 },
  { type: "INCOME", category: "partnership", descriptionAr: "عوائد شراكة - شركة سابك", descriptionEn: "Partnership revenue - SABIC", minAmount: 80_000, maxAmount: 250_000 },
  { type: "INCOME", category: "tuition", descriptionAr: "رسوم تسجيل متأخر", descriptionEn: "Late registration fees", minAmount: 50_000, maxAmount: 150_000 },
  { type: "INCOME", category: "government_fund", descriptionAr: "منحة تطوير البنية التحتية", descriptionEn: "Infrastructure development grant", minAmount: 200_000, maxAmount: 500_000 },
  { type: "INCOME", category: "partnership", descriptionAr: "إيرادات برامج تدريب مجتمعية", descriptionEn: "Community training program revenue", minAmount: 50_000, maxAmount: 200_000 },
  { type: "INCOME", category: "tuition", descriptionAr: "رسوم برامج الدبلوم المسائي", descriptionEn: "Evening diploma program fees", minAmount: 80_000, maxAmount: 300_000 },
];

const EXPENSE_TEMPLATES: TransactionTemplate[] = [
  { type: "EXPENSE", category: "supplies", descriptionAr: "مستلزمات مكتبية ومطبوعات", descriptionEn: "Office supplies and printing", minAmount: 5_000, maxAmount: 30_000 },
  { type: "EXPENSE", category: "equipment", descriptionAr: "شراء أجهزة حاسب آلي", descriptionEn: "Computer equipment purchase", minAmount: 20_000, maxAmount: 100_000 },
  { type: "EXPENSE", category: "services", descriptionAr: "خدمات نظافة وأمن", descriptionEn: "Cleaning and security services", minAmount: 15_000, maxAmount: 50_000 },
  { type: "EXPENSE", category: "salary", descriptionAr: "رواتب شهرية - المدربين", descriptionEn: "Monthly salaries - Trainers", minAmount: 50_000, maxAmount: 100_000 },
  { type: "EXPENSE", category: "travel", descriptionAr: "مصاريف سفر ومؤتمرات", descriptionEn: "Travel and conference expenses", minAmount: 5_000, maxAmount: 40_000 },
  { type: "EXPENSE", category: "maintenance", descriptionAr: "صيانة مرافق ومباني", descriptionEn: "Facilities and building maintenance", minAmount: 10_000, maxAmount: 60_000 },
  { type: "EXPENSE", category: "equipment", descriptionAr: "تجهيزات مختبرات", descriptionEn: "Laboratory equipment", minAmount: 30_000, maxAmount: 80_000 },
  { type: "EXPENSE", category: "services", descriptionAr: "اشتراكات برمجيات وتراخيص", descriptionEn: "Software subscriptions and licenses", minAmount: 10_000, maxAmount: 50_000 },
  { type: "EXPENSE", category: "supplies", descriptionAr: "مواد تعليمية وكتب", descriptionEn: "Educational materials and books", minAmount: 5_000, maxAmount: 25_000 },
  { type: "EXPENSE", category: "maintenance", descriptionAr: "صيانة أجهزة ومعدات", descriptionEn: "Equipment maintenance", minAmount: 8_000, maxAmount: 45_000 },
];

// -----------------------------------------------------------------------------
// Procurement Request Definitions
// -----------------------------------------------------------------------------

interface ProcurementDef {
  titleAr: string;
  titleEn: string;
  description: string;
  estimatedCost: number;
  actualCost: number | null;
  status: string;
}

const PROCUREMENT_REQUESTS: ProcurementDef[] = [
  { titleAr: "شراء أجهزة حاسب لمختبر البرمجة", titleEn: "Purchase computers for programming lab", description: "30 جهاز حاسب مكتبي مع شاشات", estimatedCost: 450_000, actualCost: 420_000, status: "COMPLETED" },
  { titleAr: "تجهيز مختبر الشبكات", titleEn: "Network lab equipment setup", description: "معدات شبكات سيسكو ومفاتيح تبديل", estimatedCost: 280_000, actualCost: null, status: "APPROVED" },
  { titleAr: "طابعات وماسحات ضوئية", titleEn: "Printers and scanners", description: "10 طابعات ليزر و 5 ماسحات ضوئية", estimatedCost: 85_000, actualCost: 82_000, status: "COMPLETED" },
  { titleAr: "أثاث مكتبي جديد", titleEn: "New office furniture", description: "أثاث لـ 15 مكتب إداري", estimatedCost: 120_000, actualCost: null, status: "PENDING" },
  { titleAr: "نظام كاميرات مراقبة", titleEn: "CCTV surveillance system", description: "تركيب 50 كاميرا مراقبة جديدة", estimatedCost: 200_000, actualCost: null, status: "IN_PROGRESS" },
  { titleAr: "تجديد مختبر الكهرباء", titleEn: "Electrical lab renovation", description: "تجديد معدات مختبر القوى الكهربائية", estimatedCost: 350_000, actualCost: null, status: "APPROVED" },
  { titleAr: "أجهزة عرض ذكية", titleEn: "Smart projectors", description: "20 جهاز عرض ذكي للقاعات الدراسية", estimatedCost: 160_000, actualCost: 155_000, status: "COMPLETED" },
  { titleAr: "معدات السلامة المهنية", titleEn: "Occupational safety equipment", description: "معدات حماية شخصية وأجهزة إطفاء", estimatedCost: 95_000, actualCost: null, status: "PENDING" },
  { titleAr: "تحديث خوادم مركز البيانات", titleEn: "Data center server upgrade", description: "ترقية 4 خوادم رئيسية", estimatedCost: 500_000, actualCost: null, status: "REJECTED" },
  { titleAr: "مستلزمات مختبر التصميم", titleEn: "Design lab supplies", description: "أجهزة رسم لوحي وبرامج تصميم", estimatedCost: 180_000, actualCost: null, status: "IN_PROGRESS" },
];

// -----------------------------------------------------------------------------
// Warehouse Item Definitions
// -----------------------------------------------------------------------------

interface WarehouseItemDef {
  nameAr: string;
  nameEn: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  location: string;
}

const WAREHOUSE_ITEMS: WarehouseItemDef[] = [
  // Lab Equipment (10)
  { nameAr: "راوتر سيسكو 2901", nameEn: "Cisco Router 2901", category: "lab_equipment", quantity: 15, minQuantity: 5, unit: "unit", location: "مخزن A-1" },
  { nameAr: "سويتش سيسكو 24 منفذ", nameEn: "Cisco Switch 24-port", category: "lab_equipment", quantity: 20, minQuantity: 8, unit: "unit", location: "مخزن A-1" },
  { nameAr: "كابل شبكة Cat6 (صندوق)", nameEn: "Cat6 Network Cable (box)", category: "lab_equipment", quantity: 30, minQuantity: 10, unit: "box", location: "مخزن A-2" },
  { nameAr: "ملتيميتر رقمي", nameEn: "Digital Multimeter", category: "lab_equipment", quantity: 25, minQuantity: 10, unit: "unit", location: "مخزن B-1" },
  { nameAr: "أوسيلوسكوب", nameEn: "Oscilloscope", category: "lab_equipment", quantity: 8, minQuantity: 3, unit: "unit", location: "مخزن B-1" },
  { nameAr: "لوحة تجارب إلكترونية", nameEn: "Electronics Breadboard Kit", category: "lab_equipment", quantity: 50, minQuantity: 20, unit: "kit", location: "مخزن B-2" },
  { nameAr: "مصدر طاقة مختبري", nameEn: "Lab Power Supply", category: "lab_equipment", quantity: 12, minQuantity: 5, unit: "unit", location: "مخزن B-1" },
  { nameAr: "جهاز لحام قصدير", nameEn: "Soldering Station", category: "lab_equipment", quantity: 18, minQuantity: 8, unit: "unit", location: "مخزن B-2" },
  { nameAr: "مفتاح ربط صناعي (طقم)", nameEn: "Industrial Wrench Set", category: "lab_equipment", quantity: 10, minQuantity: 4, unit: "set", location: "مخزن C-1" },
  { nameAr: "جهاز فحص كهربائي", nameEn: "Electrical Tester", category: "lab_equipment", quantity: 15, minQuantity: 5, unit: "unit", location: "مخزن B-1" },
  // Office Supplies (10)
  { nameAr: "رزم ورق A4", nameEn: "A4 Paper Reams", category: "office_supplies", quantity: 200, minQuantity: 50, unit: "ream", location: "مخزن D-1" },
  { nameAr: "حبر طابعة ليزر HP", nameEn: "HP Laser Printer Toner", category: "office_supplies", quantity: 40, minQuantity: 15, unit: "cartridge", location: "مخزن D-1" },
  { nameAr: "أقلام حبر جاف (علبة)", nameEn: "Ballpoint Pens (box)", category: "office_supplies", quantity: 100, minQuantity: 30, unit: "box", location: "مخزن D-2" },
  { nameAr: "ملفات بلاستيكية", nameEn: "Plastic Folders", category: "office_supplies", quantity: 300, minQuantity: 100, unit: "piece", location: "مخزن D-2" },
  { nameAr: "سبورة بيضاء (قلم)", nameEn: "Whiteboard Markers", category: "office_supplies", quantity: 150, minQuantity: 50, unit: "piece", location: "مخزن D-2" },
  { nameAr: "دباسة ودبابيس (طقم)", nameEn: "Stapler & Staples Set", category: "office_supplies", quantity: 30, minQuantity: 10, unit: "set", location: "مخزن D-1" },
  { nameAr: "شريط لاصق (رول)", nameEn: "Adhesive Tape (roll)", category: "office_supplies", quantity: 80, minQuantity: 20, unit: "roll", location: "مخزن D-2" },
  { nameAr: "مقص مكتبي", nameEn: "Office Scissors", category: "office_supplies", quantity: 25, minQuantity: 10, unit: "piece", location: "مخزن D-1" },
  { nameAr: "آلة حاسبة مكتبية", nameEn: "Desktop Calculator", category: "office_supplies", quantity: 15, minQuantity: 5, unit: "unit", location: "مخزن D-1" },
  { nameAr: "ظروف بريدية (صندوق)", nameEn: "Envelopes (box)", category: "office_supplies", quantity: 50, minQuantity: 20, unit: "box", location: "مخزن D-2" },
  // IT Equipment (10)
  { nameAr: "جهاز حاسب مكتبي Dell", nameEn: "Dell Desktop Computer", category: "it_equipment", quantity: 10, minQuantity: 3, unit: "unit", location: "مخزن E-1" },
  { nameAr: "شاشة عرض 24 بوصة", nameEn: "24-inch Monitor", category: "it_equipment", quantity: 12, minQuantity: 5, unit: "unit", location: "مخزن E-1" },
  { nameAr: "لوحة مفاتيح وفأرة (طقم)", nameEn: "Keyboard & Mouse Set", category: "it_equipment", quantity: 35, minQuantity: 15, unit: "set", location: "مخزن E-2" },
  { nameAr: "هارد ديسك خارجي 1TB", nameEn: "External Hard Drive 1TB", category: "it_equipment", quantity: 8, minQuantity: 3, unit: "unit", location: "مخزن E-1" },
  { nameAr: "كابل HDMI (3 متر)", nameEn: "HDMI Cable (3m)", category: "it_equipment", quantity: 40, minQuantity: 15, unit: "piece", location: "مخزن E-2" },
  { nameAr: "نقطة وصول لاسلكية", nameEn: "Wireless Access Point", category: "it_equipment", quantity: 6, minQuantity: 2, unit: "unit", location: "مخزن E-1" },
  { nameAr: "UPS جهاز طاقة احتياطي", nameEn: "UPS Backup Power Supply", category: "it_equipment", quantity: 10, minQuantity: 3, unit: "unit", location: "مخزن E-1" },
  { nameAr: "فلاش ميموري 32GB", nameEn: "USB Flash Drive 32GB", category: "it_equipment", quantity: 50, minQuantity: 20, unit: "piece", location: "مخزن E-2" },
  { nameAr: "جهاز عرض بروجكتر", nameEn: "LCD Projector", category: "it_equipment", quantity: 5, minQuantity: 2, unit: "unit", location: "مخزن E-1" },
  { nameAr: "سماعات وميكروفون مؤتمرات", nameEn: "Conference Speaker & Mic", category: "it_equipment", quantity: 4, minQuantity: 2, unit: "set", location: "مخزن E-1" },
];

// =============================================================================
// Main Seed Function
// =============================================================================

export async function seedFinancial(prisma: PrismaClient) {
  console.log("  Seeding financial data...");

  // ---------------------------------------------------------------------------
  // 1. Budget Items (12 items, fiscal year 2024) - upsert by nameEn+fiscalYear
  // ---------------------------------------------------------------------------
  console.log("    Seeding budget items...");

  for (const bi of BUDGET_ITEMS) {
    // Use a composite lookup: find existing by name + fiscal year, then upsert
    const existing = await prisma.budgetItem.findFirst({
      where: { nameEn: bi.nameEn, fiscalYear: 2024 },
    });

    if (existing) {
      await prisma.budgetItem.update({
        where: { id: existing.id },
        data: {
          nameAr: bi.nameAr,
          nameEn: bi.nameEn,
          category: bi.category,
          allocatedAmount: bi.allocatedAmount,
          spentAmount: bi.spentAmount,
          fiscalYear: 2024,
        },
      });
    } else {
      await prisma.budgetItem.create({
        data: {
          nameAr: bi.nameAr,
          nameEn: bi.nameEn,
          category: bi.category,
          allocatedAmount: bi.allocatedAmount,
          spentAmount: bi.spentAmount,
          fiscalYear: 2024,
        },
      });
    }
  }

  console.log(`    Created ${BUDGET_ITEMS.length} budget items.`);

  // ---------------------------------------------------------------------------
  // 2. Financial Transactions (100 transactions)
  // ---------------------------------------------------------------------------
  console.log("    Seeding financial transactions...");

  // Fetch the accountant user for approvals
  const accountantUser = await prisma.user.findFirst({
    where: { role: "accountant" },
  });

  const transactions: Array<{
    type: "INCOME" | "EXPENSE";
    amount: number;
    descriptionAr: string | null;
    descriptionEn: string | null;
    category: string;
    reference: string | null;
    date: Date;
    status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
    approvedById: string | null;
    approvedDate: Date | null;
  }> = [];

  const statusDistribution: Array<"PENDING" | "APPROVED" | "REJECTED" | "COMPLETED"> = [];
  // 50% COMPLETED, 25% APPROVED, 15% PENDING, 10% REJECTED
  for (let i = 0; i < 50; i++) statusDistribution.push("COMPLETED");
  for (let i = 0; i < 25; i++) statusDistribution.push("APPROVED");
  for (let i = 0; i < 15; i++) statusDistribution.push("PENDING");
  for (let i = 0; i < 10; i++) statusDistribution.push("REJECTED");

  const dateStart = new Date("2024-01-01");
  const dateEnd = new Date("2024-12-31");

  for (let i = 0; i < 100; i++) {
    // 60% income, 40% expense
    const isIncome = i < 60;
    const template = isIncome
      ? randomFrom(INCOME_TEMPLATES)
      : randomFrom(EXPENSE_TEMPLATES);

    const amount = randomInt(template.minAmount, template.maxAmount);
    const status = randomFrom(statusDistribution);
    const txDate = randomDate(dateStart, dateEnd);
    const reference = `TXN-2024-${String(i + 1).padStart(4, "0")}`;

    const needsApproval = status === "COMPLETED" || status === "APPROVED";
    const approvedById = needsApproval && accountantUser ? accountantUser.id : null;
    const approvedDate = needsApproval ? new Date(txDate.getTime() + randomInt(1, 7) * 86_400_000) : null;

    transactions.push({
      type: template.type,
      amount,
      descriptionAr: template.descriptionAr,
      descriptionEn: template.descriptionEn,
      category: template.category,
      reference,
      date: txDate,
      status,
      approvedById,
      approvedDate,
    });
  }

  await prisma.financialTransaction.createMany({ data: transactions });
  console.log(`    Created ${transactions.length} financial transactions.`);

  // ---------------------------------------------------------------------------
  // 3. Procurement Requests (10)
  // ---------------------------------------------------------------------------
  console.log("    Seeding procurement requests...");

  // Fetch a department head to use as requestedBy
  const deptHead = await prisma.user.findFirst({
    where: { role: "dept_head" },
  });
  const requesterId = deptHead?.id ?? "unknown";

  const procurementData = PROCUREMENT_REQUESTS.map((pr) => ({
    titleAr: pr.titleAr,
    titleEn: pr.titleEn,
    description: pr.description,
    estimatedCost: pr.estimatedCost,
    actualCost: pr.actualCost,
    requestedBy: requesterId,
    status: pr.status,
  }));

  await prisma.procurementRequest.createMany({ data: procurementData });
  console.log(`    Created ${procurementData.length} procurement requests.`);

  // ---------------------------------------------------------------------------
  // 4. Warehouse Items (30)
  // ---------------------------------------------------------------------------
  console.log("    Seeding warehouse items...");

  const warehouseData = WAREHOUSE_ITEMS.map((wi) => ({
    nameAr: wi.nameAr,
    nameEn: wi.nameEn,
    category: wi.category,
    quantity: wi.quantity,
    minQuantity: wi.minQuantity,
    unit: wi.unit,
    location: wi.location,
  }));

  await prisma.warehouseItem.createMany({ data: warehouseData });
  console.log(`    Created ${warehouseData.length} warehouse items.`);

  console.log("  Financial seed complete.");
}
