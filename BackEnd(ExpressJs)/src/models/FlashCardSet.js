const mongoose = require("mongoose");

const flashcardSetSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Ảnh thumbnail cho bộ flashcard
    thumbnailUrl: {
      type: String,
      default: "",
    },

    // Tags để tìm kiếm, ví dụ: ["IELTS", "office", "TOEFL"]
    tags: {
      type: [String],
      default: [],
    },

    // Public: mọi người đều thấy | private: chỉ mình tạo ra mới thấy
    isPublic: {
      type: Boolean,
      default: true,
    },

    // Cache tổng số card (tăng/giảm khi thêm/xóa card)
    totalCards: {
      type: Number,
      default: 0,
    },

    // Số lượt người học bộ này
    enrollCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Index để tìm kiếm theo title, tags
flashcardSetSchema.index({ title: "text", tags: "text" });
flashcardSetSchema.index({ createdBy: 1 });
flashcardSetSchema.index({ isPublic: 1, createdAt: -1 });

const FlashcardSet = mongoose.model("FlashcardSet", flashcardSetSchema);
module.exports = FlashcardSet;
