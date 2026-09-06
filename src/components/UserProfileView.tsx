import React, { useState } from "react";
import { UserProfile, GradeId, BranchId, QuizQuestion, StudyTask, SavedNote } from "../types";
import { GRADES_DATA } from "../data/curriculumData";
import { 
  User, 
  GraduationCap, 
  Target, 
  Flame, 
  Award, 
  CheckCircle2, 
  Bookmark, 
  FileText, 
  Share2, 
  Globe, 
  Smartphone, 
  ExternalLink, 
  LogOut, 
  Copy, 
  Check, 
  Search,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Download
} from "lucide-react";

interface UserProfileViewProps {
  user: UserProfile | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onUpdateUser: (updated: UserProfile) => void;
  onOpenInstallModal: () => void;
  currentGrade: GradeId;
  currentBranch: BranchId;
  bookmarkedCount: number;
  tasksCount: number;
  completedTasksCount: number;
  notesCount: number;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  onOpenAuthModal,
  onLogout,
  onUpdateUser,
  onOpenInstallModal,
  currentGrade,
  currentBranch,
  bookmarkedCount,
  tasksCount,
  completedTasksCount,
  notesCount
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetCollegeInput, setTargetCollegeInput] = useState(user?.targetCollege || "كلية الطب البشري");
  const [targetPercentInput, setTargetPercentInput] = useState(user?.targetScorePercent || 98);

  const gradeInfo = GRADES_DATA.find((g) => g.id === (user?.gradeId || currentGrade));
  const branchInfo = gradeInfo?.branches.find((b) => b.id === (user?.branchId || currentBranch));

  const appShareUrl = window.location.origin;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSaveTarget = () => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      targetCollege: targetCollegeInput,
      targetScorePercent: Number(targetPercentInput)
    };
    onUpdateUser(updated);
    setEditingTarget(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* If Not Logged In */}
      {!user ? (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 text-center shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-['Alexandria',sans-serif]">
            سجّل دخولك لحفظ وتتبع مذاكرتك
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
            أنشئ حسابك المجاني في ثوانٍ لتحفظ نتائج امتحاناتك، ملاحظاتك الذكية، وخطتك الدراسية لمتابعة حلمك في الثانوية والبكالوريا.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={onOpenAuthModal}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-2 text-sm"
            >
              <User className="w-4 h-4" />
              تسجيل الدخول / إنشاء حساب مجاني
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Student Profile Hero Card */}
          <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-0 top-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-3xl bg-white/10 border-2 border-emerald-400/40 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner">
                  {user.avatarId === "avatar_2" ? "👩‍🎓" : user.avatarId === "avatar_3" ? "🔬" : user.avatarId === "avatar_4" ? "📚" : "👨‍🎓"}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-black font-['Alexandria',sans-serif]">
                      {user.name}
                    </h2>
                    <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                      طالب مجتهد
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200/80 mt-1 font-mono">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-emerald-100 flex-wrap">
                    <span className="bg-white/10 px-3 py-1 rounded-lg">
                      {gradeInfo?.name || "الصف الثانوي"}
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-lg">
                      {branchInfo?.name || "الشعبة المقررة"}
                    </span>
                    <span className="flex items-center gap-1 text-amber-300 font-bold">
                      <Flame className="w-4 h-4 fill-amber-300" />
                      استمرارية المذاكرة: {user.streakDays} أيام
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-white/10 hover:bg-rose-500/20 hover:text-rose-200 border border-white/20 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </button>
              </div>
            </div>

            {/* Target Goal Widget */}
            <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-4 border border-white/15">
                <div className="flex items-center justify-between text-xs text-emerald-200 mb-1">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Target className="w-4 h-4 text-emerald-400" />
                    الكلية والهدف المنشود
                  </span>
                  <button
                    onClick={() => setEditingTarget(!editingTarget)}
                    className="text-2xs text-emerald-300 hover:text-white underline cursor-pointer"
                  >
                    {editingTarget ? "إلغاء" : "تعديل الهدف"}
                  </button>
                </div>

                {editingTarget ? (
                  <div className="space-y-2 mt-2">
                    <input
                      type="text"
                      value={targetCollegeInput}
                      onChange={(e) => setTargetCollegeInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900/80 border border-emerald-400/40 rounded-lg text-xs text-white"
                      placeholder="اسم الكلية"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-2xs">النسبة:</span>
                      <input
                        type="number"
                        min="80"
                        max="100"
                        value={targetPercentInput}
                        onChange={(e) => setTargetPercentInput(Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-slate-900/80 border border-emerald-400/40 rounded-lg text-xs text-white"
                      />
                      <button
                        onClick={handleSaveTarget}
                        className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-xs font-bold mr-auto cursor-pointer"
                      >
                        حفظ
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-base font-bold text-white mt-1">
                      {user.targetCollege || "كلية الطب البشري"}
                    </div>
                    <div className="text-xs text-emerald-200 mt-0.5">
                      المجموع والنسبة المستهدفة: <strong className="text-white">{user.targetScorePercent || 98}%</strong>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white/10 rounded-2xl p-4 border border-white/15 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-200 font-bold block mb-1">
                    معدل التقدم الإجمالي
                  </span>
                  <div className="text-2xl font-black text-white">
                    {completedTasksCount}/{tasksCount} <span className="text-xs text-emerald-300 font-normal">مهام منجزة</span>
                  </div>
                  <span className="text-2xs text-emerald-200 mt-1 block">
                    {bookmarkedCount} سؤال مميز محفوظ بالمفكرة
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/30 border-2 border-emerald-400 flex items-center justify-center font-black text-sm">
                  {tasksCount > 0 ? Math.round((completedTasksCount / tasksCount) * 100) : 100}%
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                المهام المنجزة
              </div>
              <div className="text-2xl font-black text-slate-900">
                {completedTasksCount}
              </div>
              <div className="text-2xs text-slate-400 mt-0.5">من أصل {tasksCount} مهمة</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-1">
                <Bookmark className="w-4 h-4 text-blue-600" />
                الأسئلة المحفوظة
              </div>
              <div className="text-2xl font-black text-slate-900">
                {bookmarkedCount}
              </div>
              <div className="text-2xs text-slate-400 mt-0.5">في دفتر المراجعة</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-1">
                <FileText className="w-4 h-4 text-purple-600" />
                الملاحظات الذكية
              </div>
              <div className="text-2xl font-black text-slate-900">
                {notesCount}
              </div>
              <div className="text-2xs text-slate-400 mt-0.5">تكات وقواعد مسجلة</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-1">
                <Award className="w-4 h-4 text-amber-500" />
                الامتحانات المكتملة
              </div>
              <div className="text-2xl font-black text-slate-900">
                {user.completedExamsCount || 2}
              </div>
              <div className="text-2xs text-slate-400 mt-0.5">اختبارات إلكترونية</div>
            </div>
          </div>
        </>
      )}

      {/* Sharing & Web Link & Google Search Section */}
      <div className="bg-linear-to-r from-blue-50 via-slate-50 to-emerald-50 rounded-3xl p-6 sm:p-8 border border-blue-200/70 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
              رابط التطبيق والمشاركة وظهوره في بحث جوجل
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              تطبيقك يعمل كرابط مباشر موثوق (Web App) ويمكنك نشره ومشاركته مع زملائك وتثبيته على الهاتف
            </p>
          </div>
        </div>

        {/* Live URL Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            رابط التطبيق المباشر (يمكن لأي شخص الدخول والمذاكرة منه):
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 truncate select-all">
              {appShareUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedLink ? "تم النسخ بنجاح!" : "نسخ الرابط"}
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">مشاركة سريعة:</span>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`ذاكر مجاناً لمنهج الثانوية العامة والبكالوريا بجميع الصفوف والشعب: ${appShareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              واتساب WhatsApp
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(appShareUrl)}&text=${encodeURIComponent("منصة ذاكر - الثانوية العامة والبكالوريا مجاناً")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              تيليجرام Telegram
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appShareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              فيسبوك Facebook
            </a>
          </div>
        </div>

        {/* How Google Indexing & App Installation Works */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Search className="w-4 h-4 text-emerald-600" />
              كيف يظهر التطبيق في بحث جوجل (Google Search)؟
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed list-disc list-inside">
              <li>
                تم تزويد التطبيق بأكواد <strong>SEO المتقدمة</strong> وبيانات <strong>Schema.org التعليمية</strong> التي تفهمها عناكب بحث جوجل تلقائياً.
              </li>
              <li>
                عند نشر التطبيق عبر زر <strong>Share</strong> أو <strong>Deploy</strong> وإرساله في المجموعات، تبدأ خوارزميات جوجل في فهرسته وأرشفته.
              </li>
              <li>
                يمكنك أيضاً ربطه باسم نطاق خاص (Custom Domain مثل: <span className="font-mono text-emerald-700">thaker.edu.eg</span>) وإضافته لـ Google Search Console.
              </li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Smartphone className="w-4 h-4 text-blue-600" />
              تثبيت التطبيق كـ App على الهاتف والكمبيوتر (PWA)
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed list-disc list-inside">
              <li>
                التطبيق مهيأ كـ <strong>Progressive Web App (PWA)</strong> مع ملف manifest معتمد.
              </li>
              <li>
                <strong>على الأندرويد/كروم:</strong> اضغط على خيارات المتصفح (الثلاث نقاط) ثم اختر <strong>"إضافة إلى الشاشة الرئيسية" (Install App)</strong>.
              </li>
              <li>
                <strong>على الآيفون/سفاري:</strong> اضغط على زر المشاركة ثم اختر <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.
              </li>
              <li>
                سيظهر التطبيق كأيقونة مستقلة على شاشة الهاتف تفتح بملء الشاشة كأي تطبيق عادي!
              </li>
            </ul>

            <button
              onClick={onOpenInstallModal}
              className="mt-3 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              فتح خطوات التثبيت بالصور لجهازك (أندرويد / آيفون / PC)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
