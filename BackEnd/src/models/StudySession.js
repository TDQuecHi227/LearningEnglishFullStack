const mongoose = require("mongoose");

// Lưu thông tin 1 phiên học (mỗi lần user bấm "Luyện tập flashcards")
const studySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    progressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserStudyProgress",
      required: true,
    },

    setId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FlashcardSet",
      required: true,
    },

    startTime: {
      type: Date,
      default: Date.now,
    },

    endTime: {
      type: Date,
      default: null,
    },

    // Tổng số card đã học trong phiên
    cardsStudied: {
      type: Number,
      default: 0,
    },

    // Số từ mới học lần đầu trong phiên
    newCardsLearned: {
      type: Number,
      default: 0,
    },

    // Số câu ôn tập trả lời đúng
    correctAnswers: {
      type: Number,
      default: 0,
    },

    // Số câu bỏ qua trong phiên
    skippedCards: {
      type: Number,
      default: 0,
    },

    /*
     * Loại phiên:
     * - "flashcard" : xem card và đánh giá độ khó (dễ/tb/khó)
     * - "quiz"      : câu hỏi trắc nghiệm
     * - "listen_fill": nghe và điền từ
     * - "listen_choose": nghe và chọn đáp án
     * - "mixed"     : kết hợp nhiều loại
     */
    sessionType: {
      type: String,
      enum: ["flashcard", "quiz", "listen_fill", "listen_choose", "mixed"],
      default: "flashcard",
    },

    // Phiên đã kết thúc chưa
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

studySessionSchema.index({ userId: 1, createdAt: -1 });
studySessionSchema.index({ progressId: 1 });

const StudySession = mongoose.model("StudySession", studySessionSchema);

// ─────────────────────────────────────────────
// SessionAnswer: Ghi lại từng câu trả lời trong phiên
// ─────────────────────────────────────────────
const sessionAnswerSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudySession",
      required: true,
    },

    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },

    /*
     * Loại câu hỏi:
     * - "flashcard"      : lật card, tự đánh giá
     * - "multiple_choice": trắc nghiệm 4 đáp án
     * - "listen_fill"    : nghe audio, điền từ vào ô
     * - "listen_choose"  : nghe audio, chọn đáp án
     * - "type_answer"    : gõ định nghĩa/từ
     */
    questionType: {
      type: String,
      enum: [
        "flashcard",
        "multiple_choice",
        "listen_fill",
        "listen_choose",
        "type_answer",
      ],
      required: true,
    },

    // Đáp án user chọn/nhập
    userAnswer: {
      type: String,
      default: "",
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },

    // User bấm bỏ qua câu này
    skipped: {
      type: Boolean,
      default: false,
    },

    // Đánh giá độ khó (chỉ dùng cho loại "flashcard")
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", null],
      default: null,
    },

    // Thời gian xử lý (ms) — dùng để thống kê
    timeSpentMs: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

sessionAnswerSchema.index({ sessionId: 1 });
sessionAnswerSchema.index({ cardId: 1 });

const SessionAnswer = mongoose.model("SessionAnswer", sessionAnswerSchema);

module.exports = { StudySession, SessionAnswer };
