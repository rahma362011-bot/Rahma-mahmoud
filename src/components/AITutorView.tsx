import React, { useState } from "react";
import { GradeId, BranchId, ChatMessage } from "../types";
import { SUBJECTS_DATA } from "../data/curriculumData";
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Loader2, 
  HelpCircle, 
  RefreshCw, 
  Lightbulb, 
  BookOpen, 
  CheckCircle2
} from "lucide-react";

interface AITutorViewProps {
  currentGrade: GradeId;
  currentBranch: BranchId;
  initialQuestion?: string;
  initialSubject?: string;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  currentGrade,
  currentBranch,
  initialQuestion = "",
  initialSubject = ""
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome_msg",
      sender: "ai",
      text: `أهلاً بك يا بطل! أنا معلمك ومرشدك الذكي لشهادة الثانوية العامة والبكالوريا.
أنا متاح لمساعدتك مجاناً على مدار الساعة عبر الإنترنت. 
يمكنك سؤالي عن:
• شرح أي درس صعب في الفيزياء، الكيمياء، الأحياء، أو التاريخ والجغرافيا
• إعراب أي جملة نحوية أو استخراج مواطن البلاغة
• فهم القوانين والمسائل الرياضية خطوة بخطوة
• نصائح للمذاكرة وطرق عدم نسيان المعلومات في ليلة الامتحان.

ما السؤال أو الدرس الذي يشغل بالك اليوم؟`,
      timestamp: "الآن",
      suggestedFollowUps: [
        "كيف أفرق بين كان التامة والناقصة بسهولة؟",
        "خطوات حل مسائل قانون كيرشوف بدون خربطة في الإشارات",
        "توضيح قاعدة ماركونيكوف بمثال كيميائي بسيط",
        "أهم نقاط ونواتج التعلم في ثورة 1919"
      ]
    }
  ]);

  const [inputText, setInputText] = useState(initialQuestion);
  const [selectedSubject, setSelectedSubject] = useState(initialSubject || "عام");
  const [isLoading, setIsLoading] = useState(false);

  const relevantSubjects = SUBJECTS_DATA.filter((sub) => {
    if (sub.gradeId !== currentGrade) return false;
    if (currentBranch === "general") return true;
    return sub.branchIds.includes(currentBranch) || sub.branchIds.includes("general");
  });

  const gradeTitle =
    currentGrade === "grade1"
      ? "الصف الأول الثانوي"
      : currentGrade === "grade2"
      ? "الصف الثاني الثانوي (عام)"
      : currentGrade === "grade2_bac"
      ? "الصف الثاني (تانية بكالوريا)"
      : currentGrade === "grade3"
      ? "الصف الثالث الثانوي (عام)"
      : "الصف الثالث (تالتة بكالوريا)";

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          grade: gradeTitle,
          subject: selectedSubject,
          context: `شعبة الطالب: ${currentBranch}`
        })
      });

      const data = await res.json();
      const aiReplyText = data.reply || data.error || "عذراً، لم أستطع الرد حالياً.";

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: "ai",
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
        suggestedFollowUps: [
          "هل يمكن إعطائي مثالاً تطبيقيّاً على هذا الشرح؟",
          "ما هي الخدع الشائعة في هذا السؤال بالامتحان؟",
          "أعطني سؤال اختيار من متعدد مع إجابته لاختبار فهمي"
        ]
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: "ai",
          text: "تعذر الاتصال بالخادم الآن، يرجى التأكد من اتصال الإنترنت ثم إعادة المحاولة.",
          timestamp: "الآن"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-purple-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shadow-inner">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-500/20 text-purple-300 border border-purple-400/30 text-2xs px-2.5 py-0.5 rounded-full font-bold">
                  مدعوم بالذكاء الاصطناعي مجاناً
                </span>
                <span className="text-2xs text-emerald-400 flex items-center gap-1 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  متاح الآن 24/7
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Alexandria',sans-serif] mt-1">
                المعلم الذكي الخاص بك ({gradeTitle})
              </h2>
              <p className="text-purple-200 text-xs sm:text-sm mt-0.5">
                اسأل عن أي نقطة غامضة، قاعدة نحوية، مسألة فيزيائية، أو قانون علمي وسيقوم بشرحها بأسلوب الامتحانات الحديثة.
              </p>
            </div>
          </div>

          <div className="bg-white/10 p-2 rounded-xl border border-white/10 text-xs shrink-0">
            <span className="text-purple-200 block text-2xs mb-1">المادة المحددة:</span>
            <select
              id="ai-tutor-subject-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-purple-950 text-white border border-purple-600 rounded-lg px-2.5 py-1 text-xs focus:ring-2 focus:ring-purple-400"
            >
              <option value="عام">استفسار عام / توجيه مذاكرة</option>
              {relevantSubjects.map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-[520px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAI = msg.sender === "ai";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAI ? "items-start" : "items-start flex-row-reverse"}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isAI
                      ? "bg-purple-100 text-purple-700 border border-purple-200"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {isAI ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                    isAI
                      ? "bg-slate-50 border border-slate-200 text-slate-800"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1 text-2xs opacity-70">
                    <span className="font-bold">{isAI ? "المعلم الذكي" : "أنت"}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div>{msg.text}</div>

                  {/* Suggested Follow-ups */}
                  {isAI && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1.5">
                      <span className="text-2xs font-bold text-slate-500 block">أسئلة مقترحة سريعة:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedFollowUps.map((prompt, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSendMessage(prompt)}
                            disabled={isLoading}
                            className="text-xs bg-white text-purple-800 border border-purple-200 hover:bg-purple-50 px-2.5 py-1 rounded-lg transition-all text-right cursor-pointer"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-100 border border-slate-200 text-slate-600 px-4 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span>المعلم الذكي يقوم بتحضير الشرح وتنسيق الإجابة النموذجية...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              id="ai-tutor-input"
              placeholder="اكتب سؤالك أو اسم الدرس أو المسألة هنا بالتفصيل..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
            <button
              type="submit"
              id="btn-send-ai-question"
              disabled={!inputText.trim() || isLoading}
              className="px-5 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>إرسال</span>
                  <Send className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 px-1 text-2xs text-slate-400">
            <span>مدعوم بنموذج Google Gemini الفائق لمناهج الثانوية العامة</span>
            <span>مجاني 100% بدون أي رسوم</span>
          </div>
        </div>
      </div>
    </div>
  );
};
