import type { PrismaClient } from "@prisma/client";

interface DepartmentDef {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  capacity: number;
  head: {
    email: string;
    nameAr: string;
    nameEn: string;
    phone: string;
  };
}

const DEPARTMENTS: DepartmentDef[] = [
  {
    id: "dept-cs",
    nameAr: "الحاسب الآلي",
    nameEn: "Computer Science",
    descriptionAr: "قسم الحاسب الآلي وتقنية المعلومات",
    descriptionEn: "Computer Science and IT Department",
    capacity: 300,
    head: {
      email: "head.cs@saohil1.sa",
      nameAr: "د. خالد بن سعيد الشمراني",
      nameEn: "Dr. Khaled Al-Shamrani",
      phone: "0511001001",
    },
  },
  {
    id: "dept-ee",
    nameAr: "الكهرباء",
    nameEn: "Electrical Engineering",
    descriptionAr: "قسم الهندسة الكهربائية",
    descriptionEn: "Electrical Engineering Department",
    capacity: 250,
    head: {
      email: "head.ee@saohil1.sa",
      nameAr: "م. فهد بن ناصر الدوسري",
      nameEn: "Eng. Fahad Al-Dosari",
      phone: "0511002002",
    },
  },
  {
    id: "dept-me",
    nameAr: "الميكانيكا",
    nameEn: "Mechanical Engineering",
    descriptionAr: "قسم الهندسة الميكانيكية",
    descriptionEn: "Mechanical Engineering Department",
    capacity: 260,
    head: {
      email: "head.me@saohil1.sa",
      nameAr: "م. عبدالعزيز بن صالح القحطاني",
      nameEn: "Eng. Abdulaziz Al-Qahtani",
      phone: "0511003003",
    },
  },
  {
    id: "dept-ba",
    nameAr: "إدارة الأعمال",
    nameEn: "Business Administration",
    descriptionAr: "قسم إدارة الأعمال",
    descriptionEn: "Business Administration Department",
    capacity: 200,
    head: {
      email: "head.ba@saohil1.sa",
      nameAr: "د. سارة بنت عبدالله المطيري",
      nameEn: "Dr. Sara Al-Mutairi",
      phone: "0511004004",
    },
  },
  {
    id: "dept-em",
    nameAr: "التسويق الإلكتروني",
    nameEn: "E-Marketing",
    descriptionAr: "قسم التسويق الإلكتروني",
    descriptionEn: "Electronic Marketing Department",
    capacity: 150,
    head: {
      email: "head.em@saohil1.sa",
      nameAr: "أ. محمد بن علي الشهري",
      nameEn: "Mr. Mohammed Al-Shahri",
      phone: "0511005005",
    },
  },
  {
    id: "dept-wd",
    nameAr: "البرمجة وتطوير الويب",
    nameEn: "Web Development",
    descriptionAr: "قسم البرمجة وتطوير تطبيقات الويب",
    descriptionEn: "Programming and Web Development Department",
    capacity: 180,
    head: {
      email: "head.wd@saohil1.sa",
      nameAr: "م. نورة بنت فهد العتيبي",
      nameEn: "Eng. Noura Al-Otaibi",
      phone: "0511006006",
    },
  },
  {
    id: "dept-cy",
    nameAr: "الشبكات والأمن السيبراني",
    nameEn: "Cybersecurity",
    descriptionAr: "قسم الشبكات والأمن السيبراني",
    descriptionEn: "Networks and Cybersecurity Department",
    capacity: 120,
    head: {
      email: "head.cy@saohil1.sa",
      nameAr: "م. عمر بن سعد الزهراني",
      nameEn: "Eng. Omar Al-Zahrani",
      phone: "0511007007",
    },
  },
  {
    id: "dept-gd",
    nameAr: "التصميم الجرافيكي",
    nameEn: "Graphic Design",
    descriptionAr: "قسم التصميم الجرافيكي والوسائط المتعددة",
    descriptionEn: "Graphic Design and Multimedia Department",
    capacity: 100,
    head: {
      email: "head.gd@saohil1.sa",
      nameAr: "أ. لينا بنت خالد الحربي",
      nameEn: "Ms. Lina Al-Harbi",
      phone: "0511008008",
    },
  },
  {
    id: "dept-ac",
    nameAr: "المحاسبة",
    nameEn: "Accounting",
    descriptionAr: "قسم المحاسبة والعلوم المالية",
    descriptionEn: "Accounting and Financial Sciences Department",
    capacity: 140,
    head: {
      email: "head.ac@saohil1.sa",
      nameAr: "د. عبدالرحمن بن حسن العمري",
      nameEn: "Dr. Abdulrahman Al-Omari",
      phone: "0511009009",
    },
  },
  {
    id: "dept-os",
    nameAr: "السلامة والصحة المهنية",
    nameEn: "Occupational Safety",
    descriptionAr: "قسم السلامة والصحة المهنية",
    descriptionEn: "Occupational Safety and Health Department",
    capacity: 100,
    head: {
      email: "head.os@saohil1.sa",
      nameAr: "م. تركي بن سليمان البقمي",
      nameEn: "Eng. Turki Al-Bugami",
      phone: "0511010010",
    },
  },
];

export async function seedDepartments(
  prisma: PrismaClient,
  passwordHash: string
) {
  console.log("  Seeding departments with heads...");

  const departments = [];

  for (const def of DEPARTMENTS) {
    // Create the department head user first
    const headUser = await prisma.user.upsert({
      where: { email: def.head.email },
      update: {},
      create: {
        email: def.head.email,
        passwordHash,
        nameAr: def.head.nameAr,
        nameEn: def.head.nameEn,
        role: "dept_head",
        phone: def.head.phone,
      },
    });

    // Create the department linked to its head
    const dept = await prisma.department.upsert({
      where: { id: def.id },
      update: {},
      create: {
        id: def.id,
        nameAr: def.nameAr,
        nameEn: def.nameEn,
        descriptionAr: def.descriptionAr,
        descriptionEn: def.descriptionEn,
        headId: headUser.id,
        capacity: def.capacity,
        isActive: true,
      },
    });

    departments.push(dept);
  }

  console.log(`  Created ${departments.length} departments with heads.`);

  return departments;
}
