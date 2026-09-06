import React, { useState } from "react";
import { GradeId, BranchId, Subject, Lesson } from "../types";
import { SUBJECTS_DATA, GRADES_DATA } from "../data/curriculumData";
import { 
  BookOpen, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Layers
} from "lucide-react";

interface CurriculumBrowserProps {
  currentGrade: GradeId;
  currentBranch: BranchId;
  onAskAIAboutLesson: (subjectName: string, lessonTitle: string) => void;
  onStartQuizForSubject: (subjectId: string) => void;
}

export const CurriculumBrowser: React.FC<CurriculumBrowserProps> = ({
  currentGrade,
  currentBranch,
  onAskAIAboutLesson,
  onStartQuizForSubject
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

  const availableSubjects = SUBJECTS_DATA.filter((sub) => {
    if (sub.gradeId !== currentGrade) return false;
    if (currentBranch === "general") return true;
    return sub.branchIds.includes(currentBranch) || sub.branchIds.includes("general");
  });

  const filteredSubjects = availableSubjects.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.arabicName.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.lessons.some((l) => l.title.toLowerCase().includes(q) || l.summary.toLowerCase().includes(q))
    );
  });

  const activeSubject = selectedSubjectId
    ? availableSubjects.find((s) => s.id === selectedSubjectId) || filteredSubjects[0]
    : filteredSubjects[0];

  const currentGradeName = GRADES_DATA.find((g) => g.id === currentGrade)?.name || "الثانوية العامة";

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {currentGradeName}
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-500 font-medium">
                {availableSubjects.length} مواد دراسية مقررة
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
              المنهج الدراسي والملخصات المركزة
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              شرح مبسط، خرائط ذهنية، القوانين الأساسية، وتكات الامتحانات لجميع المواد مجاناً وبدون أي اشتراك.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="curriculum-search"
              placeholder="ابحث عن درس، قانون، أو موضوع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Grid: Subjects and Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            قائمة المواد المقررة
          </h3>

          <div className="space-y-2">
            {filteredSubjects.map((sub) => {
              const isSelected = activeSubject?.id === sub.id;
              return (
                <button
                  key={sub.id}
                  id={`select-subject-${sub.id}`}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`w-full text-right p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10"
                      : "bg-white text-slate-800 border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                        isSelected ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base">{sub.name}</h4>
                      <p className={`text-xs ${isSelected ? "text-emerald-100" : "text-slate-500"}`}>
                        {sub.lessons.length} دروس ملخصة • {sub.questionsCount} سؤال تدريبي
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-md font-semibold ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    عرض
                  </span>
                </button>
              );
            })}

            {filteredSubjects.length === 0 && (
              <div className="bg-white p-8 text-center rounded-xl border border-slate-200 text-slate-500">
                <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">لم يتم العثور على مواد مطابقة لبحثك.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          {activeSubject ? (
            <div className="space-y-5">
              <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-medium mb-2">
                      {activeSubject.arabicName}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-['Alexandria',sans-serif]">
                      {activeSubject.name}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
                      {activeSubject.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-col gap-2">
                    <button
                      id={`quiz-now-${activeSubject.id}`}
                      onClick={() => onStartQuizForSubject(activeSubject.id)}
                      className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4" />
                      بدء تدريب وامتحان
                    </button>
                    <button
                      id={`ask-ai-subject-${activeSubject.id}`}
                      onClick={() => onAskAIAboutLesson(activeSubject.name, "أهم النقاط المتوقعة في الامتحان وتكات المادة")}
                      className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      اسأل المعلم الذكي
                    </button>
                  </div>
                </div>
              </div>

              {/* Lessons List */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  وحدات ودروس المادة
                </h4>

                {activeSubject.lessons.map((lesson: Lesson, idx: number) => {
                  const isExpanded = expandedLessonId === lesson.id || idx === 0;
                  return (
                    <div
                      key={lesson.id}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
                    >
                      <button
                        id={`lesson-header-${lesson.id}`}
                        onClick={() => setExpandedLessonId(isExpanded && expandedLessonId ? null : lesson.id)}
                        className="w-full text-right p-4 sm:p-5 flex items-start justify-between gap-3 hover:bg-slate-50/80 cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="text-2xs font-bold text-emerald-700 uppercase">
                              {lesson.chapter}
                            </span>
                            <h5 className="text-base font-bold text-slate-900 mt-0.5">
                              {lesson.title}
                            </h5>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 hidden sm:inline">
                            {isExpanded ? "طي المحتوى" : "عرض الشرح"}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/40 space-y-5">
                          <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <h6 className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                              ملخص الدرس المركز
                            </h6>
                            <p className="text-slate-700 text-sm leading-relaxed">
                              {lesson.summary}
                            </p>
                          </div>

                          {lesson.keyPoints && lesson.keyPoints.length > 0 && (
                            <div>
                              <h6 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                أهم نقاط الفهم والتركيز:
                              </h6>
                              <ul className="space-y-2">
                                {lesson.keyPoints.map((point, pIdx) => (
                                  <li
                                    key={pIdx}
                                    className="text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-100 flex items-start gap-2.5 shadow-2xs"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {lesson.formulas && lesson.formulas.length > 0 && (
                            <div className="space-y-2">
                              <h6 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                                <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
                                القوانين والقواعد الذهبية:
                              </h6>
                              <div className="grid grid-cols-1 gap-3">
                                {lesson.formulas.map((form, fIdx) => (
                                  <div
                                    key={fIdx}
                                    className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 space-y-1.5"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-xs text-blue-900">{form.title}</span>
                                      <span className="text-2xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-bold">
                                        قانون أساسي
                                      </span>
                                    </div>
                                    <div className="bg-white p-2.5 rounded-lg border border-blue-100 font-mono text-xs sm:text-sm text-blue-950 font-bold text-left ltr dir-ltr">
                                      {form.formula}
                                    </div>
                                    <p className="text-xs text-blue-800">{form.explanation}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {lesson.examTips && lesson.examTips.length > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm mb-2">
                                <Sparkles className="w-4 h-4 text-amber-600" />
                                تكات الامتحان وخداع الأسئلة (احذر هذه الفخاخ):
                              </div>
                              <ul className="space-y-1.5">
                                {lesson.examTips.map((tip, tIdx) => (
                                  <li key={tIdx} className="text-xs sm:text-sm text-amber-900 flex items-start gap-2">
                                    <span className="font-bold text-amber-700">⚠️</span>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="pt-2 flex flex-wrap items-center gap-2 justify-end">
                            <button
                              id={`ask-ai-lesson-${lesson.id}`}
                              onClick={() => onAskAIAboutLesson(activeSubject.name, lesson.title)}
                              className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                              اشرح لي هذا الدرس عبر المعلم الذكي
                            </button>
                            <button
                              id={`quiz-lesson-${lesson.id}`}
                              onClick={() => onStartQuizForSubject(activeSubject.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                              حل أسئلة على هذا الموضوع
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <h4 className="text-base font-bold text-slate-700">اختر مادة لعرض المنهج والشروحات</h4>
              <p className="text-xs text-slate-400 mt-1">تتوفر جميع ملخصات الصف والشعبة الحالية مجاناً.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
