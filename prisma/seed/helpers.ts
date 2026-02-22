// =============================================================================
// Campus26 Seed Data Helpers
// Saudi-realistic data generators - pure TypeScript, no external dependencies
// =============================================================================

// -----------------------------------------------------------------------------
// Name Data Arrays
// -----------------------------------------------------------------------------

export interface NameEntry {
  ar: string;
  en: string;
}

/** 65 Saudi male first names */
export const maleFirstNames: NameEntry[] = [
  { ar: "محمد", en: "Mohammed" },
  { ar: "عبدالله", en: "Abdullah" },
  { ar: "خالد", en: "Khaled" },
  { ar: "فهد", en: "Fahad" },
  { ar: "سعود", en: "Saud" },
  { ar: "تركي", en: "Turki" },
  { ar: "عبدالرحمن", en: "Abdulrahman" },
  { ar: "سلطان", en: "Sultan" },
  { ar: "ناصر", en: "Nasser" },
  { ar: "بندر", en: "Bandar" },
  { ar: "سعد", en: "Saad" },
  { ar: "عمر", en: "Omar" },
  { ar: "أحمد", en: "Ahmed" },
  { ar: "إبراهيم", en: "Ibrahim" },
  { ar: "يوسف", en: "Yousef" },
  { ar: "مشاري", en: "Mishari" },
  { ar: "نواف", en: "Nawaf" },
  { ar: "ماجد", en: "Majed" },
  { ar: "وليد", en: "Waleed" },
  { ar: "فيصل", en: "Faisal" },
  { ar: "حسن", en: "Hassan" },
  { ar: "حسين", en: "Hussein" },
  { ar: "علي", en: "Ali" },
  { ar: "صالح", en: "Saleh" },
  { ar: "عبدالعزيز", en: "Abdulaziz" },
  { ar: "طلال", en: "Talal" },
  { ar: "رائد", en: "Raed" },
  { ar: "زياد", en: "Ziad" },
  { ar: "هاني", en: "Hani" },
  { ar: "بدر", en: "Badr" },
  { ar: "منصور", en: "Mansour" },
  { ar: "عادل", en: "Adel" },
  { ar: "ياسر", en: "Yasser" },
  { ar: "مازن", en: "Mazen" },
  { ar: "حمد", en: "Hamad" },
  { ar: "مشعل", en: "Mishaal" },
  { ar: "عبدالمجيد", en: "Abdulmajeed" },
  { ar: "أنس", en: "Anas" },
  { ar: "رامي", en: "Rami" },
  { ar: "طارق", en: "Tariq" },
  { ar: "سامي", en: "Sami" },
  { ar: "عثمان", en: "Othman" },
  { ar: "مهند", en: "Muhannad" },
  { ar: "رشيد", en: "Rashid" },
  { ar: "نايف", en: "Naif" },
  { ar: "متعب", en: "Muteb" },
  { ar: "فراس", en: "Firas" },
  { ar: "حمزة", en: "Hamza" },
  { ar: "داود", en: "Dawoud" },
  { ar: "جمال", en: "Jamal" },
  { ar: "مروان", en: "Marwan" },
  { ar: "عماد", en: "Emad" },
  { ar: "كريم", en: "Kareem" },
  { ar: "وائل", en: "Wael" },
  { ar: "ثامر", en: "Thamer" },
  { ar: "غازي", en: "Ghazi" },
  { ar: "هشام", en: "Hisham" },
  { ar: "لؤي", en: "Louai" },
  { ar: "شاكر", en: "Shaker" },
  { ar: "رياض", en: "Riyadh" },
  { ar: "عصام", en: "Essam" },
  { ar: "نبيل", en: "Nabil" },
  { ar: "سالم", en: "Salem" },
  { ar: "معاذ", en: "Muath" },
  { ar: "أسامة", en: "Osama" },
];

