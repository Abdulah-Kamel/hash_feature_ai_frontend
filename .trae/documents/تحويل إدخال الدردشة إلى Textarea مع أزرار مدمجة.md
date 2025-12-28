## الهدف
- استبدال حقل الإدخال في `ChatInput` بحقل نص متعدد الأسطر (textarea) وتضمين الأزرار داخله كما في التصميم.

## التغييرات المقترحة
- تحديث `src/components/chat/ChatInput.jsx`:
  - حاوية `relative` بعرض كامل، خلفية `bg-card`, حدود وفق الثيم.
  - عنصر `textarea` مع:
    - `className="w-full resize-none min-h-12 max-h-40 rounded-xl bg-transparent p-3 pr-28"` لضبط المساحة الجانبية للأزرار.
    - `rows` أولية 1–2 مع تمدد تلقائي عند الكتابة (auto-resize) عبر `ref` و`onInput`.
    - `placeholder="اكتب هنا"` واتجاه RTL تلقائي.
    - دعم اختصارات: `Enter` للإرسال، `Shift+Enter` لسطر جديد.
  - مجموعة الأزرار داخل الحقل (موضوعة `absolute` يمين/أسفل داخليًا):
    - زر مشبك `Paperclip`، زر ميكروفون `Mic`, زر إرسال `Send`.
    - أحجام مستديرة ومتناسقة: `size="icon"`, `className="rounded-full"`.
    - ترتيب أفقي مع فجوة صغيرة: `flex items-center gap-1 absolute bottom-2 right-2`، وفي الشاشات الصغيرة `right-2`, الكبيرة `right-3`.
- منطق التمدد الذكي:
  - دالة `autoGrow(el)` لتعيين `el.style.height = 'auto'` ثم `el.style.height = el.scrollHeight + 'px'`.
  - استدعاءها في `useEffect` عند تغيّر `value`.
- سلوك الإرسال:
  - زر `Send` يستدعي `onSend()`.
  - عند الضغط `Enter` بدون `Shift` يتم منع الافتراضي وإرسال.
- إمكانية الوصول:
  - `aria-label="إدخال رسالة"`.
  - أزرار لها `aria-label` واضحة.

## عدم إضافة مكتبات جديدة
- سنستخدم عناصر HTML وTailwind فقط، دون إضافة shadcn textarea.

## قابلية الصيانة
- يبقى `ChatInput` مكوّنًا تقديميًا يستقبل `value`, `onChange`, `onSend`.
- فصل منطق التمدد في دالة صغيرة داخل المكوّن.

## التحقق
- تشغيل الصفحة `dashboard/chat` ومراجعة:
  - الأزرار داخل الحقل، لا تؤثر على النص.
  - التمدد حتى حد أقصى 160px ثم ظهور تمرير داخل `textarea`.
  - اختصارات لوحة المفاتيح تعمل.

> عند الموافقة سأقوم بتحديث `ChatInput.jsx` وفق الخطة أعلاه وتنفيذ التحقق البصري والوظيفي.