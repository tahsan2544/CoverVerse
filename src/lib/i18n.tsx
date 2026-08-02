import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "bn" | "hi" | "ar" | "es" | "fr";

export const LANGS: { code: Lang; label: string; native: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", native: "English", dir: "ltr" },
  { code: "bn", label: "Bangla", native: "বাংলা", dir: "ltr" },
  { code: "hi", label: "Hindi", native: "हिन्दी", dir: "ltr" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
  { code: "es", label: "Spanish", native: "Español", dir: "ltr" },
  { code: "fr", label: "French", native: "Français", dir: "ltr" },
];

type Dict = Record<string, string>;

const en: Dict = {
  "app.name": "CoverCraft",
  "nav.home": "Home",
  "nav.newAssignment": "New assignment",
  "nav.start": "Start creating",
  "nav.language": "Language",
  "nav.shortcuts": "Keyboard shortcuts",
  "nav.tour": "Show tour",
  "tab.details": "Details",
  "tab.templates": "Templates",
  "tab.ai": "AI",
  "tab.style": "Style",
  "tab.qr": "QR",
  "preview.title": "Live preview",
  "preview.ready": "Ready",
  "preview.fill": "Fill required fields",
  "preview.unlock": "Complete the required fields to unlock the live preview and download.",
  "preview.autosave": "Your data autosaves to this browser only.",
  "btn.pdf": "PDF",
  "btn.png": "PNG",
  "btn.print": "Print",
  "btn.edit": "Edit",
  "btn.close": "Close",
  "onboarding.title": "Welcome to CoverCraft",
  "onboarding.subtitle": "A quick tour — 4 steps, 20 seconds.",
  "onboarding.step1.title": "Fill your details",
  "onboarding.step1.body": "Add student, school and assignment info. Everything autosaves to this device.",
  "onboarding.step2.title": "Pick a template",
  "onboarding.step2.body": "Choose from 500+ designs — filter by category, favorite the ones you love.",
  "onboarding.step3.title": "Let AI design it",
  "onboarding.step3.body": "Describe the vibe you want and the AI tab renders custom cover artwork.",
  "onboarding.step4.title": "Download or print",
  "onboarding.step4.body": "Export a print-ready A4 PDF or a high-resolution PNG in one click.",
  "onboarding.next": "Next",
  "onboarding.back": "Back",
  "onboarding.skip": "Skip",
  "onboarding.done": "Get started",
  "shortcuts.title": "Keyboard shortcuts",
  "shortcuts.subtitle": "Speed things up on desktop.",
  "shortcuts.newAssignment": "New assignment (keep student info)",
  "shortcuts.downloadPdf": "Download PDF",
  "shortcuts.downloadPng": "Download PNG",
  "shortcuts.print": "Print",
  "shortcuts.toggleTheme": "Toggle dark / light mode",
  "shortcuts.showHelp": "Show this help",
  "shortcuts.tour": "Replay onboarding tour",
};

const bn: Dict = {
  "app.name": "CoverCraft",
  "nav.home": "হোম",
  "nav.newAssignment": "নতুন অ্যাসাইনমেন্ট",
  "nav.start": "শুরু করুন",
  "nav.language": "ভাষা",
  "nav.shortcuts": "কীবোর্ড শর্টকাট",
  "nav.tour": "গাইড দেখুন",
  "tab.details": "বিবরণ",
  "tab.templates": "টেমপ্লেট",
  "tab.ai": "এআই",
  "tab.style": "স্টাইল",
  "tab.qr": "কিউআর",
  "preview.title": "লাইভ প্রিভিউ",
  "preview.ready": "প্রস্তুত",
  "preview.fill": "প্রয়োজনীয় ঘর পূরণ করুন",
  "preview.unlock": "লাইভ প্রিভিউ ও ডাউনলোডের জন্য প্রয়োজনীয় ঘরগুলো পূরণ করুন।",
  "preview.autosave": "আপনার তথ্য শুধু এই ব্রাউজারেই সেভ হয়।",
  "btn.pdf": "পিডিএফ",
  "btn.png": "পিএনজি",
  "btn.print": "প্রিন্ট",
  "btn.edit": "এডিট",
  "btn.close": "বন্ধ",
  "onboarding.title": "CoverCraft-এ স্বাগতম",
  "onboarding.subtitle": "৪ ধাপের ছোট্ট গাইড — ২০ সেকেন্ড।",
  "onboarding.step1.title": "তথ্য দিন",
  "onboarding.step1.body": "ছাত্র, স্কুল ও অ্যাসাইনমেন্টের তথ্য দিন। সব কিছু ডিভাইসে অটোসেভ হয়।",
  "onboarding.step2.title": "টেমপ্লেট বাছুন",
  "onboarding.step2.body": "৫০০+ ডিজাইন — ক্যাটাগরি অনুযায়ী ফিল্টার ও প্রিয় ট্যাগ করুন।",
  "onboarding.step3.title": "এআই দিয়ে ডিজাইন",
  "onboarding.step3.body": "AI ট্যাব বিষয় অনুযায়ী লেআউট, প্যালেট ও ফন্ট সাজেস্ট করে।",
  "onboarding.step4.title": "ডাউনলোড বা প্রিন্ট",
  "onboarding.step4.body": "প্রিন্ট-রেডি A4 PDF অথবা হাই-রেজ PNG। ইনস্টলের পর অফলাইনেও চলে।",
  "onboarding.next": "পরবর্তী",
  "onboarding.back": "পূর্ববর্তী",
  "onboarding.skip": "স্কিপ",
  "onboarding.done": "শুরু করুন",
  "shortcuts.title": "কীবোর্ড শর্টকাট",
  "shortcuts.subtitle": "ডেস্কটপে দ্রুত কাজ করুন।",
  "shortcuts.newAssignment": "নতুন অ্যাসাইনমেন্ট (ছাত্রের তথ্য থাকবে)",
  "shortcuts.downloadPdf": "পিডিএফ ডাউনলোড",
  "shortcuts.downloadPng": "পিএনজি ডাউনলোড",
  "shortcuts.print": "প্রিন্ট",
  "shortcuts.toggleTheme": "ডার্ক/লাইট মোড",
  "shortcuts.showHelp": "এই হেল্প দেখান",
  "shortcuts.tour": "গাইড আবার চালান",
};

const hi: Dict = {
  "app.name": "CoverCraft",
  "nav.home": "होम",
  "nav.newAssignment": "नई असाइनमेंट",
  "nav.start": "शुरू करें",
  "nav.language": "भाषा",
  "nav.shortcuts": "कीबोर्ड शॉर्टकट",
  "nav.tour": "गाइड दिखाएँ",
  "tab.details": "विवरण",
  "tab.templates": "टेम्पलेट",
  "tab.ai": "एआई",
  "tab.style": "स्टाइल",
  "tab.qr": "क्यूआर",
  "preview.title": "लाइव प्रीव्यू",
  "preview.ready": "तैयार",
  "preview.fill": "आवश्यक फ़ील्ड भरें",
  "preview.unlock": "लाइव प्रीव्यू और डाउनलोड के लिए आवश्यक फ़ील्ड भरें।",
  "preview.autosave": "आपका डेटा केवल इस ब्राउज़र में सेव होता है।",
  "btn.pdf": "पीडीएफ",
  "btn.png": "पीएनजी",
  "btn.print": "प्रिंट",
  "btn.edit": "एडिट",
  "btn.close": "बंद",
  "onboarding.title": "CoverCraft में स्वागत है",
  "onboarding.subtitle": "4 चरण, 20 सेकंड।",
  "onboarding.step1.title": "विवरण भरें",
  "onboarding.step1.body": "छात्र, स्कूल और असाइनमेंट की जानकारी दें — सब ऑटोसेव होता है।",
  "onboarding.step2.title": "टेम्पलेट चुनें",
  "onboarding.step2.body": "500+ डिज़ाइन — श्रेणी से फ़िल्टर करें, पसंदीदा जोड़ें।",
  "onboarding.step3.title": "एआई से डिज़ाइन",
  "onboarding.step3.body": "AI टैब आपके विषय के हिसाब से लेआउट, पैलेट और फ़ॉन्ट सुझाता है।",
  "onboarding.step4.title": "डाउनलोड या प्रिंट",
  "onboarding.step4.body": "प्रिंट-रेडी A4 PDF या हाई-रेज़ PNG — इंस्टॉल के बाद ऑफ़लाइन भी।",
  "onboarding.next": "आगे",
  "onboarding.back": "पीछे",
  "onboarding.skip": "स्किप",
  "onboarding.done": "शुरू करें",
  "shortcuts.title": "कीबोर्ड शॉर्टकट",
  "shortcuts.subtitle": "डेस्कटॉप पर तेज़ी से काम करें।",
  "shortcuts.newAssignment": "नई असाइनमेंट (छात्र जानकारी रहेगी)",
  "shortcuts.downloadPdf": "पीडीएफ डाउनलोड",
  "shortcuts.downloadPng": "पीएनजी डाउनलोड",
  "shortcuts.print": "प्रिंट",
  "shortcuts.toggleTheme": "डार्क/लाइट मोड",
  "shortcuts.showHelp": "यह मदद दिखाएँ",
  "shortcuts.tour": "गाइड फिर से देखें",
};

const ar: Dict = {
  "app.name": "CoverCraft",
  "nav.home": "الرئيسية",
  "nav.newAssignment": "واجب جديد",
  "nav.start": "ابدأ الآن",
  "nav.language": "اللغة",
  "nav.shortcuts": "اختصارات لوحة المفاتيح",
  "nav.tour": "عرض الجولة",
  "tab.details": "التفاصيل",
  "tab.templates": "القوالب",
  "tab.ai": "الذكاء الاصطناعي",
  "tab.style": "الأسلوب",
  "tab.qr": "رمز QR",
  "preview.title": "معاينة مباشرة",
  "preview.ready": "جاهز",
  "preview.fill": "املأ الحقول المطلوبة",
  "preview.unlock": "أكمل الحقول المطلوبة لفتح المعاينة والتنزيل.",
  "preview.autosave": "تُحفظ بياناتك في هذا المتصفح فقط.",
  "btn.pdf": "PDF",
  "btn.png": "PNG",
  "btn.print": "طباعة",
  "btn.edit": "تعديل",
  "btn.close": "إغلاق",
  "onboarding.title": "مرحبًا بك في CoverCraft",
  "onboarding.subtitle": "جولة سريعة من 4 خطوات — 20 ثانية.",
  "onboarding.step1.title": "أدخل بياناتك",
  "onboarding.step1.body": "أضف بيانات الطالب والمدرسة والواجب — يتم الحفظ تلقائيًا.",
  "onboarding.step2.title": "اختر قالبًا",
  "onboarding.step2.body": "أكثر من 500 تصميم — فلتر حسب الفئة وأضف المفضلة.",
  "onboarding.step3.title": "دع الذكاء الاصطناعي يصمم",
  "onboarding.step3.body": "تبويب AI يقترح تخطيطًا ولوحة ألوان وخطوطًا مناسبة.",
  "onboarding.step4.title": "نزّل أو اطبع",
  "onboarding.step4.body": "PDF بمقاس A4 أو PNG عالي الدقة — يعمل بدون إنترنت بعد التثبيت.",
  "onboarding.next": "التالي",
  "onboarding.back": "رجوع",
  "onboarding.skip": "تخطي",
  "onboarding.done": "لنبدأ",
  "shortcuts.title": "اختصارات لوحة المفاتيح",
  "shortcuts.subtitle": "أسرع على سطح المكتب.",
  "shortcuts.newAssignment": "واجب جديد (يبقى الطالب)",
  "shortcuts.downloadPdf": "تنزيل PDF",
  "shortcuts.downloadPng": "تنزيل PNG",
  "shortcuts.print": "طباعة",
  "shortcuts.toggleTheme": "تبديل الوضع الداكن/الفاتح",
  "shortcuts.showHelp": "عرض هذه المساعدة",
  "shortcuts.tour": "إعادة الجولة",
};

const es: Dict = {
  "app.name": "CoverCraft",
  "nav.home": "Inicio",
  "nav.newAssignment": "Nueva tarea",
  "nav.start": "Empezar",
  "nav.language": "Idioma",
  "nav.shortcuts": "Atajos de teclado",
  "nav.tour": "Ver tour",
  "tab.details": "Datos",
  "tab.templates": "Plantillas",
  "tab.ai": "IA",
  "tab.style": "Estilo",
  "tab.qr": "QR",
  "preview.title": "Vista previa",
  "preview.ready": "Listo",
  "preview.fill": "Completa los campos",
  "preview.unlock": "Completa los campos obligatorios para ver la vista previa y descargar.",
  "preview.autosave": "Tus datos se guardan solo en este navegador.",
  "btn.pdf": "PDF",
  "btn.png": "PNG",
  "btn.print": "Imprimir",
  "btn.edit": "Editar",
  "btn.close": "Cerrar",
  "onboarding.title": "Bienvenido a CoverCraft",
  "onboarding.subtitle": "Un tour rápido — 4 pasos, 20 segundos.",
  "onboarding.step1.title": "Rellena tus datos",
  "onboarding.step1.body": "Estudiante, escuela y tarea — todo se guarda automáticamente.",
  "onboarding.step2.title": "Elige una plantilla",
  "onboarding.step2.body": "Más de 500 diseños — filtra por categoría y marca favoritos.",
  "onboarding.step3.title": "Deja que la IA diseñe",
  "onboarding.step3.body": "La pestaña IA sugiere diseño, paleta y tipografía.",
  "onboarding.step4.title": "Descarga o imprime",
  "onboarding.step4.body": "PDF A4 listo para imprimir o PNG en alta resolución. Funciona sin conexión.",
  "onboarding.next": "Siguiente",
  "onboarding.back": "Atrás",
  "onboarding.skip": "Saltar",
  "onboarding.done": "Empezar",
  "shortcuts.title": "Atajos de teclado",
  "shortcuts.subtitle": "Más rápido en escritorio.",
  "shortcuts.newAssignment": "Nueva tarea (mantiene estudiante)",
  "shortcuts.downloadPdf": "Descargar PDF",
  "shortcuts.downloadPng": "Descargar PNG",
  "shortcuts.print": "Imprimir",
  "shortcuts.toggleTheme": "Alternar modo oscuro/claro",
  "shortcuts.showHelp": "Mostrar esta ayuda",
  "shortcuts.tour": "Repetir tour",
};

const fr: Dict = {
  "app.name": "CoverCraft",
  "nav.home": "Accueil",
  "nav.newAssignment": "Nouveau devoir",
  "nav.start": "Commencer",
  "nav.language": "Langue",
  "nav.shortcuts": "Raccourcis clavier",
  "nav.tour": "Voir le guide",
  "tab.details": "Détails",
  "tab.templates": "Modèles",
  "tab.ai": "IA",
  "tab.style": "Style",
  "tab.qr": "QR",
  "preview.title": "Aperçu en direct",
  "preview.ready": "Prêt",
  "preview.fill": "Remplissez les champs",
  "preview.unlock": "Complétez les champs requis pour déverrouiller l'aperçu et le téléchargement.",
  "preview.autosave": "Vos données sont enregistrées uniquement dans ce navigateur.",
  "btn.pdf": "PDF",
  "btn.png": "PNG",
  "btn.print": "Imprimer",
  "btn.edit": "Modifier",
  "btn.close": "Fermer",
  "onboarding.title": "Bienvenue sur CoverCraft",
  "onboarding.subtitle": "Guide rapide — 4 étapes, 20 secondes.",
  "onboarding.step1.title": "Vos informations",
  "onboarding.step1.body": "Élève, école, devoir — tout est enregistré automatiquement.",
  "onboarding.step2.title": "Choisissez un modèle",
  "onboarding.step2.body": "Plus de 500 designs — filtrez par catégorie, ajoutez des favoris.",
  "onboarding.step3.title": "Laissez l'IA concevoir",
  "onboarding.step3.body": "L'onglet IA propose mise en page, palette et typographies.",
  "onboarding.step4.title": "Téléchargez ou imprimez",
  "onboarding.step4.body": "PDF A4 prêt à imprimer ou PNG haute résolution. Fonctionne hors ligne.",
  "onboarding.next": "Suivant",
  "onboarding.back": "Retour",
  "onboarding.skip": "Passer",
  "onboarding.done": "Commencer",
  "shortcuts.title": "Raccourcis clavier",
  "shortcuts.subtitle": "Plus rapide sur ordinateur.",
  "shortcuts.newAssignment": "Nouveau devoir (garde l'élève)",
  "shortcuts.downloadPdf": "Télécharger PDF",
  "shortcuts.downloadPng": "Télécharger PNG",
  "shortcuts.print": "Imprimer",
  "shortcuts.toggleTheme": "Basculer sombre/clair",
  "shortcuts.showHelp": "Afficher cette aide",
  "shortcuts.tour": "Rejouer le guide",
};

const DICTS: Record<Lang, Dict> = { en, bn, hi, ar, es, fr };
const STORAGE_KEY = "covercraft:lang:v1";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved && DICTS[saved]) setLangState(saved);
    } catch { /* ignore */ }
  }, []);

  const dir = useMemo(() => LANGS.find((l) => l.code === lang)?.dir ?? "ltr", [lang]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
  }, []);

  const t = useCallback((key: string) => {
    return DICTS[lang]?.[key] ?? DICTS.en[key] ?? key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) return { lang: "en" as Lang, setLang: () => {}, t: (k: string) => DICTS.en[k] ?? k, dir: "ltr" as const };
  return ctx;
}