/** 35 Saudi female first names */
export const femaleFirstNames: NameEntry[] = [
  { ar: "نورة", en: "Noura" },
  { ar: "سارة", en: "Sara" },
  { ar: "فاطمة", en: "Fatima" },
  { ar: "مريم", en: "Maryam" },
  { ar: "عائشة", en: "Aisha" },
  { ar: "هيفاء", en: "Haifa" },
  { ar: "ريم", en: "Reem" },
  { ar: "دانة", en: "Dana" },
  { ar: "لمياء", en: "Lamia" },
  { ar: "أمل", en: "Amal" },
  { ar: "هند", en: "Hind" },
  { ar: "مها", en: "Maha" },
  { ar: "لطيفة", en: "Latifa" },
  { ar: "منيرة", en: "Munira" },
  { ar: "جواهر", en: "Jawaher" },
  { ar: "العنود", en: "Al-Anoud" },
  { ar: "بسمة", en: "Basma" },
  { ar: "رزان", en: "Razan" },
  { ar: "شيخة", en: "Sheikha" },
  { ar: "وفاء", en: "Wafa" },
  { ar: "ابتسام", en: "Ibtisam" },
  { ar: "سلمى", en: "Salma" },
  { ar: "ياسمين", en: "Yasmeen" },
  { ar: "رنا", en: "Rana" },
  { ar: "غادة", en: "Ghada" },
  { ar: "سمية", en: "Sumaya" },
  { ar: "حنان", en: "Hanan" },
  { ar: "نجلاء", en: "Najla" },
  { ar: "خلود", en: "Kholoud" },
  { ar: "أروى", en: "Arwa" },
  { ar: "لينا", en: "Lina" },
  { ar: "تهاني", en: "Tahani" },
  { ar: "نوف", en: "Nouf" },
  { ar: "بدور", en: "Budoor" },
  { ar: "رقية", en: "Ruqaya" },
];

/** 65 Saudi family names */
export const familyNames: NameEntry[] = [
  { ar: "العتيبي", en: "Al-Otaibi" },
  { ar: "الغامدي", en: "Al-Ghamdi" },
  { ar: "الزهراني", en: "Al-Zahrani" },
  { ar: "القحطاني", en: "Al-Qahtani" },
  { ar: "الشهري", en: "Al-Shahri" },
  { ar: "الدوسري", en: "Al-Dosari" },
  { ar: "المطيري", en: "Al-Mutairi" },
  { ar: "الحربي", en: "Al-Harbi" },
  { ar: "السبيعي", en: "Al-Subai" },
  { ar: "الشمري", en: "Al-Shammari" },
  { ar: "العنزي", en: "Al-Enezi" },
  { ar: "البلوي", en: "Al-Balawi" },
  { ar: "الرشيدي", en: "Al-Rashidi" },
  { ar: "السلمي", en: "Al-Sulami" },
  { ar: "الجهني", en: "Al-Johani" },
  { ar: "المالكي", en: "Al-Malki" },
  { ar: "الثقفي", en: "Al-Thaqafi" },
  { ar: "الأحمدي", en: "Al-Ahmadi" },
  { ar: "الحازمي", en: "Al-Hazmi" },
  { ar: "الخالدي", en: "Al-Khalidi" },
  { ar: "العمري", en: "Al-Amri" },
  { ar: "الشريف", en: "Al-Sharif" },
  { ar: "السيد", en: "Al-Sayed" },
  { ar: "النعيمي", en: "Al-Nuaimi" },
  { ar: "الكثيري", en: "Al-Kathiri" },
  { ar: "اليامي", en: "Al-Yami" },
  { ar: "الفيفي", en: "Al-Faifi" },
  { ar: "البيشي", en: "Al-Bishi" },
  { ar: "الأسمري", en: "Al-Asmari" },
  { ar: "الخثعمي", en: "Al-Khathami" },
  { ar: "العسيري", en: "Al-Asiri" },
  { ar: "المحمدي", en: "Al-Mohammadi" },
  { ar: "الطويرقي", en: "Al-Tuwairqi" },
  { ar: "الزبيدي", en: "Al-Zubaidi" },
  { ar: "البقمي", en: "Al-Bugami" },
  { ar: "الرويلي", en: "Al-Ruwaili" },
  { ar: "السهلي", en: "Al-Sahli" },
  { ar: "المعبد", en: "Al-Maabad" },
  { ar: "الحمدان", en: "Al-Hamdan" },
  { ar: "الراجحي", en: "Al-Rajhi" },
  { ar: "الفالح", en: "Al-Faleh" },
  { ar: "العيسى", en: "Al-Issa" },
  { ar: "الناصر", en: "Al-Nasser" },
  { ar: "المنصور", en: "Al-Mansour" },
  { ar: "البراهيم", en: "Al-Braheim" },
  { ar: "الحقباني", en: "Al-Haqbani" },
  { ar: "السديري", en: "Al-Sudairi" },
  { ar: "العجمي", en: "Al-Ajmi" },
  { ar: "التميمي", en: "Al-Tamimi" },
  { ar: "الشيباني", en: "Al-Shaibani" },
  { ar: "المهنا", en: "Al-Muhanna" },
  { ar: "العبدالله", en: "Al-Abdullah" },
  { ar: "الفضلي", en: "Al-Fadhli" },
  { ar: "القرني", en: "Al-Qarni" },
  { ar: "الحميدي", en: "Al-Humaidi" },
  { ar: "المزيني", en: "Al-Muzaini" },
  { ar: "العوفي", en: "Al-Awfi" },
  { ar: "المري", en: "Al-Marri" },
  { ar: "العصيمي", en: "Al-Osaimi" },
  { ar: "الهاجري", en: "Al-Hajri" },
  { ar: "السعدون", en: "Al-Saadoun" },
  { ar: "المقبل", en: "Al-Muqbil" },
  { ar: "الخليفة", en: "Al-Khalifa" },
  { ar: "العقيل", en: "Al-Aqeel" },
  { ar: "الصقر", en: "Al-Saqr" },
];

