import React, { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Zap, 
  Flame, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Sparkles
} from "lucide-react";

type TimerMode = "focus" | "shortBreak" | "longBreak";

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mode durations in seconds
  const DURATIONS: Record<TimerMode, number> = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  // Switch mode helper
  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(DURATIONS[newMode]);
    setIsRunning(false);
  };

  // Play synthetic pleasant chime when timer reaches 0
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    let interval: any;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      playChime();
      setIsRunning(false);
      if (mode === "focus") {
        setSessionsCompleted((prev) => prev + 1);
        switchMode("shortBreak");
      } else {
        switchMode("focus");
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  const progressPercent = Math.round(((DURATIONS[mode] - timeLeft) / DURATIONS[mode]) * 100);

  const tips = [
    "اغلق إشعارات هاتفك تماماً أثناء جلسة الـ 25 دقيقة لتدخل في حالة التركيز العميق (Deep Work).",
    "ذاكر وأنت ممسك بالقلم والورقة، فالتدوين اليدوي يرسخ المعلومات في الذاكرة طويلة المدى بنسبة 40% أكثر.",
    "في فترة الراحة (5 دقائق): انهض، اشرب ماء، وتنفس بعمق.. ابتعد تماماً عن تصفح الفيديوهات القصيرة.",
    "قسّم الدروس الطويلة إلى أجزاء صغيرة (Chuncking) لتسهيل استيعابها بلا ملل أو إرهاق."
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs text-center">
        <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1 rounded-full inline-block mb-1">
          تقنية بومودورو للمذاكرة الفعالة
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
          مؤقت التركيز الذهني العميق
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          25 دقيقة مذاكرة خالية من أي مشتتات + 5 دقائق راحة لاستعادة النشاط.
        </p>
      </div>

      {/* Main Timer Display Box */}
      <div className="bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl text-center space-y-8 relative overflow-hidden">
        {/* Glow ambient background */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${
            mode === "focus" ? "bg-emerald-500" : "bg-blue-500"
          }`}
        />

        {/* Mode Selector Buttons */}
        <div className="flex items-center justify-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 max-w-sm mx-auto relative z-10">
          <button
            onClick={() => switchMode("focus")}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              mode === "focus"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            جلسة مذاكرة (25د)
          </button>
          <button
            onClick={() => switchMode("shortBreak")}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              mode === "shortBreak"
                ? "bg-blue-500 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            راحة قصيرة (5د)
          </button>
          <button
            onClick={() => switchMode("longBreak")}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              mode === "longBreak"
                ? "bg-purple-500 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            راحة طويلة (15د)
          </button>
        </div>

        {/* Large Time Display */}
        <div className="relative z-10 space-y-2">
          <div className="font-mono text-6xl sm:text-8xl font-black tracking-wider text-white drop-shadow-md">
            {formattedTime}
          </div>
          <div className="text-xs sm:text-sm text-slate-400 font-medium">
            {mode === "focus" ? "💪 تركيز تام بدون هواتف أو تشتت" : "☕ استرح وتنفس بعمق واشرب ماء"}
          </div>
        </div>

        {/* Circular / Line Progress */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden max-w-md mx-auto relative z-10">
          <div
            className={`h-full transition-all duration-300 ${
              mode === "focus" ? "bg-emerald-500" : "bg-blue-500"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4 relative z-10">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-4 font-extrabold text-base rounded-2xl transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
              isRunning
                ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                : mode === "focus"
                ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                : "bg-blue-500 hover:bg-blue-400 text-white"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>إيقاف مؤقت</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>بدء الجلسة الآن</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(DURATIONS[mode]);
            }}
            className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 transition-all cursor-pointer"
            title="إعادة تعيين المؤقت"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 transition-all cursor-pointer"
            title={soundEnabled ? "كتم صوت التنبيه" : "تفعيل صوت التنبيه"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Sessions Completed Pill */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 relative z-10">
          <Flame className="w-4 h-4 text-amber-500" />
          <span>أنجزت اليوم: <strong className="text-white">{sessionsCompleted}</strong> جلسات تركيز كاملة</span>
        </div>
      </div>

      {/* Motivational Advice Cards */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          نصائح ذهبية لرفع التركيز أثناء المذاكرة:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tips.map((tip, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 text-xs text-slate-700 leading-relaxed flex items-start gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
