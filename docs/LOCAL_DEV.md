# Saohil1 — Local Development Guide

> بيئة التطوير المحلية المستقلة — مستقلة تماماً عن الموقع المباشر

---

## نظرة عامة

هذا المشروع (`saohil1`) هو نسخة تطوير مستقلة من منصة Campus27، تعمل على:
- **Port**: `3001` (لا تتعارض مع البيئة المباشرة)
- **Database**: PostgreSQL على port `5433` (عبر Docker) أو local على `5432`
- **URL**: http://localhost:3001

---

## الميزات الجديدة في هذه النسخة

### 1. Global Search Command Palette (⌘K)
- اضغط `⌘K` (Mac) أو `Ctrl+K` (Windows/Linux) في أي مكان في لوحة التحكم
- يبحث في: المتدربين، المدربين، المقررات، الأقسام، والصفحات
- نتائج فورية مع debounce 300ms
- تنقل بلوحة المفاتيح: ↑↓ للتنقل، Enter للفتح، Esc للإغلاق

### 2. Micro-Interactions
- **Card hover lift**: البطاقات ترتفع قليلاً عند التمرير
- **Button spring press**: الأزرار تضغط بشكل مرن عند النقر
- **Nav shimmer**: وميض على عنصر التنقل النشط
- **Skeleton shimmer**: تحميل ناعم للمحتوى
- **Page fade-in**: ظهور تدريجي عند تحميل الصفحات
- **Palette animation**: ظهور Command Palette بتأثير spring

---

## طريقة التشغيل

### الطريقة الأولى: Dev Server مباشرة (موصى بها للتطوير)

```bash
# 1. انتقل إلى مجلد المشروع
cd /Users/hossam/Documents/saohil1

# 2. إعداد المتغيرات البيئية
cp .env.local.example .env.local
# ثم عدّل .env.local بقيم قاعدة البيانات

# 3. تشغيل قاعدة البيانات (إذا لم تكن تعمل)
# PostgreSQL يجب أن يعمل على localhost:5432
# DATABASE_URL=postgresql://username:password@localhost:5432/saohil1_dev

# 4. تهيئة قاعدة البيانات
npx prisma migrate dev --name init
npm run db:seed

# 5. تشغيل Dev Server على port 3001
PORT=3001 npm run dev
```

ثم افتح: http://localhost:3001

### الطريقة الثانية: Docker Compose (بيئة معزولة كاملة)

**متطلب**: Docker Desktop يجب أن يكون مشغّلاً

```bash
cd /Users/hossam/Documents/saohil1

# 1. بناء الصورة
docker compose -f docker-compose.dev.yml build

# 2. تشغيل قاعدة البيانات
docker compose -f docker-compose.dev.yml up db -d

# 3. تهيئة قاعدة البيانات (مرة واحدة فقط)
docker compose -f docker-compose.dev.yml --profile migrate up migrator

# 4. تشغيل التطبيق
docker compose -f docker-compose.dev.yml up app -d

# 5. التحقق من التشغيل
curl -I http://localhost:3001
```

#### إيقاف Docker
```bash
docker compose -f docker-compose.dev.yml down
```

#### إيقاف مع حذف قاعدة البيانات
```bash
docker compose -f docker-compose.dev.yml down -v
```

---

## معلومات تسجيل الدخول (للتطوير)

| الدور | البريد الإلكتروني | كلمة المرور |
|-------|-------------------|------------|
| المدير | admin@campus26.sa | 123456 |
| المشرف | supervisor@campus26.sa | 123456 |
| المحاضر | trainer@campus26.sa | 123456 |

---

## المتغيرات البيئية

انسخ `.env.local.example` إلى `.env.local` وعدّل القيم:

```bash
cp .env.local.example .env.local
```

| المتغير | القيمة الافتراضية | الوصف |
|---------|------------------|-------|
| `DATABASE_URL` | postgresql://saohil1:saohil1_dev_pass@localhost:5433/saohil1_dev | رابط قاعدة البيانات |
| `NEXTAUTH_SECRET` | saohil1-local-dev-secret | مفتاح التشفير |
| `NEXTAUTH_URL` | http://localhost:3001 | عنوان التطبيق |
| `ANTHROPIC_API_KEY` | (اختياري) | لتفعيل ميزات AI |

---

