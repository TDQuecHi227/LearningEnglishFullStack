const mongoose = require("mongoose");

// Thống kê doanh thu theo kỳ (ngày/tháng).
const revenueSchema = new mongoose.Schema(
  {
    // Kỳ thống kê
    period: {
      type: String,
      enum: ["daily", "monthly"],
      required: true,
    },
    // Giá trị kỳ: "2025-05" (tháng) hoặc "2025-05-12" (ngày)
    periodKey: {
      type: String,
      required: true,
    },

    // Scope: toàn platform hoặc riêng từng GV
    scope: {
      type: String,
      enum: ["platform", "teacher"],
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null nếu scope = "platform"
    },

    // Số liệu
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalGrossRevenue: {
      type: Number,
      default: 0, // tổng doanh thu thô
    },
    totalPlatformFee: {
      type: Number,
      default: 0, // phần platform giữ
    },
    totalTeacherPayout: {
      type: Number,
      default: 0, // phần trả GV
    },
    totalRefunded: {
      type: Number,
      default: 0, // tổng hoàn tiền
    },
    netRevenue: {
      type: Number,
      default: 0, // grossRevenue - refunded
    },

    // Snapshot các khóa bán chạy trong kỳ (top 5)
    topCourses: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        title: { type: String },
        orders: { type: Number },
        revenue: { type: Number },
      },
    ],
  },
  { timestamps: true },
);

// Mỗi (period, periodKey, scope, teacherId) là duy nhất
revenueSchema.index(
  { period: 1, periodKey: 1, scope: 1, teacherId: 1 },
  { unique: true },
);
revenueSchema.index({ scope: 1, periodKey: -1 });

const Revenue = mongoose.model("Revenue", revenueSchema);
module.exports = Revenue;
