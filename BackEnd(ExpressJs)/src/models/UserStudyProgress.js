const mongoose = require("mongoose");

// Theo dõi tiến độ học của 1 user đối với 1 bộ flashcard
const userStudyProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    setId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FlashcardSet",
      required: true,
    },

    // Tổng số từ đã học ít nhất 1 lần
    totalLearned: {
      type: Number,
      default: 0,
    },

    // Tổng số từ đã nhớ (user bấm "Đã biết, loại khỏi danh sách ôn tập")
    totalMemorized: {
      type: Number,
      default: 0,
    },

    // Số từ mới đã học HÔM NAY (reset về 0 mỗi ngày mới)
    newWordsToday: {
      type: Number,
      default: 0,
    },

    // Giới hạn từ mới tối đa mỗi ngày (mặc định 20)
    dailyNewWordLimit: {
      type: Number,
      default: 20,
    },

    // Ngày cuối cùng học
    lastStudiedAt: {
      type: Date,
      default: null,
    },

    // Thời điểm reset newWordsToday (ngày mới bắt đầu)
    dailyResetAt: {
      type: Date,
      default: null,
    },

    // Thời điểm ôn tập tiếp theo được tính toán theo spaced repetition
    nextReviewAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Mỗi cặp (user, set) chỉ có 1 record
userStudyProgressSchema.index({ userId: 1, setId: 1 }, { unique: true });
userStudyProgressSchema.index({ userId: 1, nextReviewAt: 1 });

const UserStudyProgress = mongoose.model(
  "UserStudyProgress",
  userStudyProgressSchema,
);
module.exports = UserStudyProgress;
