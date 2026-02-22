import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale: string = "ar-SA") {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatNumber(num: number, locale: string = "ar-SA") {
  return new Intl.NumberFormat(locale).format(num);
}

export function formatCurrency(amount: number, locale: string = "ar-SA") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "SAR",
  }).format(amount);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function calculateGPA(totalGrade: number): string {
  if (totalGrade >= 95) return "A+";
  if (totalGrade >= 90) return "A";
  if (totalGrade >= 85) return "B+";
  if (totalGrade >= 80) return "B";
  if (totalGrade >= 75) return "C+";
  if (totalGrade >= 70) return "C";
  if (totalGrade >= 65) return "D+";
  if (totalGrade >= 60) return "D";
  return "F";
}

export function generateStudentNumber(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `${year}${random}`;
}
