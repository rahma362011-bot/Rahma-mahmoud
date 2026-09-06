import React, { useState, useEffect } from "react";
import { 
  Download, 
  Smartphone, 
  Apple, 
  Monitor, 
  Check, 
  Copy, 
  ExternalLink, 
  X, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Share,
  Layers,
  FolderDown
} from "lucide-react";

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState<"android" | "ios" | "pc" | "code">("android");
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Listen for the PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Detect if already installed / standalone
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Auto-detect OS
    const userAgent = navigator.userAgent || "";
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      setActiveTab("ios");
    } else if (/Android/i.test(userAgent)) {
      setActiveTab("android");
    } else {
      setActiveTab("pc");
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const appUrl = window.location.origin;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="install-modal-card"
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer text-white"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-md shrink-0 flex items-center justify-center">
              <img src="/icon.svg" alt="أيقونة تطبيق ذاكر" className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-['Alexandria',sans-serif]">
                  تنزيل وتثبيت تطبيق "ذاكر"
                </h2>
                <span className="bg-white/20 text-emerald-100 text-2xs px-2 py-0.5 rounded-md font-semibold">
                  مجاني 100%
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-1">
                ثبّت التطبيق على شاشة هاتفك الرئيسية ليفتح بضغطة واحدة بدون متصفح وبسرعة فائقة
              </p>
            </div>
          </div>

          {/* Quick 1-Click Install Button if supported by browser */}
          {deferredPrompt && (
            <div className="mt-4 pt-3 border-t border-white/20">
              <button
                onClick={handleInstallClick}
                className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                تثبيت التطبيق الآن بضغطة واحدة (متاح لمتصفحك)
              </button>
            </div>
          )}

          {/* Device Tabs */}
          <div className="flex items-center gap-1.5 mt-4 bg-black/15 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("android")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === "android" ? "bg-white text-emerald-800 shadow-xs" : "text-white/80 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              أندرويد (Android)
            </button>
            <button
              onClick={() => setActiveTab("ios")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === "ios" ? "bg-white text-emerald-800 shadow-xs" : "text-white/80 hover:text-white"
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              آيفون (iPhone)
            </button>
            <button
              onClick={() => setActiveTab("pc")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === "pc" ? "bg-white text-emerald-800 shadow-xs" : "text-white/80 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              الكمبيوتر (PC)
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === "code" ? "bg-white text-emerald-800 shadow-xs" : "text-white/80 hover:text-white"
              }`}
            >
              <FolderDown className="w-3.5 h-3.5" />
              ملف ZIP
            </button>
          </div>
        </div>

        {/* Instructions Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* ANDROID TAB */}
          {activeTab === "android" && (
            <div className="space-y-3.5">
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 rounded-2xl text-xs flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  يعمل التطبيق بنظام <strong>Progressive Web App (PWA)</strong> المعتمد عالمياً من جوجل ليتم تثبيته فوراً كأي تطبيق من Google Play بدون استهلاك مساحة الذاكرة!
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    افتح رابط التطبيق في متصفح <strong>Google Chrome</strong> على هاتفك الأندرويد.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    اضغط على زر القائمة <span className="font-bold text-slate-900">الثلاث نقاط الرأسية (⋮)</span> في أعلى زاوية المتصفح.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    اختر خيار <strong className="text-emerald-700 font-bold">"تثبيت التطبيق" (Install app)</strong> أو <strong className="text-emerald-700">"إضافة إلى الشاشة الرئيسية" (Add to Home screen)</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    ✓
                  </div>
                  <div className="text-xs text-emerald-900 leading-relaxed font-semibold">
                    مبروك! ستظهر أيقونة تطبيق "ذاكر" على شاشة هاتفك الرئيسية، وتفتح بملء الشاشة مع حفظ تقدمك ومذكراتك دائماً.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* IOS TAB */}
          {activeTab === "ios" && (
            <div className="space-y-3.5">
              <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3.5 rounded-2xl text-xs flex items-center gap-2.5">
                <Apple className="w-5 h-5 text-blue-600 shrink-0" />
                <span>
                  خطوات سريعة وبسيطة لتثبيت التطبيق على أجهزة آيفون وآيباد عبر متصفح Safari:
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    تأكد من فتح رابط التطبيق داخل متصفح <strong>سفاري (Safari)</strong> على الآيفون.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    اضغط على أيقونة <strong className="text-slate-900">المشاركة (Share)</strong> بالأسفل (المربع الذي يخرج منه سهم للأعلى ⎋).
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    مرر لأسفل القائمة واضغط على <strong className="text-blue-700">"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    4
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    اضغط على كلمة <strong className="text-emerald-700">"إضافة" (Add)</strong> في أعلى الزاوية اليسرى.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PC TAB */}
          {activeTab === "pc" && (
            <div className="space-y-3.5">
              <div className="bg-slate-100 border border-slate-200 text-slate-800 p-3.5 rounded-2xl text-xs flex items-center gap-2.5">
                <Monitor className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  يمكنك تثبيت المنصة كتطبيق سطح مكتب خفيف ومستقل على نظام Windows أو Mac:
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    في متصفح Google Chrome أو Microsoft Edge على الكمبيوتر، انظر إلى نهاية <strong>شريط العنوان (URL bar)</strong> في الأعلى.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    ستجد أيقونة صغيرة تشبه <strong className="text-emerald-700">شاشة مع سهم لأسفل أو علامة (+)</strong> مكتوب عليها "تثبيت ذاكر".
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    اضغط عليها ثم اختر <strong>"تثبيت" (Install)</strong>، وسيتم إنشاء اختصار على سطح المكتب وشريط المهام.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CODE / ZIP TAB */}
          {activeTab === "code" && (
            <div className="space-y-3.5">
              <div className="bg-purple-50 border border-purple-200 text-purple-900 p-3.5 rounded-2xl text-xs flex items-center gap-2.5">
                <FolderDown className="w-5 h-5 text-purple-600 shrink-0" />
                <span>
                  إذا كنت تريد تنزيل الملفات البرمجية للمشروع كاملاً لتشغيله محلياً أو رفعه على استضافتك:
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    من خلال واجهة <strong>Google AI Studio</strong> في أعلى يمين الشاشة، اضغط على زر <strong>الإعدادات (Settings ⚙️)</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    اختر <strong>"Export to ZIP"</strong> لتحميل المشروع بالكامل في ملف مضغوط، أو <strong>"Export to GitHub"</strong> لربطه بحسابك البرمجي.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Link Copy Bar */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-2xs font-bold text-slate-500 mb-1.5">
              انسخ الرابط لفتحه على هاتفك فوراً:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="flex-1 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 select-all"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? "تم النسخ!" : "نسخ الرابط"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            تطبيق ويب تقدمي خفيف وآمن 100%
          </span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            حسناً، فهمت
          </button>
        </div>
      </div>
    </div>
  );
};
