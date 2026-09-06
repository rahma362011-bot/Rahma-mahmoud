import React, { useState } from "react";
import { GradeId, BranchId, UserProfile } from "../types";
import { GRADES_DATA } from "../data/curriculumData";
import { 
  User, 
  Lock, 
  Mail, 
  Sparkles, 
  Target, 
  GraduationCap, 
  CheckCircle2, 
  X, 
  ArrowRight,
  ShieldCheck,
  Zap,
  LogIn,
  UserPlus
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  currentGrade: GradeId;
  currentBranch: BranchId;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentGrade,
  currentBranch
}) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetCollege, setTargetCollege] = useState("كلية الطب البشري");
  const [targetPercent, setTargetPercent] = useState(98);
  const [selectedGrade, setSelectedGrade] = useState<GradeId>(currentGrade);
  const [selectedBranch, setSelectedBranch] = useState<BranchId>(currentBranch);
  const [selectedAvatar, setSelectedAvatar] = useState("avatar_1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const currentGradeConfig = GRADES_DATA.find((g) => g.id === selectedGrade) || GRADES_DATA[0];

  const handleGradeChange = (gradeId: GradeId) => {
    setSelectedGrade(gradeId);
    const g = GRADES_DATA.find((item) => item.id === gradeId);
    if (g && g.branches.length > 0) {
      setSelectedBranch(g.branches[0].id);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("يرجى إدخال اسم الطالب كاملاً");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("يرجى إدخال بريد إلكتروني صالح");
      return;
    }
    if (password.length < 4) {
      setError("كلمة المرور يجب ألا تقل عن 4 خانات");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        gradeId: selectedGrade,
        branchId: selectedBranch,
        targetCollege,
        targetScorePercent: Number(targetPercent),
        streakDays: 1,
        completedExamsCount: 0,
        totalStudyMinutes: 0,
        avatarId: selectedAvatar,
        createdAt: new Date().toLocaleDateString("ar-EG")
      };

      try {
        localStorage.setItem("thaker_current_user", JSON.stringify(newUser));
        // Also save to accounts registry
        const existingUsers = JSON.parse(localStorage.getItem("thaker_registered_users") || "[]");
        existingUsers.push({ ...newUser, password });
        localStorage.setItem("thaker_registered_users", JSON.stringify(existingUsers));
      } catch (err) {}

      setLoading(false);
      onSuccess(newUser);
      onClose();
    }, 400);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("يرجى إدخال البريد الإلكتروني أو اسم المستخدم");
      return;
    }
    if (!password.trim()) {
      setError("يرجى إدخال كلمة المرور");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      // Look up existing user
      let matchedUser: UserProfile | null = null;
      try {
        const existingUsers = JSON.parse(localStorage.getItem("thaker_registered_users") || "[]");
        matchedUser = existingUsers.find((u: any) => u.email === email || u.name === email);
      } catch (err) {}

      if (!matchedUser) {
        // Create seamless profile with entered credentials
        matchedUser = {
          id: `user_${Date.now()}`,
          name: email.split("@")[0] || "طالب الثانوية",
          email: email.includes("@") ? email : `${email}@thaker.edu`,
          gradeId: currentGrade,
          branchId: currentBranch,
          targetCollege: "الكلية المستهدفة",
          targetScorePercent: 98,
          streakDays: 3,
          completedExamsCount: 2,
          totalStudyMinutes: 120,
          avatarId: "avatar_1",
          createdAt: new Date().toLocaleDateString("ar-EG")
        };
      }

      try {
        localStorage.setItem("thaker_current_user", JSON.stringify(matchedUser));
      } catch (err) {}

      setLoading(false);
      onSuccess(matchedUser);
      onClose();
    }, 400);
  };

  const handleDemoLogin = (preset: "med" | "eng" | "bac" | "guest") => {
    setLoading(true);
    let demoUser: UserProfile;

    if (preset === "med") {
      demoUser = {
        id: "demo_student_med",
        name: "عمر أحمد (طبيب المستقبل)",
        email: "omar.med@thaker.edu",
        gradeId: "grade3",
        branchId: "sci_science",
        targetCollege: "كلية الطب البشري - قصر العيني",
        targetScorePercent: 99,
        streakDays: 7,
        completedExamsCount: 12,
        totalStudyMinutes: 540,
        avatarId: "avatar_1",
        createdAt: "2026/09/01"
      };
    } else if (preset === "eng") {
      demoUser = {
        id: "demo_student_eng",
        name: "سارة خالد (مهندسة المستقبل)",
        email: "sara.eng@thaker.edu",
        gradeId: "grade3",
        branchId: "sci_math",
        targetCollege: "كلية الهندسة - جامعة القاهرة",
        targetScorePercent: 97,
        streakDays: 5,
        completedExamsCount: 8,
        totalStudyMinutes: 420,
        avatarId: "avatar_2",
        createdAt: "2026/09/01"
      };
    } else if (preset === "bac") {
      demoUser = {
        id: "demo_student_bac",
        name: "يوسف ممدوح (مسار البكالوريا)",
        email: "youssef.bac@thaker.edu",
        gradeId: "grade2_bac",
        branchId: "bac_track",
        targetCollege: "كلية الذكاء الاصطناعي والحاسبات",
        targetScorePercent: 98,
        streakDays: 4,
        completedExamsCount: 6,
        totalStudyMinutes: 310,
        avatarId: "avatar_3",
        createdAt: "2026/09/01"
      };
    } else {
      demoUser = {
        id: `guest_${Date.now()}`,
        name: "طالب مجتهد (زائر)",
        email: "guest@thaker.edu",
        gradeId: currentGrade,
        branchId: currentBranch,
        targetCollege: "تحقيق أعلى مجموع",
        targetScorePercent: 95,
        streakDays: 1,
        completedExamsCount: 0,
        totalStudyMinutes: 15,
        avatarId: "avatar_1",
        createdAt: new Date().toLocaleDateString("ar-EG")
      };
    }

    try {
      localStorage.setItem("thaker_current_user", JSON.stringify(demoUser));
    } catch (err) {}

    setTimeout(() => {
      setLoading(false);
      onSuccess(demoUser);
      onClose();
    }, 300);
  };

  const avatars = [
    { id: "avatar_1", emoji: "👨‍🎓", label: "طالب" },
    { id: "avatar_2", emoji: "👩‍🎓", label: "طالبة" },
    { id: "avatar_3", emoji: "🔬", label: "علمي" },
    { id: "avatar_4", emoji: "📚", label: "أدبي" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="auth-modal-card"
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer text-white"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner text-white">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Alexandria',sans-serif]">
                {mode === "login" ? "تسجيل الدخول إلى حسابك" : "إنشاء حساب طالب جديد"}
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                احفظ درجاتك، تقدمك الدراسي، وملاحظاتك تلقائياً على مدار العام
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 mt-4 bg-black/15 p-1 rounded-xl">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === "login"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <LogIn className="w-4 h-4" />
              تسجيل الدخول
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === "register"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              حساب جديد
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <X className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  البريد الإلكتروني أو اسم المستخدم
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="مثال: student@gmail.com أو اسمك"
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                {loading ? "جاري الدخول..." : "دخول المنصة"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  اسم الطالب بالكامل
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: أحمد محمد مصطفى"
                    className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ahmed@gmail.com"
                    className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="كلمة مرور قوية"
                    className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Grade Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    الصف الدراسي والمسار
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => handleGradeChange(e.target.value as GradeId)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {GRADES_DATA.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    الشعبة / التخصص
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value as BranchId)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {currentGradeConfig.branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target College & Target Score */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    كلية الحلم والهدف 🎯
                  </label>
                  <input
                    type="text"
                    value={targetCollege}
                    onChange={(e) => setTargetCollege(e.target.value)}
                    placeholder="مثال: كلية الطب، هندسة، ألسن"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    النسبة المئوية المستهدفة ({targetPercent}%)
                  </label>
                  <input
                    type="range"
                    min="80"
                    max="100"
                    value={targetPercent}
                    onChange={(e) => setTargetPercent(Number(e.target.value))}
                    className="w-full accent-emerald-600 mt-2"
                  />
                </div>
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  اختر أيقونة حسابك:
                </label>
                <div className="flex items-center gap-2">
                  {avatars.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.id)}
                      className={`px-3 py-1.5 rounded-xl border text-base flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedAvatar === av.id
                          ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs scale-105"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span>{av.emoji}</span>
                      <span className="text-2xs">{av.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm mt-2"
              >
                {loading ? "جاري إنشاء الحساب..." : "إنشاء حسابي الآن مجاناً"}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Access (No password hassle) */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 text-center mb-2.5">
              أو ادخل بضغطة واحدة بحساب تجريبي مجهز:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("med")}
                className="p-2 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 text-emerald-900 text-xs font-medium text-right flex items-center gap-2 transition-all cursor-pointer"
              >
                <span className="text-base">🩺</span>
                <div>
                  <div className="font-bold">طالب علمي علوم</div>
                  <div className="text-3xs text-emerald-700">هدف: طب بشري (99%)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("eng")}
                className="p-2 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 text-blue-900 text-xs font-medium text-right flex items-center gap-2 transition-all cursor-pointer"
              >
                <span className="text-base">📐</span>
                <div>
                  <div className="font-bold">طالب علمي رياضة</div>
                  <div className="text-3xs text-blue-700">هدف: هندسة (97%)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("bac")}
                className="p-2 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 text-amber-900 text-xs font-medium text-right flex items-center gap-2 transition-all cursor-pointer"
              >
                <span className="text-base">🌟</span>
                <div>
                  <div className="font-bold">طالب بكالوريا</div>
                  <div className="text-3xs text-amber-700">نظام البكالوريا الجديد</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("guest")}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium text-right flex items-center gap-2 transition-all cursor-pointer"
              >
                <span className="text-base">⚡</span>
                <div>
                  <div className="font-bold">الدخول كزائر</div>
                  <div className="text-3xs text-slate-500">تجربة سريعة بدون بريد</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Free Promise Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            مجاني تماماً 100% وبدون أي رسوم خفية
          </span>
          <span>منصة ذاكر التعليمية</span>
        </div>
      </div>
    </div>
  );
};
