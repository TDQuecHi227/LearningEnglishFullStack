const mongoose = require("mongoose");

// Từng bài học trong một khóa. Có thể gắn kèm bộ flashcard để học viên luyện từ vựng.
const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
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
    },
    orderIndex: {
      type: Number,
      default: 0, // thứ tự trong khóa
    },

    /*
     * Loại nội dung bài học:
     * "video"      : bài giảng video
     * "flashcard"  : luyện từ vựng bằng flashcard
     * "quiz"       : bài kiểm tra
     * "reading"    : bài đọc / tài liệu
     * "mixed"      : kết hợp nhiều loại
     */
    type: {
      type: String,
      enum: ["video", "flashcard", "quiz", "reading", "mixed"],
      default: "video",
    },

    // Nội dung video (nếu type = "video" hoặc "mixed")
    videoUrl: {
      type: String,
      default: "",
    },
    videoDuration: {
      type: Number,
      default: 0, // giây
    },

    // Gắn bộ flashcard (nếu type = "flashcard" hoặc "mixed")
    flashcardSetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FlashcardSet",
      default: null,
    },

    // Tài liệu đính kèm
    attachments: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],

    // Bài học preview miễn phí (không cần mua khóa)
    isFree: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

lessonSchema.index({ courseId: 1, orderIndex: 1 });

const Lesson = mongoose.model("Lesson", lessonSchema);
module.exports = Lesson;
