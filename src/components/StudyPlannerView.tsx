import React, { useState } from "react";
import { GradeId, BranchId, StudyTask } from "../types";
import { SUBJECTS_DATA } from "../data/curriculumData";
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Clock, 
  Flame, 
  TrendingUp, 
  BookOpen
} from "lucide-react";

interface StudyPlannerViewProps {
  currentGrade: GradeId;
  currentBranch: BranchId;
  tasks: StudyTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<StudyTask, "id">) => void;
  onDeleteTask: (taskId: string) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  currentGrade,
  currentBranch,
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask
}) => {
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskSubjectId, setNewTaskSubjectId] = useState("");
  const [newTaskMinutes, setNewTaskMinutes] = useState(45);
  const [newTaskDueDate, setNewTaskDueDate] = useState("اليوم");

  const availableSubjects = SUBJECTS_DATA.filter((sub) => {
    if (sub.gradeId !== currentGrade) return false;
    if (currentBranch === "general") return true;
    return sub.branchIds.includes(currentBranch) || sub.branchIds.includes("general");
  });

  const gradeTasks = tasks.filter((t) => t.gradeId === currentGrade);
  const completedCount = gradeTasks.filter((t) => t.completed).length;
  const progressPercent = gradeTasks.length > 0 ? Math.round((completedCount / gradeTasks.length) * 100) : 0;
  const totalMinutes = gradeTasks.reduce((acc, t) => acc + (t.completed ? t.estimatedMinutes : 0), 0);

  const handleSubmitNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const sub = availableSubjects.find((s) => s.id === newTaskSubjectId) || availableSubjects[0];

    onAddTask({
      title: newTaskTitle,
      subjectId: sub?.id || "general",
      subjectName: sub?.name || "عام",
      gradeId: currentGrade,
      estimatedMinutes: Number(newTaskMinutes) || 45,
      completed: false,
      dueDate: newTaskDueDate || "اليوم"
    });

    setNewTaskTitle("");
    setIsAddingModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Progress Cards */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                جدول وتنظيم المذاكرة اليومي
              </span>
              <span className="text-xs text-slate-500 font-medium">خطتك للتفوق في الثانوية</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
              جدول المهام والإنجاز اليومي
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              نظم ساعات مذاكرتك يومياً، تتبع الدروس المنجزة، وحافظ على شعلة الاستمرار والالتزام.
            </p>
          </div>

          <button
            id="btn-open-add-task"
            onClick={() => setIsAddingModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            إضافة مهمة مذاكرة جديدة
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">نسبة إنجاز مهام اليوم</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{progressPercent}%</div>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">المهام المكتملة</span>
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {completedCount} <span className="text-sm font-normal text-slate-500">من {gradeTasks.length}</span>
            </div>
            <p className="text-2xs text-slate-400 mt-2">كل مهمة تنجزها تقربك من كليتك وحلمك</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">إجمالي وقت المذاكرة المنجز</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 mt-2">
              {Math.floor(totalMinutes / 60)} س و {totalMinutes % 60} د
            </div>
            <p className="text-2xs text-slate-400 mt-2">استمر بنفس الحماس والتركيز 🔥</p>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            قائمة مهام ودروس المذاكرة المقررة
          </h3>
          <span className="text-xs text-slate-500">{gradeTasks.length} مهام مسجلة</span>
        </div>

        <div className="divide-y divide-slate-100">
          {gradeTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-all ${
                task.completed ? "bg-slate-50/70 opacity-75" : "hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <button
                  id={`btn-toggle-task-${task.id}`}
                  onClick={() => onToggleTask(task.id)}
                  className="cursor-pointer shrink-0 text-slate-400 hover:text-emerald-600"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-50" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <h4
                    className={`text-sm sm:text-base font-bold truncate ${
                      task.completed ? "line-through text-slate-400" : "text-slate-900"
                    }`}
                  >
                    {task.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="bg-slate-100 text-slate-700 text-2xs px-2 py-0.5 rounded-md font-semibold border border-slate-200">
                      {task.subjectName}
                    </span>
                    <span className="text-2xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.estimatedMinutes} دقيقة
                    </span>
                    <span className="text-2xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.2 rounded">
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              <button
                id={`btn-delete-task-${task.id}`}
                onClick={() => onDeleteTask(task.id)}
                className="p-2 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all cursor-pointer shrink-0"
                title="حذف المهمة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {gradeTasks.length === 0 && (
            <div className="p-10 text-center text-slate-400">
              <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium">لا توجد مهام حالياً. أضف مهامك لليوم وابدأ فوراً!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl max-w-md w-full animate-in zoom-in-95 duration-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">إضافة مهمة مذاكرة جديدة</h3>

            <form onSubmit={handleSubmitNewTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم الدرس أو المهمة:</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: حل 30 سؤال على قانون فاراداي..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المادة الدراسية:</label>
                  <select
                    value={newTaskSubjectId}
                    onChange={(e) => setNewTaskSubjectId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {availableSubjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المدة المقدرة (دقيقة):</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={newTaskMinutes}
                    onChange={(e) => setNewTaskMinutes(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الموعد المستهدف:</label>
                <input
                  type="text"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  placeholder="اليوم، غداً، السبت القادم..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  حفظ المهمة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
