# UIP Database Atlas — هيكلة الملفات الجديدة

نفس المشروع بالظبط، بنفس الشكل والوظائف، لكن بعد تقسيم الملفات الأربعة الضخمة
(`index.html` + `style.css` 958 سطر + `schema-data.js` 5389 سطر + `script.js` 2551 سطر)
لملفات صغيرة منظمة حسب الوظيفة، عشان تقدر تفتح أي ملف وتعدّل فيه بسرعة من غير ما تدور
في آلاف الأسطر.

**التقسيم اتعمل بدقة 100%:** كل ملف مقسّم اتقارن بالأصل حرفيًا (byte-for-byte) بعد إعادة
تجميعه، وبيانات الجداول اتعمللها deep-equality check. مفيش أي كود اتغيّر أو اتحذف —
بس اتنقل لمكانه المنطقي.

## شجرة الملفات

```
index.html
assets/
  logo.png

css/                          (كانت style.css واحد، بقت 12 ملف بنفس ترتيب الأصل)
  base.css                    → المتغيرات العامة والـ reset
  theme-light.css             → الثيم الفاتح
  topbar.css                  → الشريط العلوي
  sidebar.css                 → الشريط الجانبي
  canvas.css                  → منطقة الرسم (الكانفاس/الـ ERD)
  floating-panels.css         → اللوحات العائمة (legend / minimap)
  details-panel.css           → لوحة تفاصيل الجدول
  module-navigator.css        → متصفح الموديولات
  mapping-view.css            → عرض خريطة قاعدة البيانات
  responsive-a11y-misc.css    → التجاوب + إمكانية الوصول + breadcrumbs + skeleton
  context-menu.css            → القائمة السياقية
  command-palette.css         → لوحة الأوامر (Ctrl+K)

js/
  data/                       (كانت schema-data.js واحد، بقت مقسّمة حسب الموديول)
    schema-meta.js            → order / modules / moduleIcons / moduleColors
    tables/
      auth.js                 → جداول Authentication & Access
      people.js                → جداول People & Profiles
      projects.js              → جداول Projects & Portfolio
      ai-engine.js              → جداول AI Engine
      messaging.js              → جداول Messaging & Notifications
      analytics.js              → جداول Analytics & Reports
      security.js                → جداول Security & Audit
      settings.js                 → جداول Settings & System

  core/
    state-and-helpers.js      → الأيقونات، الثيم، state العام، علاقات FK
    layout.js                 → حساب أماكن الكروت والمجموعات
    theme.js                  → تبديل الثيم (فاتح/غامق)

  render/
    erd-render.js             → رسم الكروت والمجموعات والوصلات
    erd-interactions.js       → drag / pan / zoom / tooltips
    minimap.js                → الخريطة المصغّرة لعرض الـ ERD
    mapping-view.js           → عرض خريطة قاعدة البيانات (Database Mapping)

  features/
    focus-mode.js             → Smart Focus Mode
    sidebar-search-stats.js   → البحث + متصفح الموديولات + الإحصائيات
    details-panel.js          → لوحة SQL / CREATE TABLE
    legend.js                 → مفتاح الألوان
    export.js                 → تصدير PNG/SVG/PDF/JSON/Mermaid/PlantUML/Draw.io

  ui/
    context-menu.js           → القائمة السياقية
    command-palette.js        → لوحة الأوامر
    keyboard-shortcuts.js      → اختصارات الكيبورد
    panels-resize.js          → سحب/تغيير حجم اللوحات العائمة

  main.js                     → دالة init() ونداء تشغيل التطبيق
```

## قواعد مهمة قبل ما تعدّل

1. **ترتيب تحميل ملفات الـ `<script>` في `index.html` مهم جدًا.**
   الملفات دي مفيهاش أي module system (كلها `var`/`const`/`function` عامة زي
   الأصل بالظبط)، فلازم تتحمّل بنفس الترتيب الموجود في `index.html` عشان أي
   ملف يعتمد على متغيرات/دوال اتعرّفت في ملف قبله (زي `SCHEMA` اللي لازم يتحمّل
   من `js/data/*` قبل أي حاجة تانية).
2. لو هتضيف جدول جديد للـ schema، ضيفه في ملف الموديول بتاعه جوه
   `js/data/tables/*.js` (أو أضف موديول جديد وملف جديد + سطر `<script>` جديد في
   `index.html`).
3. لو هتضيف فيتشر جديد، اعمله في ملف جديد جوه `js/features/` أو `js/ui/` حسب
   نوعه، وضيف سطر `<script src="...">` ليه في آخر قائمة السكريبتات في
   `index.html` (أو في مكانه المنطقي لو بيعتمد على حاجة معينة).
4. نفس الكلام على الـ CSS: أي ستايلات جديدة حطها في الملف المناسب أو ملف جديد،
   وضيف `<link>` ليه بنفس الترتيب.

## طريقة التشغيل

المشروع HTML/CSS/JS عادي بدون build step — افتح `index.html` مباشرة في المتصفح،
أو شغّل سيرفر محلي بسيط زي:

```
python3 -m http.server 8000
```

وافتح `http://localhost:8000/`.
