export type GradeId = "grade1" | "grade2" | "grade2_bac" | "grade3" | "grade3_bac";

export type BranchId = "general" | "scientific" | "literary" | "sci_science" | "sci_math" | "bac_track";

export interface GradeInfo {
  id: GradeId;
  name: string;
  subtitle: string;
  badge: string;
  branches: {
    id: BranchId;
    name: string;
    description: string;
  }[];
}

export interface FormulaOrRule {
  title: string;
  formula: string;
  explanation: string;
  example?: string;
}

export interface Lesson {
  id: string;
  title: string;
  chapter: string;
  summary: string;
  keyPoints: string[];
  formulas?: FormulaOrRule[];
  examTips: string[];
}

export interface Subject {
  id: string;
  name: string;
  arabicName: string;
  iconName: string;
  color: string;
  gradeId: GradeId;
  branchIds: BranchId[];
  description: string;
  lessons: Lesson[];
  questionsCount: number;
}

export interface QuizQuestion {
  id: string;
  subjectId: string;
  subjectName: string;
  gradeId: GradeId;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "سهل" | "متوسط" | "مستويات تفكير عليا";
  year?: string;
}

export interface StudyTask {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  gradeId: GradeId;
  estimatedMinutes: number;
  completed: boolean;
  dueDate: string;
  notes?: string;
}

export interface SavedNote {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  createdAt: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  subject?: string;
  suggestedFollowUps?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  gradeId: GradeId;
  branchId: BranchId;
  targetCollege?: string;
  targetScorePercent?: number;
  streakDays: number;
  completedExamsCount: number;
  totalStudyMinutes: number;
  avatarId?: string;
  createdAt: string;
}

export type ActiveTab = "curriculum" | "quizzes" | "ai_tutor" | "solver" | "planner" | "pomodoro" | "notebook" | "profile";

