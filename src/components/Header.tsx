import React from "react";
import { GradeId, BranchId, ActiveTab, UserProfile } from "../types";
import { GRADES_DATA } from "../data/curriculumData";
import { 
  BookOpen, 
  HelpCircle, 
  Bot, 
  Sparkles, 
  Calendar, 
  Timer, 
  Bookmark, 
  GraduationCap, 
  ShieldCheck,
  Wifi,
  User,
  LogIn,
  Share2,
  Download
} from "lucide-react";

interface HeaderProps {
  currentGrade: GradeId;
  onSelectGrade: (gradeId: GradeId) => void;
  currentBranch: BranchId;
  onSelectBranch: (branchId: BranchId) => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  bookmarkedCount: number;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onOpenInstallModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentGrade,
  onSelectGrade,
  currentBranch,
  onSelectBranch,
  activeTab,
  onSelectTab,
  bookmarkedCount,
  currentUser,
  onOpenAuthModal,
  onOpenInstallModal
}) => {
  const currentGradeInfo = GRADES_DATA.find((g) => g.id === currentGrade) || GRADES_DATA[2];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Free Guarantee Banner */}
      <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs sm:text-sm py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              مجاني 100% بالكامل
            </span>
            <span className="hidden sm:inline">منصة تعليمية متكاملة لجميع طلاب الثانوية العامة والبكالوريا بدون أي رسوم</span>
            <span className="sm:hidden">متاح مجاناً لجميع طلاب الثانوي</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-100 text-xs">
            <Wifi className="w-3.5 h-3.5 animate-pulse text-emerald-200" />
            <span>متصل بالإنترنت والمعلم الذكي</span>
          </div>
        </div>
      </div>

      {/* Main Brand & Grade Selector Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Alexandria',sans-serif]">
                  ذاكِر <span className="text-emerald-600">Thaker</span>
                </h1>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-0.5 rounded-md font-semibold">
                  مجاني مدى الحياة
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                منصة المذاكرة الشاملة لصفوف الثانوية العامة والبكالوريا الثلاثة
              </p>
            </div>
          </div>

          {/* Grade Selector & User Account */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              {GRADES_DATA.map((grade) => {
                const isSelected = grade.id === currentGrade;
                return (
                  <button
                    key={grade.id}
                    id={`btn-grade-${grade.id}`}
                    onClick={() => {
                      onSelectGrade(grade.id);
                      // auto pick first branch
                      if (grade.branches.length > 0) {
                        onSelectBranch(grade.branches[0].id);
                      }
                    }}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white text-emerald-700 shadow-xs border border-slate-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                    }`}
                  >
                    {grade.badge}
                  </button>
                );
              })}
            </div>

            {/* Install App Button */}
            <button
              id="btn-install-app-header"
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="تثبيت التطبيق على هاتفك أو جهازك"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تثبيت التطبيق 📲</span>
            </button>

            {/* Student Auth Button */}
            {currentUser ? (
              <button
                id="btn-user-profile-header"
                onClick={() => onSelectTab("profile")}
                className="flex items-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="الملف الشخصي والهدف"
              >
                <span className="text-base">{currentUser.avatarId === "avatar_2" ? "👩‍🎓" : currentUser.avatarId === "avatar_3" ? "🔬" : currentUser.avatarId === "avatar_4" ? "📚" : "👨‍🎓"}</span>
                <span className="max-w-[100px] truncate">{currentUser.name.split(" ")[0]}</span>
              </button>
            ) : (
              <button
                id="btn-login-header"
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>تسجيل الدخول</span>
              </button>
            )}
          </div>

        </div>

        {/* Branch Selector Bar (if current grade has multiple branches) */}
        {currentGradeInfo.branches.length > 1 && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-medium whitespace-nowrap">الشعبة:</span>
            <div className="flex items-center gap-1.5">
              {currentGradeInfo.branches.map((branch) => {
                const isSelected = branch.id === currentBranch;
                return (
                  <button
                    key={branch.id}
                    id={`btn-branch-${branch.id}`}
                    onClick={() => onSelectBranch(branch.id)}
                    className={`px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-xs font-semibold"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {branch.name}
                  </button>
                );
              })}
            </div>
            <span className="text-slate-400 mr-auto text-2xs hidden sm:inline">
              {currentGradeInfo.branches.find((b) => b.id === currentBranch)?.description}
            </span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 border-t border-slate-200 overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-1 sm:gap-2 py-1.5 min-w-max">
          <button
            id="tab-curriculum"
            onClick={() => onSelectTab("curriculum")}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "curriculum"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            المنهج والملخصات
          </button>

          <button
            id="tab-quizzes"
            onClick={() => onSelectTab("quizzes")}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "quizzes"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <HelpCircle className="w-4 h-4 text-blue-600" />
            بنك الأسئلة والامتحانات
          </button>

          <button
            id="tab-ai-tutor"
            onClick={() => onSelectTab("ai_tutor")}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "ai_tutor"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Bot className="w-4 h-4 text-purple-600" />
            المعلم الذكي (شرح فوري)
            <span className="bg-purple-100 text-purple-700 text-2xs px-1.5 py-0.5 rounded-full font-bold">AI</span>
          </button>

          <button
            id="tab-solver"
            onClick={() => onSelectTab("solver")}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "solver"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            مساعد حل المسائل
          </button>

          <button
            id="tab-planner"
            onClick={() => onSelectTab("planner")}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "planner"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Calendar className="w-4 h-4 text-teal-600" />
            جدول وتنظيم المذاكرة
          </button>

          <button
            id="tab-pomodoro"
            onClick={() => onSelectTab("pomodoro")}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "pomodoro"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Timer className="w-4 h-4 text-rose-500" />
            مؤقت بومودورو
          </button>

          <button
            id="tab-notebook"
            onClick={() => onSelectTab("notebook")}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "notebook"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-600" />
            المحفوظات والملاحظات
            {bookmarkedCount > 0 && (
              <span className="bg-amber-100 text-amber-800 text-xs px-1.5 py-0.2 rounded-full font-bold">
                {bookmarkedCount}
              </span>
            )}
          </button>

          <button
            id="tab-profile"
            onClick={() => onSelectTab("profile")}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <User className="w-4 h-4 text-emerald-600" />
            {currentUser ? `حسابي (${currentUser.name.split(" ")[0]})` : "حسابي ورابط التطبيق"}
          </button>
        </nav>
      </div>
    </header>
  );
};
