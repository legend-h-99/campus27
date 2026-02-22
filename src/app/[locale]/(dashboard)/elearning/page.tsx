"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/ui/stat-card";
import {
  MonitorPlay,
  BookOpen,
  Users,
  Award,
  Play,
  Clock,
  FileText,
  Video,
  Headphones,
  Plus,
  Star,
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  instructor: string;
  department: string;
  studentsEnrolled: number;
  lessonsCount: number;
  duration: string;
  rating: number;
  completionRate: number;
  category: string;
  thumbnail: string;
  status: "published" | "draft" | "in_review";
}

const courses: Course[] = [
  {
    id: "EL-001",
    title: "أساسيات البرمجة بلغة بايثون",
    instructor: "د. خالد السعيد",
    department: "قسم الحاسب الآلي",
    studentsEnrolled: 145,
    lessonsCount: 24,
    duration: "18 ساعة",
    rating: 4.8,
    completionRate: 72,
    category: "برمجة",
    thumbnail: "python",
    status: "published",
  },
  {
    id: "EL-002",
    title: "إدارة قواعد البيانات - Oracle",
    instructor: "م. فهد الدوسري",
    department: "قسم الحاسب الآلي",
    studentsEnrolled: 98,
    lessonsCount: 18,
    duration: "14 ساعة",
    rating: 4.5,
    completionRate: 65,
    category: "قواعد بيانات",
    thumbnail: "database",
    status: "published",
  },
  {
    id: "EL-003",
    title: "أمن الشبكات والمعلومات",
    instructor: "م. عبدالرحمن الغامدي",
    department: "قسم الحاسب الآلي",
    studentsEnrolled: 112,
    lessonsCount: 20,
    duration: "16 ساعة",
    rating: 4.7,
    completionRate: 58,
    category: "أمن معلومات",
    thumbnail: "security",
    status: "published",
  },
  {
    id: "EL-004",
    title: "مبادئ المحاسبة المالية",
    instructor: "د. سارة العمري",
    department: "قسم إدارة الأعمال",
    studentsEnrolled: 76,
    lessonsCount: 15,
    duration: "12 ساعة",
    rating: 4.3,
    completionRate: 81,
    category: "إدارة أعمال",
    thumbnail: "accounting",
    status: "published",
  },
  {
    id: "EL-005",
    title: "تقنيات الذكاء الاصطناعي",
    instructor: "د. نورة القحطاني",
    department: "قسم الحاسب الآلي",
    studentsEnrolled: 0,
    lessonsCount: 22,
    duration: "20 ساعة",
    rating: 0,
    completionRate: 0,
    category: "ذكاء اصطناعي",
    thumbnail: "ai",
    status: "draft",
  },
  {
    id: "EL-006",
    title: "أساسيات الصيانة الكهربائية",
    instructor: "م. سعد القحطاني",
    department: "قسم الكهرباء",
    studentsEnrolled: 54,
    lessonsCount: 12,
    duration: "10 ساعات",
    rating: 4.1,
    completionRate: 89,
    category: "كهرباء",
    thumbnail: "electrical",
    status: "published",
  },
];

const contentStats = [
  { label: "دروس فيديو", value: 342, icon: Video, color: "text-red-500", bgColor: "bg-red-500/10" },
  { label: "ملفات PDF", value: 128, icon: FileText, color: "text-teal-600", bgColor: "bg-teal-600/10" },
  { label: "اختبارات", value: 85, icon: BookOpen, color: "text-teal-500", bgColor: "bg-teal-500/10" },
  { label: "تسجيلات صوتية", value: 56, icon: Headphones, color: "text-amber-500", bgColor: "bg-amber-500/10" },
];

const statusConfig = {
  published: { label: "منشور", color: "bg-teal-500/10 text-teal-500" },
  draft: { label: "مسودة", color: "bg-amber-500/10 text-amber-500" },
  in_review: { label: "قيد المراجعة", color: "bg-teal-600/10 text-teal-600" },
};

export default function ElearningPage() {
  const t = useTranslations("nav");

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <PageHeader
        title={t("elearning")}
        description="منصة التعليم الإلكتروني والمحتوى التعليمي الرقمي"
        actions={
          <button className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 active:scale-[0.98]">
            <Plus className="h-4 w-4" />
            إضافة مقرر إلكتروني
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          title="المقررات الإلكترونية"
          value={courses.length}
          icon={MonitorPlay}
          gradient="from-teal-600 to-teal-800"
        />
        <StatCard
          title="إجمالي المسجلين"
          value="485"
          icon={Users}
          trend={{ value: 18, isPositive: true }}
          gradient="from-teal-500 to-teal-700"
        />
        <StatCard
          title="متوسط الإكمال"
          value="71%"
          icon={Award}
          trend={{ value: 5, isPositive: true }}
          gradient="from-amber-500 to-amber-700"
        />
        <StatCard
          title="إجمالي الدروس"
          value="111"
          icon={BookOpen}
          gradient="from-red-500 to-red-700"
        />
      </div>

      {/* Content Statistics */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-4">
        {contentStats.map((stat) => (
          <div key={stat.label} className="glass-card flex items-center gap-2 rounded-xl p-3 shadow-sm md:gap-3 md:p-4">
            <div className={`rounded-lg p-2.5 ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Course Cards */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground md:mb-4 md:text-lg">المقررات المتاحة</h3>
        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const status = statusConfig[course.status];
            return (
              <div
                key={course.id}
                className="glass-card overflow-hidden rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Thumbnail Placeholder */}
                <div className="relative h-40 bg-gradient-to-br from-teal-600 to-teal-800 p-4">
                  <div className="flex items-start justify-between">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 start-4">
                    <MonitorPlay className="h-10 w-10 text-white/30" />
                  </div>
                  {course.status === "published" && (
                    <button className="absolute bottom-4 end-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:scale-110 hover:bg-white/40 transition-all duration-200">
                      <Play className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="mb-1 text-sm font-semibold text-foreground">{course.title}</h4>
                  <p className="mb-3 text-xs text-muted">{course.instructor} - {course.department}</p>

                  <div className="mb-3 flex items-center gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {course.lessonsCount} درس
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {course.studentsEnrolled} متدرب
                    </span>
                  </div>

                  {/* Rating & Completion */}
                  {course.status === "published" && (
                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        <span className="text-sm font-semibold text-foreground">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted">إكمال</span>
                        <div className="h-1.5 w-20 rounded-full bg-background">
                          <div
                            className="h-1.5 rounded-full bg-teal-500 transition-all duration-500"
                            style={{ width: `${course.completionRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground">{course.completionRate}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
