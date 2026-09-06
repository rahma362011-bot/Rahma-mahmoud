import React, { useState, useEffect } from "react";
import { GradeId, BranchId, QuizQuestion } from "../types";
import { QUESTIONS_BANK, SUBJECTS_DATA } from "../data/curriculumData";
import confetti from "canvas-confetti";
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight, 
  ArrowLeft, 
  Award, 
  Clock, 
  Loader2,
  Share2
} from "lucide-react";

interface QuizExamViewProps {
  currentGrade: GradeId;
  currentBranch: BranchId;
  bookmarkedQuestionIds: string[];
  onToggleBookmark: (question: QuizQuestion) => void;
  preSelectedSubjectId?: string | null;
}

export const QuizExamView: React.FC<QuizExamViewProps> = ({
  currentGrade,
  currentBranch,
  bookmarkedQuestionIds,
  onToggleBookmark,
  preSelectedSubjectId
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>(preSelectedSubjectId || "all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: number }>({});
  const [showExplanation, setShowExplanation] = useState<{ [questionId: string]: boolean }>({});
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Dynamic AI Question Generation State
  const [isGeneratingAIQuestions, setIsGeneratingAIQuestions] = useState(false);
  const [customAIQuestions, setCustomAIQuestions] = useState<QuizQuestion[]>([]);
  const [aiTopicPrompt, setAiTopicPrompt] = useState("");
  const [generationError, setGenerationError] = useState("");

  // Filter subjects for current grade & branch
  const availableSubjects = SUBJECTS_DATA.filter((sub) => {
    if (sub.gradeId !== currentGrade) return false;
    if (currentBranch === "general") return true;
    return sub.branchIds.includes(currentBranch) || sub.branchIds.includes("general");
  });

  // Base questions filtered
  const baseQuestions = QUESTIONS_BANK.filter((q) => {
    if (q.gradeId !== currentGrade) return false;
    if (selectedSubjectFilter !== "all" && q.subjectId !== selectedSubjectFilter) return false;
    return true;
  });

  // Combine with generated custom questions
  const activeQuestionsList = [...customAIQuestions, ...baseQuestions];
  const currentQuestion = activeQuestionsList[currentIndex];

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && !isExamCompleted) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isExamCompleted]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (index: number) => {
    if (!currentQuestion) return;
    if (selectedAnswers[currentQuestion.id] !== undefined) return; // already answered

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: index,
    }));

    setShowExplanation((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    activeQuestionsList.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return {
      correct,
      total: activeQuestionsList.length,
      percentage: activeQuestionsList.length > 0 ? Math.round((correct / activeQuestionsList.length) * 100) : 0,
    };
  };

  const handleFinishExam = () => {
    setIsExamCompleted(true);
    setIsTimerRunning(false);
    const score = calculateScore();
    if (score.percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // graceful fallback
      }
    }
  };

  const handleResetExam = () => {
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentIndex(0);
    setIsExamCompleted(false);
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  // Generate dynamic AI questions
  const handleGenerateAIQuiz = async () => {
    if (!aiTopicPrompt.trim()) {
      setGenerationError("يرجى كتابة اسم الدرس أو الموضوع الذي ترغب في إنشاء أسئلة عنه.");
      return;
    }

    setGenerationError("");
    setIsGeneratingAIQuestions(true);

    const selectedSub = availableSubjects.find((s) => s.id === selectedSubjectFilter) || availableSubjects[0];

    try {
      const response = await fetch("/api/ai/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade:
            currentGrade === "grade1"
              ? "الصف الأول الثانوي"
              : currentGrade === "grade2"
              ? "الصف الثاني الثانوي (عام)"
              : currentGrade === "grade2_bac"
              ? "الصف الثاني (تانية بكالوريا)"
              : currentGrade === "grade3"
              ? "الصف الثالث الثانوي (عام)"
              : "الصف الثالث (تالتة بكالوريا)",
          subject: selectedSub?.name || "المادة المقررة",
          topic: aiTopicPrompt,
          count: 3
        })
      });

      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        const formatted: QuizQuestion[] = data.questions.map((q: any, i: number) => ({
          id: `ai_${Date.now()}_${i}`,
          subjectId: selectedSub?.id || "general",
          subjectName: selectedSub?.name || "عام",
          gradeId: currentGrade,
          topic: aiTopicPrompt,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          difficulty: "متوسط",
          year: "توليد المعلم الذكي"
        }));

        setCustomAIQuestions((prev) => [...formatted, ...prev]);
        setCurrentIndex(0);
        setAiTopicPrompt("");
      } else {
        setGenerationError("لم نتمكن من توليد أسئلة في الوقت الحالي، يرجى المحاولة مرة أخرى.");
      }
    } catch (err: any) {
      setGenerationError("تعذر الاتصال بالخادم لتوليد الأسئلة. تأكد من اتصال الإنترنت.");
    } finally {
      setIsGeneratingAIQuestions(false);
    }
  };

  const score = calculateScore();

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              بنك الأسئلة والامتحانات
            </span>
            <span className="text-xs text-slate-500 font-medium">
              نظام البابل شيت الحديث والشرح الفوري
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
            امتحانات وتدريبات تفاعلية مجانية
          </h2>
        </div>

        {/* Filter by Subject & Timer */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-mono text-xs sm:text-sm font-bold">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          <select
            id="quiz-subject-filter"
            value={selectedSubjectFilter}
            onChange={(e) => {
              setSelectedSubjectFilter(e.target.value);
              setCurrentIndex(0);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="all">جميع المواد ({activeQuestionsList.length} سؤال)</option>
            {availableSubjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* AI Custom Quiz Generator Bar */}
      <div className="bg-linear-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-purple-800/40 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                توليد أسئلة جديدة بالذكاء الاصطناعي مجاناً
                <span className="bg-purple-500 text-white text-2xs px-2 py-0.5 rounded font-mono">Gemini AI</span>
              </h3>
              <p className="text-xs text-purple-200">
                اكتب أي درس أو فكرة تريد التدرب عليها وسيقوم المعلم الذكي بصياغة أسئلة حديثة مع الإجابة النموذجية فوراً.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              id="ai-quiz-prompt-input"
              placeholder="مثلاً: قاعدة لوشاتيليه، إعراب الأفعال، قوانين نيوتن..."
              value={aiTopicPrompt}
              onChange={(e) => setAiTopicPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerateAIQuiz()}
              className="bg-white/10 border border-white/20 placeholder:text-slate-400 text-white text-xs sm:text-sm px-3.5 py-2 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-400 w-full md:w-72"
            />
            <button
              id="btn-generate-ai-quiz"
              onClick={handleGenerateAIQuiz}
              disabled={isGeneratingAIQuestions}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
            >
              {isGeneratingAIQuestions ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري التوليد...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  ولّد أسئلة
                </>
              )}
            </button>
          </div>
        </div>

        {generationError && (
          <div className="mt-3 text-xs bg-rose-500/20 text-rose-200 p-2.5 rounded-lg border border-rose-500/30">
            {generationError}
          </div>
        )}
      </div>

      {/* Main Question Display or Finished Screen */}
      {!isExamCompleted ? (
        activeQuestionsList.length > 0 && currentQuestion ? (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {/* Top Question Progress Bar */}
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  السؤال {currentIndex + 1} من {activeQuestionsList.length}
                </span>
                <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md">
                  {currentQuestion.subjectName}
                </span>
                <span className="text-2xs text-slate-500 hidden sm:inline">
                  مستوى: {currentQuestion.difficulty} {currentQuestion.year && `• ${currentQuestion.year}`}
                </span>
              </div>

              {/* Bookmark Button */}
              <button
                id={`btn-bookmark-${currentQuestion.id}`}
                onClick={() => onToggleBookmark(currentQuestion)}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  bookmarkedQuestionIds.includes(currentQuestion.id)
                    ? "bg-amber-50 text-amber-700 border-amber-300"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {bookmarkedQuestionIds.includes(currentQuestion.id) ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-amber-600" />
                    <span className="hidden sm:inline">محفوظ بالملاحظات</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-slate-400" />
                    <span className="hidden sm:inline">حفظ للمراجعة</span>
                  </>
                )}
              </button>
            </div>

            {/* Question Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-xs font-bold text-emerald-700 uppercase">
                {currentQuestion.topic}
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-relaxed">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQuestion.options.map((option, optIdx) => {
                  const isAnswered = selectedAnswers[currentQuestion.id] !== undefined;
                  const isThisOptionChosen = selectedAnswers[currentQuestion.id] === optIdx;
                  const isThisCorrect = currentQuestion.correctIndex === optIdx;

                  let optionStyle = "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50/70 text-slate-800";
                  if (isAnswered) {
                    if (isThisCorrect) {
                      optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs";
                    } else if (isThisOptionChosen) {
                      optionStyle = "border-rose-500 bg-rose-50 text-rose-950 font-semibold";
                    } else {
                      optionStyle = "border-slate-200 bg-slate-50/50 text-slate-400 opacity-60";
                    }
                  }

                  const arabicLetters = ["أ", "ب", "ج", "د"];

                  return (
                    <button
                      key={optIdx}
                      id={`option-${currentQuestion.id}-${optIdx}`}
                      onClick={() => handleSelectOption(optIdx)}
                      disabled={isAnswered}
                      className={`w-full text-right p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isAnswered && isThisCorrect
                              ? "bg-emerald-600 text-white"
                              : isAnswered && isThisOptionChosen
                              ? "bg-rose-600 text-white"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {arabicLetters[optIdx] || optIdx + 1}
                        </span>
                        <span className="text-sm sm:text-base">{option}</span>
                      </div>

                      {isAnswered && isThisCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && isThisOptionChosen && !isThisCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card when answered */}
              {showExplanation[currentQuestion.id] && (
                <div
                  className={`p-5 rounded-xl border animate-in fade-in duration-200 ${
                    selectedAnswers[currentQuestion.id] === currentQuestion.correctIndex
                      ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                      : "bg-amber-50/80 border-amber-200 text-amber-950"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm mb-2">
                    {selectedAnswers[currentQuestion.id] === currentQuestion.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>إجابة صحيحة وممتازة! 🎉</span>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-5 h-5 text-amber-600" />
                        <span>توضيح الإجابة النموذجية والشرح:</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-800">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Question Controls */}
            <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex items-center justify-between">
              <button
                id="btn-prev-question"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                السابق
              </button>

              <div className="flex items-center gap-2">
                {currentIndex < activeQuestionsList.length - 1 ? (
                  <button
                    id="btn-next-question"
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    التالي
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    id="btn-finish-quiz"
                    onClick={handleFinishExam}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    إنهاء وعرض النتيجة
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
            <HelpCircle className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h4 className="text-base font-bold text-slate-700">لا توجد أسئلة لهذه المادة حالياً</h4>
            <p className="text-xs text-slate-400 mt-1">
              يمكنك استخدام مولد الأسئلة الذكي أعلاه لإنشاء أسئلة لأي موضوع فوراً!
            </p>
          </div>
        )
      ) : (
        /* Results Screen */
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-md text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full mx-auto bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
              نتيجة الاختبار التجريبي
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-['Alexandria',sans-serif]">
              {score.percentage >= 85 ? "ما شاء الله! مستوى امتياز 🏆" : score.percentage >= 60 ? "أداء طيب مع إمكانية تحسين 💪" : "بداية جيدة.. واصل التدريب والمراجعة 📚"}
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              استغرقت في هذا الاختبار: <span className="font-bold text-slate-700">{formatTimer(timerSeconds)}</span>
            </p>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-2xs text-slate-500 font-bold">الدرجة المئوية</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">{score.percentage}%</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-2xs text-slate-500 font-bold">الإجابات الصحيحة</span>
              <div className="text-2xl font-black text-blue-600 mt-1">{score.correct} / {score.total}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-2xs text-slate-500 font-bold">الأسئلة الخاطئة</span>
              <div className="text-2xl font-black text-rose-600 mt-1">{score.total - score.correct}</div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              id="btn-retry-quiz"
              onClick={handleResetExam}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              إعادة الاختبار من جديد
            </button>
            <button
              id="btn-review-questions"
              onClick={() => {
                setIsExamCompleted(false);
                setCurrentIndex(0);
              }}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-slate-200"
            >
              مراجعة الأسئلة وتفسيراتها
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