// -----------------------------------------------------------------------------
// Utility Functions
// -----------------------------------------------------------------------------

/**
 * Pick a random element from an array.
 */
export function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Random integer in range [min, max] (inclusive).
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random date between start and end (inclusive).
 */
export function randomDate(start: Date, end: Date): Date {
  const startMs = start.getTime();
  const endMs = end.getTime();
  return new Date(startMs + Math.random() * (endMs - startMs));
}

/**
 * Fisher-Yates shuffle (returns a new array, does not mutate the original).
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Gaussian (normal) random using the Box-Muller transform.
 * Returns a single value drawn from N(mean, stddev).
 */
export function gaussianRandom(mean: number, stddev: number): number {
  let u1 = 0;
  let u2 = 0;
  // Avoid log(0)
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stddev + mean;
}

// -----------------------------------------------------------------------------
// Saudi-specific Generators
// -----------------------------------------------------------------------------

/**
 * Generate a Saudi mobile phone number in 05XXXXXXXX format (10 digits).
 */
export function generateSaudiPhone(): string {
  const operators = ["50", "53", "54", "55", "56", "57", "58", "59"];
  const prefix = randomFrom(operators);
  const suffix = String(randomInt(1000000, 9999999));
  return `0${prefix}${suffix}`;
}

/**
 * Generate a Saudi National ID.
 * - Males: starts with "1"
 * - Females: starts with "2"
 * Total length: 10 digits.
 */
export function generateNationalId(gender: "male" | "female"): string {
  const prefix = gender === "male" ? "1" : "2";
  const rest = String(randomInt(100000000, 999999999));
  return `${prefix}${rest}`;
}

/**
 * Generate a student number with year prefix.
 * Format: 24XXXX where XXXX is zero-padded based on index.
 */
export function generateStudentNumber(index: number): string {
  const padded = String(index + 1).padStart(4, "0");
  return `24${padded}`;
}

/**
 * Generate an employee number.
 * Format: EMPXXXX where XXXX is zero-padded based on index.
 */
export function generateEmployeeNumber(index: number): string {
  const padded = String(index + 1).padStart(4, "0");
  return `EMP${padded}`;
}

/**
 * Generate an email address.
 * Transliterates common patterns and appends domain.
 */
export function generateEmail(
  firstName: string,
  lastName: string,
  domain: string = "campus26.sa"
): string {
  const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, "");
  const cleanLast = lastName
    .toLowerCase()
    .replace(/^al-/, "al")
    .replace(/[^a-z]/g, "");
  return `${cleanFirst}.${cleanLast}@${domain}`;
}

/**
 * Generate a GPA using a normal distribution.
 * Centered at 2.8, stddev 0.6, clamped to [1.0, 4.0].
 * Returns a number rounded to 2 decimal places.
 */
