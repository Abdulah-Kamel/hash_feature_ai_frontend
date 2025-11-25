## الهدف
- بدء تكامل المصادقة باستخدام API الحالي مع هيكلة نظيفة وقابلة للتوسعة.
- البدء بتسجيل الدخول ثم التسجيل (signup) بنفس النمط.

## طبقة التهيئة (Config)
- تعريف المتغيرات:
  - `NEXT_PUBLIC_API_BASE_URL = http://hashplus.eu-4.evennode.com`
  - أسماء الكوكيز (مثلاً `auth_token`, `refresh_token`).
- ملف إعدادات واحد `src/config/api.ts` يُصدّر القيم وخيارات الوقت المستغرق والـ `withCredentials`.

## عميل HTTP (HTTP Client)
- إنشاء غلاف خفيف فوق `fetch` في `src/lib/http.ts`:
  - دوال: `get`, `post`, `put`, `del` تُعيد JSON.
  - توحيد الأخطاء: تحويل أخطاء الشبكة/الحالة إلى كائن موحّد `{ ok, status, data, error }`.
  - دعم مهلة زمنية و`AbortController`.
  - حقن الـ Base URL تلقائيًا.

## خدمة المصادقة (Auth Service)
- ملف `src/services/auth.ts`:
  - `signup(payload)` → POST `/api/v1/auth/signup` بالهيكل:
    ```json
    { "name": "user", "phone": "01096339822", "email": "example@mail.com", "password": "secret" }
    ```
  - `login(payload)` → POST `/api/v1/auth/login` (نفس فلسفة الهيكل؛ نطبّق بعد تزويد الجسم النهائي).
  - `verifyOtp(payload)` إن وُجد، `logout()`، `refresh()` إذا كان مدعومًا.
  - يعيد دائمًا كائنًا موحّدًا `{ ok, data, error }`.

## الإجراءات الخادمية (Server Actions)
- ملف `src/app/(auth)/actions.ts` أو الحفاظ على مكانها الحالي مع توحيد:
  - `handleLogin(formData | dto)` يستدعي `auth.login` ثم يتعامل مع الكوكيز إذا كانت التوكنات تُعاد من الـ API.
  - `handleRegister(dto)` يستدعي `auth.signup` بنفس الطريقة، ويحافظ على التوجيه إلى `/otp` عند النجاح.
- سبب استخدام Server Actions: إخفاء المفاتيح وإدارة الكوكيز بأمان (HttpOnly) إن كانت التوكنات مطلوبة.

## إدارة الحالة والكوكيز
- إذا كان الـ API يعيد JWT:
  - تخزينه في كوكي HttpOnly عبر Server Action (أكثر أمانًا من LocalStorage).
  - توفير `useAuth()` لقراءة الحالة على العميل عبر `me` أو عبر سياق يعتمد على وجود الكوكي.
- إذا كان الـ API يعتمد جلسات/كوكيز خاصة: تفعيل `credentials: 'include'` في الـ Client.

## حماية الصفحات (Middleware)
- ملف `middleware.ts` لفحص وجود كوكي `auth_token` وإعادة توجيه الصفحات المحمية إلى `/login`.
- تعريف مجموعات مسارات محمية بعلامة `matcher`.

## تكامل النماذج (UI Forms)
- تسجيل الدخول:
  - استخدام `react-hook-form` + `zod` للتحقق من صحة البيانات.
  - استدعاء `handleLogin` وإظهار `Spinner` وأخطاء موحّدة.
- التسجيل:
  - الاستمرار في `RegisterForm` مع استبدال الاستدعاء الداخلي ليستخدم `auth.signup` عبر Server Action.
  - إرسال الجسم بالحقول الأربع المطلوبة كما ذكرت.

## أخطاء ومراقبة
- طبقة أخطاء موحّدة: 
  - أخطاء تحقق (400) تُعرض ضمن الحقول.
  - أخطاء مصادقة (401/403) برسالة واضحة.
  - أخطاء خادم (5xx) برسالة عامة و`requestId` إن توفر.
- سجلات محدودة بلا أي أسرار.

## خطوات تنفيذية
1. إنشاء `src/config/api.ts` و`src/lib/http.ts`.
2. إنشاء `src/services/auth.ts` بدوال `signup`, `login`.
3. توحيد/نقل Server Actions إلى `src/app/(auth)/actions.ts` أو الإبقاء على `registerActions` مع نفس التوقيع.
4. ربط `RegisterForm` و`LoginForm` بالدوال الجديدة، مع رسائل النجاح/الفشل.
5. إعداد `middleware.ts` لحماية المسارات لاحقًا.

## مخرجات متوقعة (للتأكيد)
- نقاط إدخال نظيفة: `auth.signup`, `auth.login`.
- صيغة الجسم في `signup` مطابقة لما زودته.
- نموذج تسجيل الدخول يتبع نفس الهيكل مع إدارة الكوكيز عبر Server Action.

هل ترغب أن أبدأ بتنفيذ الملفات (`api.ts`, `http.ts`, `auth.ts`) وربط `RegisterForm` أولًا، ثم إضافة `LoginForm` بنفس النمط؟