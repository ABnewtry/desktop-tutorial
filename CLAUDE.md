# بورتفوليو عبد الرحمن (AB) — ملف ذاكرة المشروع

> اقرأ هذا الملف كاملاً قبل أي تعديل. هو المرجع الرسمي للمشروع.

## نظرة عامة
- **المشروع:** بورتفوليو شخصي لـ"عبد الرحمن / Abdulrahman" — خبير بالذكاء الاصطناعي (تسويق، تصميم إعلانات وبوسترات، ستوري بورد، لاندنق بيجز، هويات بصرية، مونتاج Premiere Pro).
- **الموقع الحي:** https://abnewtry.github.io/desktop-tutorial/
- **الفرع الرسمي للنشر:** `claude/kind-cannon-mm71aj` — GitHub Pages ينشر من هذا الفرع (root). **كل تعديل يُدفع له مباشرة.**
- **البنية:** ملف واحد `index.html` (~4MB) يحوي كل شيء: CSS + JS + كل الصور مدمجة base64. لا build ولا اعتماديات.

## أسلوب العمل المتفق عليه مع عبد الرحمن
1. **خطوة بخطوة** — تعديل واحد، معاينة، موافقته، ثم التالي. لا تنفذ أشياء كثيرة دون سؤاله.
2. **رفع الصور:** يرفعها هو عبر رابط `https://github.com/ABnewtry/desktop-tutorial/upload/claude/kind-cannon-mm71aj/assets/uploads` — أحياناً تروح غلط على فرع `main`، فابحث عنها في الفرعين (`git ls-tree origin/main`).
3. **معالجة الصور:** Pillow (`pip install Pillow`) → تصغير + JPEG q80 → base64 → دمج في index.html → `git rm` للأصل الثقيل من الريبو.
4. **بعد كل تعديل:** تحقق JS (`node --check` على محتوى `<script>`)، commit + push، أرسل له معاينة index.html عبر SendUserFile، وذكّره أن الموقع يتحدث خلال 1-3 دقائق.
5. **لو قال "التعديل ما ظهر":** افحص GitHub Actions (`pages build and deployment`) — أحياناً يفشل البناء عشوائياً؛ الحل: commit فارغ وpush لإعادة الإطلاق. وأعطه الرابط مع `?v=رقم` لكسر الكاش.
6. **الكتابة:** عربي سعودي قصير + نبرة "بروفيسور علم نفس تسويقي" — جمل قصيرة، تفاصيل محسوسة، كلمات مفتاحية بتوهيج `<b class='hl'>`. كل نص له نسخة EN مطابقة.

## بنية index.html (المفاتيح المهمة في JS)
- `DATA = {ar:{...}, en:{...}}` — كل نصوص الموقع ثنائية اللغة. مفاتيح تنتهي بـ`_html` تُعرض innerHTML (تسمح بـ`<b class='hl'>`).
- `ADS_MEDIA` — صور قسم الإعلانات: 3 منتجات (food/perfume/furniture) × 3 مراحل (original/ad/poster). تبديل بالأزرار + سحب بالإصبع.
- `GALLERY_MEDIA` — قسم الستوري بورد: قهوة + عطر، كل واحد صورة كبيرة + شرح مرقم 3 نقاط.
- `LP_MEDIA` — سكرينات 3 لاندنق بيجز (burger/perfume/sofa) صممتها بنفسي (مصادرها HTML في scratchpad سابق — أعيد بناؤها بـ Cairo/Tajawal fonts + playwright screenshot 1100px).
- `CASE_MEDIA` — قضية سولارا: 3 صور منتج + سكرين موقع حي https://silent-thicket-572.higgsfield.app/
- `ID_MEDIA` — الهويات: `ab` (6 قطع ملابس، لوحة سوداء نيون)، `coffee` (3 قطع قهوة AB، لوحة مستقلة)، `potato` (منيو قديم/جديد قبل-بعد VS + بورتفوليو 6 صفحات كمروحة pf-strip).
- `CARD_IMGS` — صور بطاقات "مختارات من مشاريعي" (posters/identity موجودة، web/video ما زالت أيقونات).
- `SOCIALS` — واتساب wa.me/966546515366 برسالة جاهزة، إيميل abnewtry@gmail.com، تيك توك @abnewtrys، يوتيوب @Abnewtrys.