## هيكل الملفات المضافة

```
saohil1/
├── docker-compose.dev.yml          # بيئة Docker معزولة (port 3001)
├── .env.local.example              # قالب المتغيرات البيئية
├── docs/
│   ├── LOCAL_DEV.md                # هذا الملف
│   └── plans/
│       └── 2026-02-23-saohil1-dynamic-platform.md
├── src/
│   ├── app/
│   │   ├── api/search/route.ts     # Search API (⌘K)
│   │   └── globals.css             # + Micro-interaction animations
│   ├── components/ui/
│   │   └── command-palette.tsx     # Command Palette component
│   └── stores/
│       └── command-palette-store.ts # Zustand store للـ Command Palette
```

---

## اختبار الميزات الجديدة

### اختبار Command Palette
1. افتح http://localhost:3001 وسجّل دخولك
2. اضغط `⌘K` (Mac) أو `Ctrl+K` (Windows)
3. اكتب اسم متدرب أو مقرر (مثلاً "أحمد" أو "برمجة")
4. تحقق من ظهور النتائج خلال 300ms
5. استخدم ↑↓ للتنقل، Enter للفتح

### اختبار Micro-Interactions
1. مرّر الماوس على بطاقات لوحة التحكم → يجب أن ترتفع قليلاً
2. انقر على أي زر → يجب أن يضغط بشكل مرن
3. لاحظ الوميض (shimmer) على عنصر التنقل النشط في Sidebar

### اختبار Search API مباشرة
```bash
# بدون مصادقة (يجب أن يُرجع 401)
curl http://localhost:3001/api/search?q=test

# مع session cookie (بعد تسجيل الدخول)
curl "http://localhost:3001/api/search?q=ahmed" -H "Cookie: YOUR_SESSION_COOKIE"
```

---

## التحقق من البناء

```bash
# بناء production
npm run build

# يجب أن تظهر:
# ✓ Compiled successfully
# ✓ /api/search (API route جديد)
# ✓ جميع 37 صفحة
```

---

## الفرق عن المشروع الأصلي (saas-s-1)

| | saas-s-1 (الأصلي) | saohil1 (هذا) |
|--|--|--|
| Port | 3000 | **3001** |
| DB Port (Docker) | 5432 | **5433** |
| الاسم | Campus27 | **Saohil1** |
| Command Palette | ❌ | **✅ ⌘K** |
| Search API | ❌ | **✅ /api/search** |
| Micro-Interactions | أساسية | **✅ محسّنة** |
| Docker File | docker-compose.prod.yml | **docker-compose.dev.yml** |

---

## الموقع التسويقي (Marketing Site)

الصفحات الجديدة المضافة في هذه الجلسة:

| الصفحة | العنوان (عربي) | العنوان (إنجليزي) |
|--------|----------------|-------------------|
| الرئيسية | http://localhost:3001/ar/home | http://localhost:3001/en/home |
| الميزات | http://localhost:3001/ar/features | http://localhost:3001/en/features |
| التسعير | http://localhost:3001/ar/pricing | http://localhost:3001/en/pricing |
| تواصل معنا | http://localhost:3001/ar/contact | http://localhost:3001/en/contact |

> لوحة التحكم: http://localhost:3001/ar/dashboard (تتطلب تسجيل دخول)

### المكونات الجديدة

#### مكونات التسويق (`src/components/marketing/`)
- `marketing-navbar.tsx` — شريط التنقل العلوي (scroll-aware، موبايل)
- `marketing-footer.tsx` — تذييل الصفحة
- `hero-section.tsx` — القسم الترحيبي مع mockup عائم
- `stats-banner.tsx` — إحصائيات CountUp
- `features-grid.tsx` — شبكة الميزات الست
- `cta-section.tsx` — قسم الدعوة للعمل

#### أدوات الحركة (`src/components/ui/`)
- `fade-in-section.tsx` — IntersectionObserver fade+slide
- `stagger-children.tsx` — أطفال متتابعين
- `count-up.tsx` — عداد متحرك
- `page-transition.tsx` — انتقال صفحات لوحة التحكم

#### نظام الإشعارات
- `src/stores/toast-store.ts` — Zustand store
- `src/components/ui/toast.tsx` — ToastContainer (global)
- الاستخدام: `useToastStore().add("تم الحفظ!", "success")`
