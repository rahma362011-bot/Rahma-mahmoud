import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Tutor Chat / Ask question
app.post("/api/ai/ask", async (req, res) => {
  try {
    const { question, grade, subject, context } = req.body;
    if (!question) {
      return res.status(400).json({ error: "السؤال مطلوب" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        reply: `مرحباً بك! يسعدني مساعدتك في مادة ${subject || "الدراسة"}. يرجى التأكد من تفعيل مفتاح Gemini في الإعدادات للاستفادة من الإجابات الفورية عبر الذكاء الاصطناعي.`
      });
    }

    const prompt = `أنت معلم ومرشد تعليمي متميز لطلاب الثانوية العامة والبكالوريا في العالم العربي (مصر والوطن العربي).
الصف الدراسي للطالب: ${grade || "الثانوية العامة"}
المادة: ${subject || "عام"}
السياق الإضافي: ${context || "استفسار مذاكرة عام"}

سؤال الطالب: "${question}"

المطلوب:
1. قدم شرحاً دقيقاً ومبسطاً وبأسلوب تربوي مشجع يركز على الفهم لا الحفظ، كما في نظام الامتحانات الحديث (نظام البابل شيت ونواتج التعلم).
2. إذا كان السؤال عن مسألة حسابية أو فيزيائية أو كيميائية، وضح خطوات الحل بالتسلسل مع القانون المستخدم.
3. إذا كان في النحو أو البلاغة، وضح الإعراب والقاعدة البلاغية والسر الجمالي.
4. اذكر نصيحة سريعة لعدم الوقوع في الخطأ في مثل هذا السؤال في الامتحان النهائي.
اكتب باللغة العربية الفصحى الواضحة والمنسقة مع استخدام نقاط وعناوين فرعية واضحة.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    return res.json({ reply: response.text || "عذراً، لم أستطع توليد إجابة في الوقت الحالي." });
  } catch (error: any) {
    console.error("AI Ask error:", error);
    return res.status(500).json({ error: error?.message || "حدث خطأ أثناء الاتصال بالمعلم الذكي" });
  }
});

// AI Dynamic Question Generator
app.post("/api/ai/generate-questions", async (req, res) => {
  try {
    const { grade, subject, topic, count = 3 } = req.body;
    const ai = getGeminiClient();
    
    if (!ai) {
      return res.status(503).json({
        error: "مفتاح الذكاء الاصطناعي غير متوفر",
        questions: []
      });
    }

    const prompt = `قم بإنشاء ${count} أسئلة اختيار من متعدد (نظام حديث / بابل شيت) لطلاب ${grade} في مادة ${subject} وتحديداً درس: "${topic || "المراجعة الشاملة"}".
لكل سؤال:
- نص السؤال بدقة يقيس مستويات الفهم والتطبيق.
- 4 خيارات (أ، ب، ج، د).
- رقم الخيار الصحيح (0 أو 1 أو 2 أو 3).
- شرح تفصيلي لسبب صحة هذا الخيار واستبعاد باقي الخيارات.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "نص السؤال" },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "أربعة خيارات للإجابة"
              },
              correctIndex: { type: Type.INTEGER, description: "مؤشر الإجابة الصحيحة من 0 إلى 3" },
              explanation: { type: Type.STRING, description: "تفسير سبب صحة الإجابة" }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    const jsonText = response.text?.trim() || "[]";
    const questions = JSON.parse(jsonText);
    return res.json({ questions });
  } catch (error: any) {
    console.error("Generate Questions error:", error);
    return res.status(500).json({ error: error?.message || "فشل توليد الأسئلة", questions: [] });
  }
});

// Step-by-Step Problem Solver
app.post("/api/ai/solve-step-by-step", async (req, res) => {
  try {
    const { problemText, subject, grade } = req.body;
    if (!problemText) {
      return res.status(400).json({ error: "نص المسألة أو الجملة مطلوب" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "مفتاح الذكاء الاصطناعي غير متوفر"
      });
    }

    const prompt = `قم بحل المسألة أو السؤال التالي خطوة بخطوة لطالب ${grade} في مادة ${subject}:
السؤال/المسألة: "${problemText}"

قدم الإجابة بصيغة JSON منظمة:
1. "summary": فكرة السؤال أو القانون الأساسي.
2. "steps": مصفوفة من الخطوات، كل خطوة تحتوي على "title" (عنوان الخطوة) و "detail" (الشرح والحسابات).
3. "finalAnswer": النتيجة النهائية الحاسمة.
4. "tips": ملاحظات تحذيرية لتجنب الأخطاء الشائعة في الامتحانات.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  detail: { type: Type.STRING }
                },
                required: ["title", "detail"]
              }
            },
            finalAnswer: { type: Type.STRING },
            tips: { type: Type.STRING }
          },
          required: ["summary", "steps", "finalAnswer", "tips"]
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json({ solution: parsed });
  } catch (error: any) {
    console.error("Solve step-by-step error:", error);
    return res.status(500).json({ error: error?.message || "فشل تحليل المسألة" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
