const mongoose = require("mongoose");

// Quản lý chuỗi ngày học liên tiếp (streak) của user
const userStreakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Chuỗi hiện tại (số ngày học liên tiếp)
    currentStreak: {
      type: Number,
      default: 0,
    },

    // Chuỗi dài nhất từ trước đến nay
    longestStreak: {
      type: Number,
      default: 0,
    },

    // Ngày học gần nhất (chỉ tính ngày, không tính giờ)
    lastStudyDate: {
      type: Date,
      default: null,
    },

    // Lưu 90 ngày gần nhất để vẽ heatmap hoạt động
    // Mỗi entry: { date: Date, cardsStudied: Number }
    studyHistory: {
      type: [
        {
          date: { type: Date, required: true },
          cardsStudied: { type: Number, default: 0 },
          setsStudied: { type: Number, default: 0 },
        },
      ],
      default: [],
    },

    // Tổng ngày đã học (không cần liên tiếp)
    totalDaysStudied: {
      type: Number,
      default: 0,
    },

    // Tổng cards đã học toàn bộ thời gian
    totalCardsAllTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Chỉ giữ 90 ngày gần nhất trong studyHistory trước khi save
userStreakSchema.pre("save", function (next) {
  if (this.studyHistory && this.studyHistory.length > 90) {
    this.studyHistory = this.studyHistory
      .sort((a, b) => b.date - a.date)
      .slice(0, 90);
  }
  next();
});

const UserStreak = mongoose.model("UserStreak", userStreakSchema);
module.exports = UserStreak;
