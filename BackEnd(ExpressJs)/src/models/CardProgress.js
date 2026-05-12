const mongoose = require("mongoose");

// Theo dõi tiến độ học của 1 user đối với 1 card cụ thể
const cardProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },

    // Tham chiếu tới UserStudyProgress để query nhanh hơn
    progressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserStudyProgress",
      required: true,
    },

    /*
     * Trạng thái card:
     * - "new"       : chưa học lần nào
     * - "learning"  : đang học (đã hiện card nhưng chưa hoàn thành ôn tập)
     * - "review"    : đã học, đang trong chu kỳ ôn tập
     * - "memorized" : user bấm "Đã biết, loại khỏi danh sách ôn tập"
     */
    status: {
      type: String,
      enum: ["new", "learning", "review", "memorized"],
      default: "new",
    },

    /*
     * Độ khó user tự đánh giá lần cuối:
     * - "easy"    : dễ → interval nhân với hệ số cao
     * - "medium"  : trung bình
     * - "hard"    : khó → interval ngắn, xuất hiện lại sớm
     */
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    // User đã bấm "bỏ qua & không ôn tập" cho card này
    skipped: {
      type: Boolean,
      default: false,
    },

    // Tổng số lần đã ôn tập
    reviewCount: {
      type: Number,
      default: 0,
    },

    // Số lần trả lời đúng liên tiếp (spaced repetition)
    consecutiveCorrect: {
      type: Number,
      default: 0,
    },

    // Interval hiện tại (số ngày) theo thuật toán SM-2
    interval: {
      type: Number,
      default: 1,
    },

    // Ease factor cho thuật toán SM-2 (mặc định 2.5)
    easeFactor: {
      type: Number,
      default: 2.5,
    },

    // Thời điểm ôn tập tiếp theo
    nextReviewAt: {
      type: Date,
      default: null,
    },

    // Thời điểm học lần đầu
    firstLearnedAt: {
      type: Date,
      default: null,
    },

    // Thời điểm ôn tập gần nhất
    lastReviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Mỗi cặp (user, card) chỉ có 1 record
cardProgressSchema.index({ userId: 1, cardId: 1 }, { unique: true });
cardProgressSchema.index({ progressId: 1, status: 1 });
cardProgressSchema.index({ userId: 1, nextReviewAt: 1, status: 1 });

const CardProgress = mongoose.model("CardProgress", cardProgressSchema);
module.exports = CardProgress;
