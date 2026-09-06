import React, { useState } from "react";
import { GradeId, BranchId } from "../types";
import { 
  Sparkles, 
  Calculator, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  Copy, 
  Check
} from "lucide-react";

interface ProblemSolverViewProps {
  currentGrade: GradeId;
  currentBranch: BranchId;
}

interface SolutionResult {
  summary: string;
  steps: { title: string; detail: string }[];
  finalAnswer: string;
  tips: string;
}

export const ProblemSolverView: React.FC<ProblemSolverViewProps> = ({
  currentGrade,
  currentBranch
}) => {
  const [problemText, setProblemText] = useState("");
  const [subject, setSubject] = useState("الفيزياء والرياضيات");
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<SolutionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const sampleProblems = [
    {
      title: "مسألة دينامو (فيزياء 3 ثانوي)",
      text: "ملف دينامو تيار متردد مساحته 0.02 m² وعدد لفاته 100 لفة يدور في مجال مغناطيسي كثافة فيضه 0.1 T بمعدل 50 Hz. احسب القيمة العظمى للقوة الدافعة الكهربية المستحثة والقيمة اللحظية بعد 1/300 ثانية من الوضع العمودي."
    },
    {
      title: "مسألة DNA وقواعد نيتروجينية (أحياء 3 ثانوي)",
      text: "قطعة من لولب مزدوج لـ DNA تحتوي على 1000 لفة كاملة، فإذا كانت نسبة السيتوزين 30%، احسب عدد كل من: القواعد النيتروجينية الكلية، عدد قواعد الثايمين، وعدد الروابط الهيدروجينية الإجمالية."
    },
    {
      title: "معادلة حركة بعجلة (أولى ثانوي)",
      text: "سيارة تسير بسرعة ابتدائية 15 m/s وتتباطأ بعجلة منتظمة قدرها 3 m/s² حتى توقفت تماماً. احسب المسافة المقطوعة والزمن اللازم لتوقف السيارة."
    },
    {
      title: "إعراب جملة شائكة (لغة عربية)",
      text: "أعرب إعراباً تفصيلياً مع ذكر علامات الإعراب: 'إنما المؤمنون إخوة يرجون رحمة ربهم'."
    }
  ];

  const handleSolve = async (textToSolve?: string) => {
    const text = textToSolve || problemText;
    if (!text.trim() || isLoading) return;

    setErrorMsg("");
    setIsLoading(true);
    setSolution(null);

    try {
      const res = await fetch("/api/ai/solve-step-by-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemText: text,
          subject,
          grade:
            currentGrade === "grade1"
              ? "الصف الأول الثانوي"
              : currentGrade === "grade2"
              ? "الصف الثاني الثانوي (عام)"
              : currentGrade === "grade2_bac"
              ? "الصف الثاني (تانية بكالوريا)"
              : currentGrade === "grade3"
              ? "الصف الثالث الثانوي (عام)"
              : "الصف الثالث (تالتة بكالوريا)"
        })
      });

      const data = await res.json();
      if (data.solution && data.solution.steps) {
        setSolution(data.solution);
      } else {
        setErrorMsg(data.error || "تعذر تحليل المسألة بالصيغة المطلوبة، يرجى المحاولة بصياغة أخرى.");
      }
    } catch (err: any) {
      setErrorMsg("حدث خطأ أثناء الاتصال بالخادم الذكي. تأكد من اتصال الإنترنت.");
    } finally {
      setIsLoading(false);
    }
  };

  const copySolution = () => {
    if (!solution) return;
    const text = `فكرة المسألة: ${solution.summary}\nالخطوات:\n${solution.steps
      .map((s, i) => `${i + 1}. ${s.title}: ${s.detail}`)
      .join("\n")}\nالناتج النهائي: ${solution.finalAnswer}\nنصيحة الامتحان: ${solution.tips}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                مساعد حل المسائل العلمي والرياضي
              </span>
              <span className="text-xs text-slate-500 font-medium">خطوة بخطوة مع القوانين</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
              مفكك المسائل والمعادلات الذكي
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              الصق أي مسألة فيزياء أو كيمياء أو تفاضل أو نحو وسيقوم المساعد بتفكيك المعطيات وتطبيق القانون والحل خطوة بخطوة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              id="solver-subject-select"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="الفيزياء والرياضيات">فيزياء ورياضيات</option>
              <option value="الكيمياء والمسائل الكمية">كيمياء ومسائل المول</option>
              <option value="الأحياء والبيولوجيا الجزيئية">أحياء وحسابات الوراثة</option>
              <option value="اللغة العربية والنحو">إعراب وقواعد نحوية</option>
            </select>
          </div>
        </div>
      </div>

      {/* Input Form & Quick Samples */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <label htmlFor="problem-input" className="block text-xs font-bold text-slate-700 mb-2">
            أدخل نص المسألة أو السؤال هنا:
          </label>
          <textarea
            id="problem-input"
            rows={4}
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            placeholder="اكتب المعطيات والمطلوب بالتفصيل (مثلاً: سقط جسم كتلته 2kg من ارتفاع 20m... أو اكتب جملة نحوية للإعراب)"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 placeholder:text-slate-400"
          />
        </div>

        {/* Quick Samples */}
        <div>
          <span className="text-2xs font-bold text-slate-500 block mb-2">نماذج جاهزة لتجربتها فوراً:</span>
          <div className="flex flex-wrap gap-2">
            {sampleProblems.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                id={`sample-prob-${idx}`}
                onClick={() => {
                  setProblemText(sample.text);
                  handleSolve(sample.text);
                }}
                className="text-xs bg-slate-100 hover:bg-amber-50 hover:text-amber-900 border border-slate-200 px-3 py-1.5 rounded-lg transition-all text-slate-700 cursor-pointer"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            id="btn-solve-now"
            onClick={() => handleSolve()}
            disabled={!problemText.trim() || isLoading}
            className="px-6 py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري التفكيك والحل خطوة بخطوة...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                تفكيك وحل المسألة الآن
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Solution Display Card */}
      {solution && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden animate-in fade-in duration-300">
          {/* Solution Header */}
          <div className="bg-linear-to-r from-amber-600 to-orange-600 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6" />
              <div>
                <h3 className="font-extrabold text-base sm:text-lg">الحل النموذجي والتفصيلي</h3>
                <span className="text-2xs text-amber-100">تم التحليل وفق القوانين المعتمدة</span>
              </div>
            </div>

            <button
              onClick={copySolution}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "تم النسخ" : "نسخ الحل"}</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* 1. Summary / Idea */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
              <span className="text-2xs font-bold text-amber-800 uppercase block mb-1">
                فكرة المسألة والقانون المستخدم:
              </span>
              <p className="text-sm font-semibold text-amber-950">{solution.summary}</p>
            </div>

            {/* 2. Steps */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-600" />
                خطوات الحل المنظمة:
              </h4>

              <div className="space-y-3">
                {solution.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h5 className="font-bold text-sm text-slate-900">{step.title}</h5>
                    </div>
                    <p className="text-sm text-slate-700 mr-8 leading-relaxed font-mono whitespace-pre-line dir-auto">
                      {step.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Final Answer */}
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-5 text-center sm:text-right flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase block">الناتج النهائي الحاسم:</span>
                <div className="text-xl sm:text-2xl font-black text-emerald-950 mt-0.5">
                  {solution.finalAnswer}
                </div>
              </div>
              <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0">
                إجابة مؤكدة ✓
              </span>
            </div>

            {/* 4. Tips / Pitfalls */}
            {solution.tips && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs text-blue-900 block mb-1">
                    نصيحة لمنع الخطأ في الامتحان:
                  </span>
                  <p className="text-xs sm:text-sm text-blue-950 leading-relaxed">
                    {solution.tips}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
