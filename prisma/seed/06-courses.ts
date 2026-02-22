import type { PrismaClient } from "@prisma/client";

// ---------- Course definition type ----------
interface CourseDef {
  courseCode: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  credits: number;
  hours: number;
  level: number;
}

// ---------- All course definitions by department prefix ----------
const courseDefs: Record<string, CourseDef[]> = {
  "dept-cs": [
    { courseCode: "CS101", nameAr: "مقدمة في الحاسب", nameEn: "Introduction to Computing", descriptionAr: "أساسيات علوم الحاسب والمفاهيم الأساسية", descriptionEn: "Fundamentals of computer science and basic concepts", credits: 3, hours: 3, level: 1 },
    { courseCode: "CS102", nameAr: "مبادئ البرمجة", nameEn: "Programming Principles", descriptionAr: "أساسيات البرمجة باستخدام لغة عالية المستوى", descriptionEn: "Programming fundamentals using a high-level language", credits: 3, hours: 3, level: 1 },
    { courseCode: "CS103", nameAr: "رياضيات الحاسب", nameEn: "Computer Mathematics", descriptionAr: "الرياضيات المنفصلة والمنطق الرياضي للحاسب", descriptionEn: "Discrete mathematics and mathematical logic for computing", credits: 3, hours: 3, level: 1 },
    { courseCode: "CS201", nameAr: "هياكل البيانات", nameEn: "Data Structures", descriptionAr: "دراسة هياكل البيانات الأساسية والخوارزميات", descriptionEn: "Study of fundamental data structures and algorithms", credits: 3, hours: 3, level: 2 },
    { courseCode: "CS202", nameAr: "نظم تشغيل", nameEn: "Operating Systems", descriptionAr: "مبادئ نظم التشغيل وإدارة الموارد", descriptionEn: "Operating system principles and resource management", credits: 3, hours: 3, level: 2 },
    { courseCode: "CS203", nameAr: "البرمجة الكائنية", nameEn: "Object-Oriented Programming", descriptionAr: "البرمجة الكائنية التوجه وتطبيقاتها", descriptionEn: "Object-oriented programming concepts and applications", credits: 3, hours: 3, level: 2 },
    { courseCode: "CS301", nameAr: "برمجة الويب المتقدمة", nameEn: "Advanced Web Programming", descriptionAr: "تقنيات تطوير تطبيقات الويب المتقدمة", descriptionEn: "Advanced web application development techniques", credits: 3, hours: 3, level: 3 },
    { courseCode: "CS302", nameAr: "قواعد البيانات", nameEn: "Database Systems", descriptionAr: "تصميم وإدارة قواعد البيانات العلائقية", descriptionEn: "Design and management of relational database systems", credits: 3, hours: 3, level: 3 },
    { courseCode: "CS303", nameAr: "شبكات الحاسب", nameEn: "Computer Networks", descriptionAr: "أساسيات الشبكات والبروتوكولات", descriptionEn: "Networking fundamentals and protocols", credits: 3, hours: 3, level: 3 },
    { courseCode: "CS304", nameAr: "هندسة البرمجيات", nameEn: "Software Engineering", descriptionAr: "منهجيات تطوير البرمجيات ودورة حياة المشروع", descriptionEn: "Software development methodologies and project lifecycle", credits: 2, hours: 2, level: 3 },
    { courseCode: "CS401", nameAr: "مشروع التخرج", nameEn: "Graduation Project", descriptionAr: "مشروع تطبيقي شامل في مجال الحاسب", descriptionEn: "Comprehensive applied project in computer science", credits: 4, hours: 4, level: 4 },
    { courseCode: "CS402", nameAr: "التدريب العملي", nameEn: "Practical Training", descriptionAr: "تدريب ميداني في بيئة العمل الحقيقية", descriptionEn: "On-the-job field training in a real work environment", credits: 4, hours: 4, level: 4 },
  ],
  "dept-ee": [
    { courseCode: "EE101", nameAr: "أساسيات الكهرباء", nameEn: "Fundamentals of Electricity", descriptionAr: "المفاهيم الأساسية في الهندسة الكهربائية", descriptionEn: "Basic concepts in electrical engineering", credits: 3, hours: 3, level: 1 },
    { courseCode: "EE102", nameAr: "دوائر كهربائية", nameEn: "Electric Circuits", descriptionAr: "تحليل الدوائر الكهربائية ومكوناتها", descriptionEn: "Analysis of electric circuits and their components", credits: 3, hours: 3, level: 1 },
    { courseCode: "EE103", nameAr: "رسم هندسي كهربائي", nameEn: "Electrical Engineering Drawing", descriptionAr: "قراءة وإعداد المخططات الكهربائية", descriptionEn: "Reading and preparing electrical schematics", credits: 2, hours: 2, level: 1 },
    { courseCode: "EE201", nameAr: "إلكترونيات", nameEn: "Electronics", descriptionAr: "أساسيات الإلكترونيات والعناصر الإلكترونية", descriptionEn: "Electronics fundamentals and electronic components", credits: 3, hours: 3, level: 2 },
    { courseCode: "EE202", nameAr: "تحكم آلي", nameEn: "Automatic Control", descriptionAr: "نظرية التحكم الآلي والأنظمة المتحكمة", descriptionEn: "Automatic control theory and controlled systems", credits: 3, hours: 3, level: 2 },
    { courseCode: "EE203", nameAr: "آلات كهربائية", nameEn: "Electrical Machines", descriptionAr: "دراسة المحركات والمولدات الكهربائية", descriptionEn: "Study of electric motors and generators", credits: 3, hours: 3, level: 2 },
    { courseCode: "EE301", nameAr: "قوى كهربائية", nameEn: "Electrical Power", descriptionAr: "أنظمة توليد ونقل وتوزيع الطاقة الكهربائية", descriptionEn: "Electrical power generation, transmission, and distribution", credits: 3, hours: 3, level: 3 },
    { courseCode: "EE302", nameAr: "أجهزة قياس", nameEn: "Measuring Instruments", descriptionAr: "أجهزة القياس الكهربائية والإلكترونية", descriptionEn: "Electrical and electronic measuring instruments", credits: 3, hours: 3, level: 3 },
    { courseCode: "EE303", nameAr: "تمديدات كهربائية", nameEn: "Electrical Installations", descriptionAr: "تصميم وتنفيذ التمديدات الكهربائية", descriptionEn: "Design and implementation of electrical installations", credits: 3, hours: 3, level: 3 },
    { courseCode: "EE304", nameAr: "الطاقة المتجددة", nameEn: "Renewable Energy", descriptionAr: "مصادر الطاقة المتجددة وتطبيقاتها", descriptionEn: "Renewable energy sources and their applications", credits: 2, hours: 2, level: 3 },
    { courseCode: "EE401", nameAr: "مشروع التخرج", nameEn: "Graduation Project", descriptionAr: "مشروع تطبيقي شامل في مجال الكهرباء", descriptionEn: "Comprehensive applied project in electrical engineering", credits: 4, hours: 4, level: 4 },
    { courseCode: "EE402", nameAr: "التدريب العملي", nameEn: "Practical Training", descriptionAr: "تدريب ميداني في بيئة العمل الحقيقية", descriptionEn: "On-the-job field training in a real work environment", credits: 4, hours: 4, level: 4 },
  ],
  "dept-me": [
    { courseCode: "ME101", nameAr: "أساسيات الميكانيكا", nameEn: "Fundamentals of Mechanics", descriptionAr: "المبادئ الأساسية في الهندسة الميكانيكية", descriptionEn: "Fundamental principles in mechanical engineering", credits: 3, hours: 3, level: 1 },
    { courseCode: "ME102", nameAr: "رسم هندسي ميكانيكي", nameEn: "Mechanical Engineering Drawing", descriptionAr: "قراءة وإعداد الرسومات الميكانيكية", descriptionEn: "Reading and preparing mechanical drawings", credits: 2, hours: 2, level: 1 },
    { courseCode: "ME103", nameAr: "علم المواد", nameEn: "Materials Science", descriptionAr: "خصائص المواد الهندسية واستخداماتها", descriptionEn: "Properties of engineering materials and their uses", credits: 3, hours: 3, level: 1 },
    { courseCode: "ME201", nameAr: "ديناميكا حرارية", nameEn: "Thermodynamics", descriptionAr: "مبادئ الديناميكا الحرارية وتطبيقاتها", descriptionEn: "Thermodynamics principles and applications", credits: 3, hours: 3, level: 2 },
    { courseCode: "ME202", nameAr: "ميكانيكا الموائع", nameEn: "Fluid Mechanics", descriptionAr: "سلوك الموائع وتطبيقاتها الهندسية", descriptionEn: "Fluid behavior and engineering applications", credits: 3, hours: 3, level: 2 },
    { courseCode: "ME203", nameAr: "تشكيل المعادن", nameEn: "Metal Forming", descriptionAr: "عمليات تشكيل المعادن وتقنياتها", descriptionEn: "Metal forming processes and techniques", credits: 3, hours: 3, level: 2 },
    { courseCode: "ME301", nameAr: "تصميم ماكينات", nameEn: "Machine Design", descriptionAr: "أسس تصميم الآلات والعناصر الميكانيكية", descriptionEn: "Fundamentals of machine and mechanical element design", credits: 3, hours: 3, level: 3 },
    { courseCode: "ME302", nameAr: "أنظمة تبريد وتكييف", nameEn: "Refrigeration & Air Conditioning", descriptionAr: "أنظمة التبريد والتكييف وصيانتها", descriptionEn: "Refrigeration and air conditioning systems and maintenance", credits: 3, hours: 3, level: 3 },
    { courseCode: "ME303", nameAr: "صيانة صناعية", nameEn: "Industrial Maintenance", descriptionAr: "إدارة وتنفيذ الصيانة الصناعية", descriptionEn: "Industrial maintenance management and implementation", credits: 3, hours: 3, level: 3 },
    { courseCode: "ME304", nameAr: "التصنيع بالحاسب CNC", nameEn: "CNC Manufacturing", descriptionAr: "التصنيع باستخدام الحاسب والآلات المبرمجة", descriptionEn: "Computer-aided manufacturing and CNC machines", credits: 2, hours: 2, level: 3 },
    { courseCode: "ME401", nameAr: "مشروع التخرج", nameEn: "Graduation Project", descriptionAr: "مشروع تطبيقي شامل في مجال الميكانيكا", descriptionEn: "Comprehensive applied project in mechanical engineering", credits: 4, hours: 4, level: 4 },
    { courseCode: "ME402", nameAr: "التدريب العملي", nameEn: "Practical Training", descriptionAr: "تدريب ميداني في بيئة العمل الحقيقية", descriptionEn: "On-the-job field training in a real work environment", credits: 4, hours: 4, level: 4 },
  ],
  "dept-ba": [
    { courseCode: "BA101", nameAr: "مبادئ الإدارة", nameEn: "Principles of Management", descriptionAr: "أساسيات الإدارة والتخطيط والتنظيم", descriptionEn: "Fundamentals of management, planning, and organization", credits: 3, hours: 3, level: 1 },
    { courseCode: "BA102", nameAr: "مبادئ المحاسبة", nameEn: "Principles of Accounting", descriptionAr: "أساسيات المحاسبة المالية والقيود المحاسبية", descriptionEn: "Financial accounting fundamentals and journal entries", credits: 3, hours: 3, level: 1 },
    { courseCode: "BA103", nameAr: "مبادئ الاقتصاد", nameEn: "Principles of Economics", descriptionAr: "المفاهيم الأساسية في الاقتصاد الجزئي والكلي", descriptionEn: "Basic concepts in microeconomics and macroeconomics", credits: 3, hours: 3, level: 1 },
    { courseCode: "BA201", nameAr: "إدارة الموارد البشرية", nameEn: "Human Resource Management", descriptionAr: "إدارة وتطوير الموارد البشرية في المنظمات", descriptionEn: "Managing and developing human resources in organizations", credits: 3, hours: 3, level: 2 },
    { courseCode: "BA202", nameAr: "إدارة التسويق", nameEn: "Marketing Management", descriptionAr: "استراتيجيات التسويق وتحليل السوق", descriptionEn: "Marketing strategies and market analysis", credits: 3, hours: 3, level: 2 },
    { courseCode: "BA203", nameAr: "محاسبة التكاليف", nameEn: "Cost Accounting", descriptionAr: "نظم محاسبة التكاليف والتحليل المالي", descriptionEn: "Cost accounting systems and financial analysis", credits: 3, hours: 3, level: 2 },
    { courseCode: "BA301", nameAr: "إدارة المشاريع", nameEn: "Project Management", descriptionAr: "تخطيط وتنفيذ ومتابعة المشاريع", descriptionEn: "Project planning, execution, and monitoring", credits: 3, hours: 3, level: 3 },
    { courseCode: "BA302", nameAr: "إدارة العمليات", nameEn: "Operations Management", descriptionAr: "إدارة عمليات الإنتاج وسلاسل الإمداد", descriptionEn: "Production operations and supply chain management", credits: 3, hours: 3, level: 3 },
    { courseCode: "BA303", nameAr: "ريادة الأعمال", nameEn: "Entrepreneurship", descriptionAr: "أساسيات ريادة الأعمال وتأسيس المشاريع", descriptionEn: "Entrepreneurship fundamentals and venture creation", credits: 2, hours: 2, level: 3 },
    { courseCode: "BA304", nameAr: "نظم المعلومات الإدارية", nameEn: "Management Information Systems", descriptionAr: "نظم المعلومات ودورها في اتخاذ القرار", descriptionEn: "Information systems and their role in decision making", credits: 3, hours: 3, level: 3 },
    { courseCode: "BA401", nameAr: "مشروع التخرج", nameEn: "Graduation Project", descriptionAr: "مشروع تطبيقي شامل في إدارة الأعمال", descriptionEn: "Comprehensive applied project in business administration", credits: 4, hours: 4, level: 4 },
    { courseCode: "BA402", nameAr: "التدريب العملي", nameEn: "Practical Training", descriptionAr: "تدريب ميداني في بيئة العمل الحقيقية", descriptionEn: "On-the-job field training in a real work environment", credits: 4, hours: 4, level: 4 },
  ],
  "dept-em": [
    { courseCode: "EM101", nameAr: "مبادئ التسويق الرقمي", nameEn: "Digital Marketing Principles", descriptionAr: "أساسيات التسويق الإلكتروني والرقمي", descriptionEn: "Fundamentals of electronic and digital marketing", credits: 3, hours: 3, level: 1 },
    { courseCode: "EM102", nameAr: "التجارة الإلكترونية", nameEn: "E-Commerce", descriptionAr: "مفاهيم التجارة الإلكترونية ونماذج الأعمال", descriptionEn: "E-commerce concepts and business models", credits: 3, hours: 3, level: 1 },
    { courseCode: "EM103", nameAr: "أساسيات تصميم المواقع", nameEn: "Website Design Basics", descriptionAr: "تصميم وبناء المواقع الإلكترونية الأساسية", descriptionEn: "Designing and building basic websites", credits: 3, hours: 3, level: 1 },
    { courseCode: "EM201", nameAr: "تسويق محركات البحث", nameEn: "Search Engine Marketing", descriptionAr: "تحسين محركات البحث والإعلانات المدفوعة", descriptionEn: "SEO and paid search advertising", credits: 3, hours: 3, level: 2 },
    { courseCode: "EM202", nameAr: "تسويق وسائل التواصل", nameEn: "Social Media Marketing", descriptionAr: "استراتيجيات التسويق عبر وسائل التواصل الاجتماعي", descriptionEn: "Social media marketing strategies", credits: 3, hours: 3, level: 2 },
    { courseCode: "EM203", nameAr: "صناعة المحتوى الرقمي", nameEn: "Digital Content Creation", descriptionAr: "إنشاء وإدارة المحتوى الرقمي التسويقي", descriptionEn: "Creating and managing digital marketing content", credits: 3, hours: 3, level: 2 },
    { courseCode: "EM301", nameAr: "تحليلات التسويق الرقمي", nameEn: "Digital Marketing Analytics", descriptionAr: "تحليل البيانات التسويقية وقياس الأداء", descriptionEn: "Marketing data analysis and performance measurement", credits: 3, hours: 3, level: 3 },
    { courseCode: "EM302", nameAr: "التسويق بالبريد الإلكتروني", nameEn: "Email Marketing", descriptionAr: "استراتيجيات التسويق عبر البريد الإلكتروني", descriptionEn: "Email marketing strategies and campaigns", credits: 2, hours: 2, level: 3 },
    { courseCode: "EM303", nameAr: "إدارة الحملات الإعلانية", nameEn: "Advertising Campaign Management", descriptionAr: "تخطيط وإدارة الحملات الإعلانية الرقمية", descriptionEn: "Planning and managing digital advertising campaigns", credits: 3, hours: 3, level: 3 },
    { courseCode: "EM304", nameAr: "تسويق التطبيقات", nameEn: "App Marketing", descriptionAr: "تسويق التطبيقات الذكية واستراتيجيات النمو", descriptionEn: "Mobile app marketing and growth strategies", credits: 2, hours: 2, level: 3 },
    { courseCode: "EM401", nameAr: "مشروع التخرج", nameEn: "Graduation Project", descriptionAr: "مشروع تطبيقي شامل في التسويق الإلكتروني", descriptionEn: "Comprehensive applied project in e-marketing", credits: 4, hours: 4, level: 4 },
    { courseCode: "EM402", nameAr: "التدريب العملي", nameEn: "Practical Training", descriptionAr: "تدريب ميداني في بيئة العمل الحقيقية", descriptionEn: "On-the-job field training in a real work environment", credits: 4, hours: 4, level: 4 },
  ],
  "dept-wd": [
    { courseCode: "WD101", nameAr: "أساسيات تطوير الويب", nameEn: "Web Development Basics", descriptionAr: "أساسيات HTML و CSS وبناء الصفحات", descriptionEn: "HTML, CSS fundamentals and page building", credits: 3, hours: 3, level: 1 },
    { courseCode: "WD102", nameAr: "البرمجة بلغة جافاسكربت", nameEn: "JavaScript Programming", descriptionAr: "أساسيات البرمجة بلغة جافاسكربت", descriptionEn: "JavaScript programming fundamentals", credits: 3, hours: 3, level: 1 },
    { courseCode: "WD103", nameAr: "تصميم واجهات المستخدم", nameEn: "UI Design", descriptionAr: "مبادئ تصميم واجهات المستخدم وتجربة المستخدم", descriptionEn: "UI/UX design principles", credits: 3, hours: 3, level: 1 },
    { courseCode: "WD201", nameAr: "تطوير تطبيقات الويب", nameEn: "Web Application Development", descriptionAr: "بناء تطبيقات الويب باستخدام أطر العمل الحديثة", descriptionEn: "Building web apps with modern frameworks", credits: 3, hours: 3, level: 2 },
    { courseCode: "WD202", nameAr: "برمجة الخادم", nameEn: "Server-Side Programming", descriptionAr: "برمجة جانب الخادم باستخدام Node.js", descriptionEn: "Server-side programming with Node.js", credits: 3, hours: 3, level: 2 },
    { courseCode: "WD203", nameAr: "قواعد بيانات الويب", nameEn: "Web Databases", descriptionAr: "تصميم وإدارة قواعد البيانات لتطبيقات الويب", descriptionEn: "Database design and management for web applications", credits: 3, hours: 3, level: 2 },
    { courseCode: "WD301", nameAr: "تطوير الواجهات المتقدم", nameEn: "Advanced Frontend Development", descriptionAr: "تطوير واجهات متقدمة باستخدام React", descriptionEn: "Advanced frontend development with React", credits: 3, hours: 3, level: 3 },
    { courseCode: "WD302", nameAr: "واجهات برمجة التطبيقات", nameEn: "API Development", descriptionAr: "تصميم وبناء واجهات برمجة التطبيقات REST و GraphQL", descriptionEn: "Designing and building REST and GraphQL APIs", credits: 3, hours: 3, level: 3 },
    { courseCode: "WD303", nameAr: "تطوير تطبيقات الجوال", nameEn: "Mobile App Development", descriptionAr: "تطوير تطبيقات الجوال بالتقنيات الحديثة", descriptionEn: "Mobile app development with modern technologies", credits: 3, hours: 3, level: 3 },
    { courseCode: "WD304", nameAr: "DevOps وإدارة السحابة", nameEn: "DevOps & Cloud Management", descriptionAr: "إدارة البنية التحتية السحابية والنشر المستمر", descriptionEn: "Cloud infrastructure management and continuous deployment", credits: 2, hours: 2, level: 3 },
    { courseCode: "WD401", nameAr: "مشروع التخرج", nameEn: "Graduation Project", descriptionAr: "مشروع تطبيقي شامل في تطوير الويب", descriptionEn: "Comprehensive applied project in web development", credits: 4, hours: 4, level: 4 },
    { courseCode: "WD402", nameAr: "التدريب العملي", nameEn: "Practical Training", descriptionAr: "تدريب ميداني في بيئة العمل الحقيقية", descriptionEn: "On-the-job field training in a real work environment", credits: 4, hours: 4, level: 4 },
  ],
  "dept-cy": [
    { courseCode: "CY101", nameAr: "أساسيات أمن المعلومات", nameEn: "Information Security Fundamentals", descriptionAr: "المفاهيم الأساسية في أمن المعلومات والحماية", descriptionEn: "Basic concepts in information security and protection", credits: 3, hours: 3, level: 1 },
    { courseCode: "CY102", nameAr: "أساسيات الشبكات", nameEn: "Networking Fundamentals", descriptionAr: "أساسيات شبكات الحاسب والبروتوكولات", descriptionEn: "Computer networking fundamentals and protocols", credits: 3, hours: 3, level: 1 },
    { courseCode: "CY103", nameAr: "أنظمة التشغيل للأمن", nameEn: "Operating Systems for Security", descriptionAr: "نظم التشغيل من منظور أمني (Linux/Windows)", descriptionEn: "Operating systems from a security perspective (Linux/Windows)", credits: 3, hours: 3, level: 1 },
    { courseCode: "CY201", nameAr: "أمن الشبكات", nameEn: "Network Security", descriptionAr: "تقنيات حماية الشبكات والجدران النارية", descriptionEn: "Network protection techniques and firewalls", credits: 3, hours: 3, level: 2 },
    { courseCode: "CY202", nameAr: "التشفير والتوثيق", nameEn: "Cryptography & Authentication", descriptionAr: "خوارزميات التشفير وبروتوكولات التوثيق", descriptionEn: "Encryption algorithms and authentication protocols", credits: 3, hours: 3, level: 2 },
    { courseCode: "CY203", nameAr: "أمن تطبيقات الويب", nameEn: "Web Application Security", descriptionAr: "اختبار واكتشاف ثغرات تطبيقات الويب", descriptionEn: "Testing and discovering web application vulnerabilities", credits: 3, hours: 3, level: 2 },
    { courseCode: "CY301", nameAr: "اختبار الاختراق", nameEn: "Penetration Testing", descriptionAr: "منهجيات وأدوات اختبار الاختراق الأخلاقي", descriptionEn: "Ethical penetration testing methodologies and tools", credits: 3, hours: 3, level: 3 },
    { courseCode: "CY302", nameAr: "التحقيق الجنائي الرقمي", nameEn: "Digital Forensics", descriptionAr: "تقنيات التحقيق الجنائي الرقمي وتحليل الأدلة", descriptionEn: "Digital forensics techniques and evidence analysis", credits: 3, hours: 3, level: 3 },
    { courseCode: "CY303", nameAr: "إدارة المخاطر السيبرانية", nameEn: "Cyber Risk Management", descriptionAr: "تقييم وإدارة المخاطر السيبرانية والامتثال", descriptionEn: "Cyber risk assessment, management, and compliance", credits: 3, hours: 3, level: 3 },
    { courseCode: "CY304", nameAr: "أمن الحوسبة السحابية", nameEn: "Cloud Security", descriptionAr: "أمن البيئات السحابية والخدمات المستضافة", descriptionEn: "Security of cloud environments and hosted services", credits: 2, hours: 2, level: 3 },
    { courseCode: "CY401", nameAr: "مشروع التخرج", nameEn: "Graduation Project", descriptionAr: "مشروع تطبيقي شامل في الأمن السيبراني", descriptionEn: "Comprehensive applied project in cybersecurity", credits: 4, hours: 4, level: 4 },
    { courseCode: "CY402", nameAr: "التدريب العملي", nameEn: "Practical Training", descriptionAr: "تدريب ميداني في بيئة العمل الحقيقية", descriptionEn: "On-the-job field training in a real work environment", credits: 4, hours: 4, level: 4 },
  ],
  "dept-gd": [
    { courseCode: "GD101", nameAr: "أساسيات التصميم", nameEn: "Design Fundamentals", descriptionAr: "مبادئ التصميم والألوان والتكوين", descriptionEn: "Design principles, colors, and composition", credits: 3, hours: 3, level: 1 },
    { courseCode: "GD102", nameAr: "التصميم بالحاسب", nameEn: "Computer-Aided Design", descriptionAr: "استخدام برامج التصميم الأساسية", descriptionEn: "Using basic design software tools", credits: 3, hours: 3, level: 1 },
    { courseCode: "GD103", nameAr: "الرسم والتخطيط", nameEn: "Drawing & Sketching", descriptionAr: "مهارات الرسم اليدوي والتخطيط الأولي", descriptionEn: "Hand drawing and preliminary sketching skills", credits: 2, hours: 2, level: 1 },
    { courseCode: "GD201", nameAr: "تصميم الهوية البصرية", nameEn: "Visual Identity Design", descriptionAr: "تصميم الشعارات والهوية البصرية للمؤسسات", descriptionEn: "Logo and visual identity design for organizations", credits: 3, hours: 3, level: 2 },
    { courseCode: "GD202", nameAr: "التصوير الفوتوغرافي", nameEn: "Photography", descriptionAr: "أساسيات التصوير الفوتوغرافي ومعالجة الصور", descriptionEn: "Photography basics and image processing", credits: 3, hours: 3, level: 2 },
    { courseCode: "GD203", nameAr: "تصميم المطبوعات", nameEn: "Print Design", descriptionAr: "تصميم المطبوعات والإعلانات المرئية", descriptionEn: "Print and visual advertising design", credits: 3, hours: 3, level: 2 },
    { courseCode: "GD301", nameAr: "تصميم الموشن جرافيك", nameEn: "Motion Graphics", descriptionAr: "إنتاج الرسوم المتحركة والموشن جرافيك", descriptionEn: "Motion graphics and animation production", credits: 3, hours: 3, level: 3 },
    { courseCode: "GD302", nameAr: "تصميم واجهات التطبيقات", nameEn: "App UI Design", descriptionAr: "تصميم واجهات المستخدم للتطبيقات والمواقع", descriptionEn: "User interface design for apps and websites", credits: 3, hours: 3, level: 3 },
    { courseCode: "GD303", nameAr: "إنتاج الفيديو", nameEn: "Video Production", descriptionAr: "تصوير ومونتاج وإنتاج الفيديو", descriptionEn: "Video filming, editing, and production", credits: 3, hours: 3, level: 3 },
    { courseCode: "GD304", nameAr: "التصميم ثلاثي الأبعاد", nameEn: "3D Design", descriptionAr: "النمذجة والتصميم ثلاثي الأبعاد", descriptionEn: "3D modeling and design", credits: 2, hours: 2, level: 3 },
    { courseCode: "GD401", nameAr: "مشروع التخرج", nameEn: "Graduation Project", descriptionAr: "مشروع تطبيقي شامل في التصميم الجرافيكي", descriptionEn: "Comprehensive applied project in graphic design", credits: 4, hours: 4, level: 4 },
    { courseCode: "GD402", nameAr: "التدريب العملي", nameEn: "Practical Training", descriptionAr: "تدريب ميداني في بيئة العمل الحقيقية", descriptionEn: "On-the-job field training in a real work environment", credits: 4, hours: 4, level: 4 },
  ],
  "dept-ac": [
    { courseCode: "AC101", nameAr: "مبادئ المحاسبة المالية", nameEn: "Financial Accounting Principles", descriptionAr: "أساسيات المحاسبة المالية والدورة المحاسبية", descriptionEn: "Financial accounting fundamentals and the accounting cycle", credits: 3, hours: 3, level: 1 },
    { courseCode: "AC102", nameAr: "الرياضيات المالية", nameEn: "Financial Mathematics", descriptionAr: "التطبيقات الرياضية في المجال المالي والمحاسبي", descriptionEn: "Mathematical applications in finance and accounting", credits: 3, hours: 3, level: 1 },
    { courseCode: "AC103", nameAr: "مبادئ الاقتصاد المالي", nameEn: "Financial Economics Principles", descriptionAr: "المفاهيم الاقتصادية المرتبطة بالمحاسبة والمالية", descriptionEn: "Economic concepts related to accounting and finance", credits: 3, hours: 3, level: 1 },
    { courseCode: "AC201", nameAr: "محاسبة متوسطة", nameEn: "Intermediate Accounting", descriptionAr: "معالجة محاسبية متقدمة للعمليات المالية", descriptionEn: "Advanced accounting treatment of financial operations", credits: 3, hours: 3, level: 2 },
    { courseCode: "AC202", nameAr: "محاسبة التكاليف", nameEn: "Cost Accounting", descriptionAr: "نظم تكاليف وتحليل التكلفة والعائد", descriptionEn: "Cost systems and cost-benefit analysis", credits: 3, hours: 3, level: 2 },
    { courseCode: "AC203", nameAr: "النظام المحاسبي الموحد", nameEn: "Unified Accounting System", descriptionAr: "تطبيقات النظام المحاسبي الحكومي الموحد", descriptionEn: "Government unified accounting system applications", credits: 3, hours: 3, level: 2 },
    { courseCode: "AC301", nameAr: "المراجعة والتدقيق", nameEn: "Auditing", descriptionAr: "معايير وإجراءات المراجعة والتدقيق المحاسبي", descriptionEn: "Auditing standards and accounting review procedures", credits: 3, hours: 3, level: 3 },
    { courseCode: "AC302", nameAr: "المحاسبة الحكومية", nameEn: "Government Accounting", descriptionAr: "نظم المحاسبة في القطاع الحكومي السعودي", descriptionEn: "Accounting systems in the Saudi government sector", credits: 3, hours: 3, level: 3 },
    { courseCode: "AC303", nameAr: "الزكاة والضرائب", nameEn: "Zakat & Taxation", descriptionAr: "أنظمة الزكاة والضرائب في المملكة العربية السعودية", descriptionEn: "Zakat and tax systems in Saudi Arabia", credits: 3, hours: 3, level: 3 },
    { courseCode: "AC304", nameAr: "نظم المعلومات المحاسبية", nameEn: "Accounting Information Systems", descriptionAr: "تصميم وتطبيق نظم المعلومات المحاسبية", descriptionEn: "Design and implementation of accounting information systems", credits: 2, hours: 2, level: 3 },
    { courseCode: "AC401", nameAr: "مشروع التخرج", nameEn: "Graduation Project", descriptionAr: "مشروع تطبيقي شامل في المحاسبة", descriptionEn: "Comprehensive applied project in accounting", credits: 4, hours: 4, level: 4 },
    { courseCode: "AC402", nameAr: "التدريب العملي", nameEn: "Practical Training", descriptionAr: "تدريب ميداني في بيئة العمل الحقيقية", descriptionEn: "On-the-job field training in a real work environment", credits: 4, hours: 4, level: 4 },
  ],
  "dept-os": [
    { courseCode: "OS101", nameAr: "مبادئ السلامة المهنية", nameEn: "Occupational Safety Principles", descriptionAr: "أساسيات السلامة والصحة المهنية", descriptionEn: "Fundamentals of occupational safety and health", credits: 3, hours: 3, level: 1 },
    { courseCode: "OS102", nameAr: "إدارة المخاطر", nameEn: "Risk Management", descriptionAr: "تحديد وتقييم وإدارة المخاطر في بيئة العمل", descriptionEn: "Identifying, assessing, and managing workplace risks", credits: 3, hours: 3, level: 1 },
    { courseCode: "OS103", nameAr: "تشريعات السلامة", nameEn: "Safety Legislation", descriptionAr: "الأنظمة والتشريعات المحلية والدولية للسلامة", descriptionEn: "Local and international safety regulations and legislation", credits: 3, hours: 3, level: 1 },
    { courseCode: "OS201", nameAr: "السلامة من الحريق", nameEn: "Fire Safety", descriptionAr: "أنظمة الوقاية والإطفاء ومكافحة الحريق", descriptionEn: "Fire prevention, suppression, and firefighting systems", credits: 3, hours: 3, level: 2 },
    { courseCode: "OS202", nameAr: "الصحة المهنية", nameEn: "Occupational Health", descriptionAr: "الأمراض المهنية والوقاية منها", descriptionEn: "Occupational diseases and prevention", credits: 3, hours: 3, level: 2 },
    { courseCode: "OS203", nameAr: "السلامة الصناعية", nameEn: "Industrial Safety", descriptionAr: "سلامة المعدات والآلات في البيئات الصناعية", descriptionEn: "Equipment and machinery safety in industrial environments", credits: 3, hours: 3, level: 2 },
    { courseCode: "OS301", nameAr: "الاستجابة للطوارئ", nameEn: "Emergency Response", descriptionAr: "تخطيط وتنفيذ خطط الاستجابة للطوارئ", descriptionEn: "Emergency response planning and implementation", credits: 3, hours: 3, level: 3 },
    { courseCode: "OS302", nameAr: "السلامة البيئية", nameEn: "Environmental Safety", descriptionAr: "حماية البيئة والتعامل مع المواد الخطرة", descriptionEn: "Environmental protection and hazardous materials handling", credits: 3, hours: 3, level: 3 },
    { courseCode: "OS303", nameAr: "تدقيق السلامة", nameEn: "Safety Auditing", descriptionAr: "تقييم وتدقيق أنظمة إدارة السلامة", descriptionEn: "Evaluation and auditing of safety management systems", credits: 3, hours: 3, level: 3 },
    { courseCode: "OS304", nameAr: "بيئة العمل وتصميمها", nameEn: "Ergonomics & Workplace Design", descriptionAr: "تصميم بيئة العمل المريحة والآمنة", descriptionEn: "Ergonomic and safe workplace design", credits: 2, hours: 2, level: 3 },
    { courseCode: "OS401", nameAr: "مشروع التخرج", nameEn: "Graduation Project", descriptionAr: "مشروع تطبيقي شامل في السلامة المهنية", descriptionEn: "Comprehensive applied project in occupational safety", credits: 4, hours: 4, level: 4 },
    { courseCode: "OS402", nameAr: "التدريب العملي", nameEn: "Practical Training", descriptionAr: "تدريب ميداني في بيئة العمل الحقيقية", descriptionEn: "On-the-job field training in a real work environment", credits: 4, hours: 4, level: 4 },
  ],
};

/**
 * Seed 120 courses across 10 departments (~12 per department, levels 1-4).
 * Uses upsert with courseCode as the where clause.
 */
export async function seedCourses(
  prisma: PrismaClient,
  departments: any[]
) {
  console.log("  Seeding 120 courses...");

  const createdCourses: any[] = [];

  for (const dept of departments) {
    const deptCourses = courseDefs[dept.id];
    if (!deptCourses) {
      console.warn(`  No course definitions found for department ${dept.id}, skipping`);
      continue;
    }

    for (const def of deptCourses) {
      const course = await prisma.course.upsert({
        where: { courseCode: def.courseCode },
        update: {},
        create: {
          courseCode: def.courseCode,
          nameAr: def.nameAr,
          nameEn: def.nameEn,
          descriptionAr: def.descriptionAr,
          descriptionEn: def.descriptionEn,
          departmentId: dept.id,
          credits: def.credits,
          hours: def.hours,
          level: def.level,
          isActive: true,
        },
      });
      createdCourses.push(course);
    }
  }

  console.log(`  Created ${createdCourses.length} courses across ${departments.length} departments`);
  return createdCourses;
}
