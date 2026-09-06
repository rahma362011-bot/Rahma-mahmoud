import React, { useState } from "react";
import { QuizQuestion, SavedNote } from "../types";
import { 
  Bookmark, 
  Trash2, 
  FileText, 
  Plus, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen,
  FolderHeart
} from "lucide-react";

interface BookmarksNotebookViewProps {
  bookmarkedQuestions: QuizQuestion[];
  onRemoveBookmark: (questionId: string) => void;
  notes: SavedNote[];
  onAddNote: (note: Omit<SavedNote, "id" | "createdAt">) => void;
  onDeleteNote: (noteId: string) => void;
}

export const BookmarksNotebookView: React.FC<BookmarksNotebookViewProps> = ({
  bookmarkedQuestions,
  onRemoveBookmark,
  notes,
  onAddNote,
  onDeleteNote
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"bookmarks" | "notes">("bookmarks");
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteSubject, setNewNoteSubject] = useState("عام");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    onAddNote({
      title: newNoteTitle,
      content: newNoteContent,
      subjectId: newNoteSubject,
      tags: [newNoteSubject]
    });

    setNewNoteTitle("");
    setNewNoteContent("");
    setIsAddingNote(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              كشكول المذاكرة والمحفوظات
            </span>
            <span className="text-xs text-slate-500 font-medium">مراجعتك السريعة ليلة الامتحان</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
            الأسئلة الصعبة وملاحظاتك الشخصية
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            جميع الأسئلة التي قمت بحفظها أثناء حل الاختبارات بالإضافة إلى ملخصاتك وتدويناتك الخاصة.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab("bookmarks")}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "bookmarks"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-600" />
            الأسئلة المحفوظة ({bookmarkedQuestions.length})
          </button>
          <button
            onClick={() => setActiveSubTab("notes")}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "notes"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            كشكول ملاحظاتي ({notes.length})
          </button>
        </div>
      </div>

      {/* Bookmarked Questions Tab */}
      {activeSubTab === "bookmarks" && (
        <div className="space-y-4">
          {bookmarkedQuestions.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {bookmarkedQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-2xs px-2.5 py-0.5 rounded-md font-bold">
                        {q.subjectName}
                      </span>
                      <span className="text-2xs text-slate-400">{q.topic}</span>
                    </div>

                    <button
                      onClick={() => onRemoveBookmark(q.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                      title="إزالة من المحفوظات"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-relaxed">{q.question}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-3 rounded-xl border ${
                          oIdx === q.correctIndex
                            ? "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold"
                            : "border-slate-100 bg-slate-50 text-slate-600"
                        }`}
                      >
                        {opt} {oIdx === q.correctIndex && "✓ (الإجابة الصحيحة)"}
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-700">
                    <strong className="text-slate-900 block mb-1">الشروع والتعليل النموذجي:</strong>
                    {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 space-y-3">
              <FolderHeart className="w-12 h-12 mx-auto text-slate-300" />
              <h4 className="text-base font-bold text-slate-700">لا توجد أسئلة محفوظة حتى الآن</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                أثناء حلك للاختبارات في قسم "بنك الأسئلة"، اضغط على أيقونة "حفظ للمراجعة" لتظهر أسئلتك هنا وتراجعها بضغطة زر.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Personal Notes Tab */}
      {activeSubTab === "notes" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              ملاحظاتك وملخصاتك المدونة
            </h3>
            <button
              onClick={() => setIsAddingNote(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              تدوين ملاحظة جديدة
            </button>
          </div>

          {/* Add Note Card Form */}
          {isAddingNote && (
            <div className="bg-white rounded-2xl p-5 border-2 border-emerald-500 shadow-md space-y-3 animate-in fade-in duration-200">
              <h4 className="font-bold text-sm text-slate-900">ملاحظة جديدة في كشكول المذاكرة</h4>
              <form onSubmit={handleSaveNote} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="عنوان الملاحظة أو اسم القاعدة (مثلاً: تكة فيزياء عن المحول)"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="اسم المادة (عربي، فيزياء...)"
                      value={newNoteSubject}
                      onChange={(e) => setNewNoteSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <textarea
                  rows={4}
                  required
                  placeholder="اكتب ملاحظتك وقوانينك أو ما استنتجته من درس اليوم..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNote(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    حفظ في الكشكول
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notes Grid */}
          {notes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-emerald-50 text-emerald-800 text-2xs font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                        {note.subjectId}
                      </span>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="text-slate-300 hover:text-rose-600 p-1 rounded transition-all cursor-pointer"
                        title="حذف الملاحظة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="font-bold text-base text-slate-900">{note.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {note.content}
                    </p>
                  </div>

                  <div className="text-2xs text-slate-400 border-t border-slate-100 pt-2 flex items-center justify-between">
                    <span>{note.createdAt}</span>
                    <span>محفوظ محلياً</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <h4 className="text-base font-bold text-slate-700">كشكولك فارغ حالياً</h4>
              <p className="text-xs text-slate-500 mt-1">
                اضغط على "تدوين ملاحظة جديدة" بالأعلى لتسجيل أي تكة امتحانية أو قانون تود تذكره دائماً.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