## أقسام الموقع بالترتيب
1. هيرو: صورته (لابتوب + توهج برتقالي) + "خبير بالذكاء الاصطناعي" — زر "شاهد أعمالي" → #ads
2. ما أقدّمه: 6 خدمات (البطاقة الخامسة "هويات بصرية" وليست منيوهات)
3. #ads إعلانات وبوسترات: 3 بطاقات قبل/إعلان/بوستر — **لا تلمس بطاقاتها دون طلبه**
4. #gallery ستوري بورد: شرح 3 بطاقات + مثالين مشروحين
5. #landing لاندنق بيجز: شرح + 3 نماذج بإطار متصفح + قضية سولارا (موقع حي)
6. #identity هويات: AB (نيون) + قهوة AB + مستر بطاطس
7. #work مختارات: 5 بوابات (متجر ثياب Shopify https://7is8hb-km.myshopify.com/en، يوتيوب https://www.youtube.com/watch?v=p-GT3_eqIZA، بوسترات→#ads، هويات→#identity، درايف https://drive.google.com/drive/folders/1LboUjF-OlcELYUJ6X_4bV3l3jl4KWqFL)
8. ليش تختارني: نص + صورته البنفسجية + بطاقة "ماذا أوفر لك؟" (5 وعود بإطار متدرج)
9. تواصل + فوتر

## حالة معلقة / أفكار مقبولة مستقبلاً
- **التقييمات:** القسم محذوف من HTML لكن `tst_items` والدالة `renderTst()` باقية بالكود — يفعّلها لما يجيب آراء حقيقية (لا تخترع آراء).
- مقترحات وافق نناقشها لاحقاً: زر واتساب عائم، فيديو شوريل بالهيرو، OG image للمشاركة، قسم FAQ، دومين خاص.
- بطاقتا web/video في المختارات ينقصهما صور مصغرة (يرفعها باسم web… / video…).

## ملاحظات تقنية للبيئة
- الشبكة عبر بروكسي يمنع أغلب المواقع الخارجية (Google Drive, YouTube, github clone خارجي…) — **الرفع عبر GitHub upload فقط**، وpypi/npm مسموحة.
- خطوط عربية للاندنق بيجز: تُحمّل من Google Fonts (مسموح) — Cairo 700/900 + Tajawal 400/500/800.
- سكيل ui-ux-pro-max موجود جاهزاً على فرع `claude/nifty-cannon-3dPdw` في نفس المستودع (`.claude/skills/ui-ux-pro-max/`) — يمكن نسخه لفرع العمل عند الحاجة.

## store-ab.html — متجر AB السينمائي (3D)
- صفحة مستقلة: https://abnewtry.github.io/desktop-tutorial/store-ab.html
- Scroll-Driven Cinematic WebGL: Three.js + GSAP ScrollTrigger + Lenis مجمّعة inline (esbuild) — ملف واحد ~1.3MB.
- الكائن البطل: حروف AB معدنية مستخرجة من خط Cairo-900 عبر opentype.js (src في scratchpad/store/).
- بيانات المتجر الحقيقية من Shopify MCP (TRAVEL/ANIME/COUPLES — 119 ر.س) والأزرار تفتح المتجر الحي.
- التمرير = الزمن: CatmullRomCurve3 بخمس لقطات، scrub 1.2، fov 35، rectAreaLight منزلق، Bloom + Grain + Vignette.

## متاجر AB الكاملة الثلاثة (custom — بدون روابط للموقع القديم)
- store-neon.html — «NEON DROP»: ثقافة الدروبات، عداد، شريط متحرك، بطاقات ليزر، سلة درج جانبي.
- store-lookbook.html — «LOOKBOOK № 01»: مجلة ورقية فاتحة، كل قطعة صفحة/spread بأرقام شبحية، حقيبة شريط سفلي.
- store-terminal.html — «AB_SHELL»: طرفية CRT خضراء بإقلاع نظام وجدول مخزون وCART_STACK.
- الثلاثة: نفس بيانات Shopify الحقيقية (6 منتجات، 119 ر.س، مقاسات S–XXL)، سلة تعمل بـ localStorage،
  والدفع = يفتح واتساب 966546515366 برسالة الطلب جاهزة. صور المنتجات = SVG mockups مرسومة
  (تُستبدل بصور حقيقية لو رفعها). القوالب في scratchpad/store/tpl-*.html.
