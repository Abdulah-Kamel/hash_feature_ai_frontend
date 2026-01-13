import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";

const FeaturesSection = () => {
  return (
    <div id="learning" className="w-full mt-20 scroll-mt-24">
      <div className="flex flex-col items-center justify-center gap-6 mb-12">
        <h3 className="text-4xl md:text-5xl font-bold text-white text-center">
          مميزات هاش فلو
        </h3>
        <p className="text-lg md:text-xl text-white/80 text-center max-w-3xl leading-relaxed">
          حوّل أي مادة دراسية إلى تجربة تعليمية تفاعلية. تساعدك أدواتنا المدعمة
          بالذكاء الاصطناعي على فهم محتواك وحفظه وإتقانه بفعالية أكبر من أي وقت
          مضى.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto">
        <Card className="hover:border-primary/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              سهولة الاستخدام
            </CardTitle>
            <CardDescription className="text-white/70 text-sm leading-relaxed">
              واجهة بسيطة ومباشرة تخليك تبدأ بدون شرح أو تعقيد. ارفع محتواك،
              اختر الأداة، وابدأ التعلم فورًا بدون خبرة تقنية أو خطوات طويلة.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:border-primary/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-white">سرعة التنفيذ</CardTitle>
            <CardDescription className="text-white/70 text-sm leading-relaxed">
              حوّل ملفاتك وأسئلتك إلى محتوى تعليمي خلال ثوانٍ. الذكاء الاصطناعي
              في هاش فلو ينجز ما كان يستغرق ساعات في وقت قياسي.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:border-primary/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-white">تعدد المحتوى</CardTitle>
            <CardDescription className="text-white/70 text-sm leading-relaxed">
              سواء كانت محاضرات، مذكرات، ملفات PDF أو نصوص هاش فلو يتعامل معها
              كلها. من مادة واحدة تقدر تنشئ شرح، مراحل تعلم، واختبارات في مكان
              واحد.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:border-primary/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              تعلم مخصص وفعال
            </CardTitle>
            <CardDescription className="text-white/70 text-sm leading-relaxed">
              كل تجربة تعلم تتكيّف مع مستواك وهدفك. هاش فلو يساعدك تركز على
              المهم، وتراجع بذكاء، وتحقق نتائج أفضل بثقة أعلى.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default FeaturesSection;
