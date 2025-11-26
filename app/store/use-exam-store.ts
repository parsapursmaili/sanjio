import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ExamState {
  // Data
  examId: string | null;
  questions: any[];
  answers: Record<string, number>; // { questionId: optionIndex }
  flagged: string[];
  currentQuestionIndex: number;
  isSidebarOpen: boolean;

  // Actions
  initializeExam: (examId: string, questions: any[]) => void;
  setAnswer: (questionId: string, optionIndex: number) => void;
  toggleFlag: (questionId: string) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  toggleSidebar: () => void;
  resetExam: () => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      examId: null,
      questions: [],
      answers: {},
      flagged: [],
      currentQuestionIndex: 0,
      isSidebarOpen: false,

      initializeExam: (newExamId, newQuestions) => {
        const state = get();
        // امنیت: اگر آیدی آزمون فرق کرده، حتما همه چیز را ریست کن
        if (state.examId !== newExamId) {
          console.log("🔄 New exam detected. Clearing old data...");
          set({
            examId: newExamId,
            questions: newQuestions,
            answers: {}, // پاک کردن جواب‌های قبلی
            flagged: [],
            currentQuestionIndex: 0,
            isSidebarOpen: false,
          });
        } else {
          // اگر همان آزمون است (مثلا رفرش شده)، فقط سوالات را آپدیت کن (جواب‌ها بماند)
          set({ questions: newQuestions });
        }
      },

      setAnswer: (questionId, optionIndex) =>
        set((state) => {
          const currentAnswer = state.answers[questionId];
          const newAnswers = { ...state.answers };

          // منطق حذف گزینه (Toggle)
          if (currentAnswer === optionIndex) {
            delete newAnswers[questionId]; // حذف کلید اگر دوباره کلیک شد
          } else {
            newAnswers[questionId] = optionIndex; // انتخاب جدید
          }

          return { answers: newAnswers };
        }),

      toggleFlag: (questionId) =>
        set((state) => {
          const isFlagged = state.flagged.includes(questionId);
          return {
            flagged: isFlagged
              ? state.flagged.filter((id) => id !== questionId)
              : [...state.flagged, questionId],
          };
        }),

      goToQuestion: (index) => set({ currentQuestionIndex: index }),

      nextQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.min(
            state.currentQuestionIndex + 1,
            state.questions.length - 1
          ),
        })),

      prevQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
        })),

      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      resetExam: () =>
        set({
          examId: null,
          questions: [],
          answers: {},
          flagged: [],
          currentQuestionIndex: 0,
        }),
    }),
    {
      name: "sanjio-exam-storage",
      storage: createJSONStorage(() => localStorage),
      // فقط این فیلدها را در لوکال استوریج نگه دار (سوالات سنگین را ذخیره نکن)
      partialize: (state) => ({
        examId: state.examId,
        answers: state.answers,
        flagged: state.flagged,
        currentQuestionIndex: state.currentQuestionIndex,
      }),
    }
  )
);
