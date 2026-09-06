import { GradeInfo, Subject, QuizQuestion } from "../types";
import { GRADES_DATA } from "./grades";
import { GRADE1_SUBJECTS } from "./subjectsGrade1";
import { GRADE2_SUBJECTS } from "./subjectsGrade2";
import { GRADE3_SUBJECTS } from "./subjectsGrade3";
import { QUESTIONS_BANK } from "./questionsBank";

export { GRADES_DATA } from "./grades";
export { QUESTIONS_BANK } from "./questionsBank";

export const SUBJECTS_DATA: Subject[] = [
  ...GRADE1_SUBJECTS,
  ...GRADE2_SUBJECTS,
  ...GRADE3_SUBJECTS
];

export const INITIAL_STUDY_TASKS = [
  {
    id: "task_1",
    title: "مراجعة وحل تدريبات النظم البيئية وشذوذ كثافة الماء",
    subjectId: "g1_integrated_science",
    subjectName: "العلوم المتكاملة",
    gradeId: "grade1" as const,
    estimatedMinutes: 35,
    completed: false,
    dueDate: "اليوم"
  },
  {
    id: "task_2",
    title: "حل 20 سؤال على كان التامة وأخواتها وكاد",
    subjectId: "g1_arabic",
    subjectName: "اللغة العربية",
    gradeId: "grade1" as const,
    estimatedMinutes: 30,
    completed: false,
    dueDate: "اليوم"
  },
  {
    id: "task_3",
    title: "تطبيق قواعد انكسار الضوء وقانون سنل (تانية ثانوي)",
    subjectId: "g2_physics",
    subjectName: "الفيزياء (تانية ثانوي)",
    gradeId: "grade2" as const,
    estimatedMinutes: 45,
    completed: false,
    dueDate: "غداً"
  },
  {
    id: "task_4",
    title: "مذاكرة آلية الانقباض العضلي ونظرية هكسلي (3 ثانوي)",
    subjectId: "g3_biology",
    subjectName: "الأحياء",
    gradeId: "grade3" as const,
    estimatedMinutes: 50,
    completed: true,
    dueDate: "أمس"
  },
  {
    id: "task_5",
    title: "تطبيق قانون كيرشوف على 5 دوائر كهربية مركبة",
    subjectId: "g3_physics",
    subjectName: "الفيزياء",
    gradeId: "grade3" as const,
    estimatedMinutes: 60,
    completed: false,
    dueDate: "غداً"
  }
];
