const mongoose = require("mongoose");

// Học viên đăng ký (và đã thanh toán) một khóa học.
const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null, // null nếu khóa miễn phí
    },

    /*
     * Trạng thái enrollment:
     * "active"   : đang học
     * "expired"  : hết hạn truy cập (nếu có thời hạn)
     * "refunded" : đã hoàn tiền, mất quyền truy cập
     */
    status: {
      type: String,
      enum: ["active", "expired", "refunded"],
      default: "active",
    },

    // Tiến độ học (% hoàn thành)
    progressPercent: {
      type: Number,
      default: 0,
    },
    lessonsCompleted: {
      type: Number,
      default: 0,
    },
    lastAccessedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },

    // Đánh giá khóa học (sau khi hoàn thành)
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    review: {
      type: String,
      default: "",
    },
    reviewedAt: {
      type: Date,
      default: null,
    },

    // Thời hạn truy cập (null = vĩnh viễn)
    accessExpiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Mỗi cặp (user, course) chỉ có 1 enrollment
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
enrollmentSchema.index({ courseId: 1, status: 1 });
enrollmentSchema.index({ userId: 1, status: 1 });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
module.exports = Enrollment;