export function generateGPA(): number {
  const raw = gaussianRandom(2.8, 0.6);
  const clamped = Math.max(1.0, Math.min(4.0, raw));
  return Math.round(clamped * 100) / 100;
}

// -----------------------------------------------------------------------------
// Department Specializations
// -----------------------------------------------------------------------------

export const departmentSpecializations: Record<string, NameEntry[]> = {
  "dept-cs": [
    { ar: "شبكات الحاسب", en: "Computer Networks" },
    { ar: "قواعد البيانات", en: "Database Systems" },
    { ar: "برمجة تطبيقات", en: "Application Programming" },
    { ar: "ذكاء اصطناعي", en: "Artificial Intelligence" },
    { ar: "نظم تشغيل", en: "Operating Systems" },
  ],
  "dept-ee": [
    { ar: "قوى كهربائية", en: "Electrical Power" },
    { ar: "تحكم آلي", en: "Automatic Control" },
    { ar: "أجهزة قياس", en: "Measurement Instruments" },
    { ar: "تمديدات كهربائية", en: "Electrical Installations" },
  ],
  "dept-me": [
    { ar: "تصنيع", en: "Manufacturing" },
    { ar: "صيانة", en: "Maintenance" },
    { ar: "تبريد وتكييف", en: "Refrigeration & HVAC" },
    { ar: "لحام", en: "Welding" },
  ],
  "dept-ba": [
    { ar: "إدارة مالية", en: "Financial Management" },
    { ar: "موارد بشرية", en: "Human Resources" },
    { ar: "تسويق", en: "Marketing" },
    { ar: "محاسبة", en: "Accounting" },
  ],
  "dept-em": [
    { ar: "تسويق رقمي", en: "Digital Marketing" },
    { ar: "تجارة إلكترونية", en: "E-Commerce" },
    { ar: "وسائل التواصل", en: "Social Media" },
  ],
  "dept-wd": [
    { ar: "تطوير واجهات", en: "Frontend Development" },
    { ar: "تطوير خوادم", en: "Backend Development" },
    { ar: "تطبيقات موبايل", en: "Mobile Applications" },
    { ar: "DevOps", en: "DevOps" },
  ],
  "dept-cy": [
    { ar: "أمن شبكات", en: "Network Security" },
    { ar: "تحليل جنائي رقمي", en: "Digital Forensics" },
    { ar: "اختبار اختراق", en: "Penetration Testing" },
  ],
  "dept-gd": [
    { ar: "تصميم جرافيك", en: "Graphic Design" },
    { ar: "تصميم UI/UX", en: "UI/UX Design" },
    { ar: "إنتاج فيديو", en: "Video Production" },
  ],
  "dept-ac": [
    { ar: "محاسبة مالية", en: "Financial Accounting" },
    { ar: "محاسبة إدارية", en: "Managerial Accounting" },
    { ar: "مراجعة", en: "Auditing" },
  ],
  "dept-os": [
    { ar: "سلامة مهنية", en: "Occupational Safety" },
    { ar: "صحة بيئية", en: "Environmental Health" },
    { ar: "إطفاء", en: "Firefighting" },
  ],
};

// -----------------------------------------------------------------------------
// Qualifications (weighted for random selection)
// -----------------------------------------------------------------------------

export interface Qualification {
  ar: string;
  en: string;
  weight: number;
}

export const qualifications: Qualification[] = [
  { ar: "ماجستير", en: "Master's Degree", weight: 0.4 },
  { ar: "دكتوراه", en: "PhD", weight: 0.25 },
  { ar: "بكالوريوس + شهادة مهنية", en: "Bachelor's + Professional Certificate", weight: 0.25 },
  { ar: "شهادة مهنية احترافية", en: "Professional Certification", weight: 0.1 },
];

/**
 * Pick a random qualification using the defined weights.
 */
export function randomQualification(): Qualification {
  const r = Math.random();
  let cumulative = 0;
  for (const q of qualifications) {
    cumulative += q.weight;
    if (r <= cumulative) {
      return q;
    }
  }
  // Fallback (should not be reached with proper weights summing to 1.0)
  return qualifications[0];
}
