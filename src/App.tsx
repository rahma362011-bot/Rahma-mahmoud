import React, { useState, useEffect } from "react";
import { GradeId, BranchId, ActiveTab, QuizQuestion, StudyTask, SavedNote, UserProfile } from "./types";
import { INITIAL_STUDY_TASKS, QUESTIONS_BANK } from "./data/curriculumData";
import { Header } from "./components/Header";
import { CurriculumBrowser } from "./components/CurriculumBrowser";
import { QuizExamView } from "./components/QuizExamView";
import { AITutorView } from "./components/AITutorView";
import { ProblemSolverView } from "./components/ProblemSolverView";
import { StudyPlannerView } from "./components/StudyPlannerView";
import { PomodoroTimer } from "./components/PomodoroTimer";
import { BookmarksNotebookView } from "./components/BookmarksNotebookView";
import { AuthModal } from "./components/AuthModal";
import { UserProfileView } from "./components/UserProfileView";
import { InstallAppModal } from "./components/InstallAppModal";
import { 
  GraduationCap, 
  Heart, 
  Wifi, 
  ShieldCheck, 
  CheckCircle2, 
  BookOpen, 
  Sparkles,
  Award
} from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("thaker_current_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const [currentGrade, setCurrentGrade] = useState<GradeId>(currentUser?.gradeId || "grade3");
  const [currentBranch, setCurrentBranch] = useState<BranchId>(currentUser?.branchId || "sci_science");
  const [activeTab, setActiveTab] = useState<ActiveTab>("curriculum");

  // Bookmarks state with localStorage persistence
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("thaker_bookmarks");
      return saved ? JSON.parse(saved) : ["q_g3_1", "q_g3_5"];
    } catch {
      return ["q_g3_1", "q_g3_5"];
    }
  });

  // Study tasks with localStorage persistence
  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    try {
      const saved = localStorage.getItem("thaker_tasks");
      return saved ? JSON.parse(saved) : INITIAL_STUDY_TASKS;
    } catch {
      return INITIAL_STUDY_TASKS;
    }
  });

  // Notes with localStorage persistence
  const [notes, setNotes] = useState<SavedNote[]>(() => {
    try {
      const saved = localStorage.getItem("thaker_notes");
      return saved ? JSON.parse(saved) : [
        {
          id: "note_1",
          subjectId: "الفيزياء",
          title: "تكة زاوية قانون فاراداي والدينامو",
          content: "في قانون الدينامو: الزاوية θ هي المحصورة بين العمودي على مستوى الملف وخطوط الفيض، أو بين اتجاه حركة السلك والفيض. إذا ذكر زاوية الملف مع المجال نطرحها من 90°!",
          createdAt: "اليوم",
          tags: ["فيزياء", "قوانين"]
        },
        {
          id: "note_2",
          subjectId: "اللغة العربية",
          title: "الفرق بين واو المعية وواو العطف والحال",
          content: "واو المعية يليها مفعول معه منصوب إذا استحال العطف، مثل: سرت والنيلَ. أما إذا صح الاشتراك فهي واو عطف.",
          createdAt: "أمس",
          tags: ["نحو", "ثانوية"]
        }
      ];
    } catch {
      return [];
    }
  });

  // Cross-component parameters
  const [aiTutorInitialPrompt, setAiTutorInitialPrompt] = useState("");
  const [aiTutorInitialSubject, setAiTutorInitialSubject] = useState("");
  const [preSelectedQuizSubject, setPreSelectedQuizSubject] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("thaker_bookmarks", JSON.stringify(bookmarkedQuestionIds));
    } catch (e) {}
  }, [bookmarkedQuestionIds]);

  useEffect(() => {
    try {
      localStorage.setItem("thaker_tasks", JSON.stringify(tasks));
    } catch (e) {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem("thaker_notes", JSON.stringify(notes));
    } catch (e) {}
  }, [notes]);

  // Bookmark toggler
  const handleToggleBookmark = (question: QuizQuestion) => {
    setBookmarkedQuestionIds((prev) =>
      prev.includes(question.id)
        ? prev.filter((id) => id !== question.id)
        : [...prev, question.id]
    );
  };

  const handleRemoveBookmark = (questionId: string) => {
    setBookmarkedQuestionIds((prev) => prev.filter((id) => id !== questionId));
  };

  // Task handlers
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (newTask: Omit<StudyTask, "id">) => {
    const taskWithId: StudyTask = {
      ...newTask,
      id: `task_${Date.now()}`
    };
    setTasks((prev) => [taskWithId, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Notes handlers
  const handleAddNote = (newNote: Omit<SavedNote, "id" | "createdAt">) => {
    const noteWithMeta: SavedNote = {
      ...newNote,
      id: `note_${Date.now()}`,
      createdAt: new Date().toLocaleDateString("ar-EG")
    };
    setNotes((prev) => [noteWithMeta, ...prev]);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  // Auth & Profile handlers
  const handleLogout = () => {
    try {
      localStorage.removeItem("thaker_current_user");
    } catch (e) {}
    setCurrentUser(null);
  };

  const handleUpdateUser = (updated: UserProfile) => {
    setCurrentUser(updated);
    try {
      localStorage.setItem("thaker_current_user", JSON.stringify(updated));
    } catch (e) {}
  };

  // Cross-navigation triggers
  const handleAskAIAboutLesson = (subjectName: string, lessonTitle: string) => {
    setAiTutorInitialSubject(subjectName);
    setAiTutorInitialPrompt(`اشرح لي بالتفصيل وبأسلوب مبسط درس "${lessonTitle}" في مادة ${subjectName}، مع أهم النقاط الامتحانية والتكات الشائعة.`);
    setActiveTab("ai_tutor");
  };

  const handleStartQuizForSubject = (subjectId: string) => {
    setPreSelectedQuizSubject(subjectId);
    setActiveTab("quizzes");
  };

  // Filter bookmarked questions objects
  const bookmarkedQuestions = QUESTIONS_BANK.filter((q) =>
    bookmarkedQuestionIds.includes(q.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white font-['Tajawal',sans-serif]">
      {/* App Header */}
      <Header
        currentGrade={currentGrade}
        onSelectGrade={setCurrentGrade}
        currentBranch={currentBranch}
        onSelectBranch={setCurrentBranch}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        bookmarkedCount={bookmarkedQuestionIds.length}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8">
        {activeTab === "curriculum" && (
          <CurriculumBrowser
            currentGrade={currentGrade}
            currentBranch={currentBranch}
            onAskAIAboutLesson={handleAskAIAboutLesson}
            onStartQuizForSubject={handleStartQuizForSubject}
          />
        )}

        {activeTab === "quizzes" && (
          <QuizExamView
            currentGrade={currentGrade}
            currentBranch={currentBranch}
            bookmarkedQuestionIds={bookmarkedQuestionIds}
            onToggleBookmark={handleToggleBookmark}
            preSelectedSubjectId={preSelectedQuizSubject}
          />
        )}

        {activeTab === "ai_tutor" && (
          <AITutorView
            currentGrade={currentGrade}
            currentBranch={currentBranch}
            initialQuestion={aiTutorInitialPrompt}
            initialSubject={aiTutorInitialSubject}
          />
        )}

        {activeTab === "solver" && (
          <ProblemSolverView
            currentGrade={currentGrade}
            currentBranch={currentBranch}
          />
        )}

        {activeTab === "planner" && (
          <StudyPlannerView
            currentGrade={currentGrade}
            currentBranch={currentBranch}
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === "pomodoro" && <PomodoroTimer />}

        {activeTab === "notebook" && (
          <BookmarksNotebookView
            bookmarkedQuestions={bookmarkedQuestions}
            onRemoveBookmark={handleRemoveBookmark}
            notes={notes}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {activeTab === "profile" && (
          <UserProfileView
            user={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            currentGrade={currentGrade}
            currentBranch={currentBranch}
            bookmarkedCount={bookmarkedQuestionIds.length}
            tasksCount={tasks.length}
            completedTasksCount={tasks.filter((t) => t.completed).length}
            notesCount={notes.length}
          />
        )}
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setCurrentGrade(user.gradeId);
          setCurrentBranch(user.branchId);
        }}
        currentGrade={currentGrade}
        currentBranch={currentBranch}
      />

      {/* Install App Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8 px-4 text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block font-['Alexandria',sans-serif]">
                منصة ذاكِر للثانوية العامة والبكالوريا
              </span>
              <span className="text-slate-400 text-2xs">
                مبادرة تعليمية مجانية 100% لدعم جميع طلاب الثانوي في مصر والوطن العربي
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              مجاني بالكامل بدون أي رسوم
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-blue-500" />
              يعمل أونلاين عبر الإنترنت
            </span>
            <span>•</span>
            <span>الصف الأول والثاني والثالث الثانوي</span>
          </div>

          <div className="text-slate-400 text-2xs">
            صُمم لمساعدتك على التفوق وتحقيق حلمك الدراسي 🎓
          </div>
        </div>
      </footer>
    </div>
  );
}
