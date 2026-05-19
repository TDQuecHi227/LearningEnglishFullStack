const mongoose = require("mongoose");

// Đơn hàng khi học viên mua khóa học. Là căn cứ pháp lý cho doanh thu.
const orderSchema = new mongoose.Schema(
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

    // Giá tại thời điểm mua (snapshot, không phụ thuộc giá hiện tại)
    originalPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: null,
    },
    finalPrice: {
      type: Number,
      required: true, // giá thực tế thanh toán
    },
    currency: {
      type: String,
      default: "VND",
    },

    // Chia doanh thu
    platformFee: {
      type: Number,
      required: true, // phần platform giữ lại
    },
    teacherRevenue: {
      type: Number,
      required: true, // phần chuyển cho GV
    },

    /*
     * Trạng thái đơn:
     * "pending"   : chờ thanh toán
     * "paid"      : đã thanh toán thành công
     * "failed"    : thanh toán thất bại
     * "refunded"  : đã hoàn tiền
     */
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    // Thông tin cổng thanh toán
    paymentMethod: {
      type: String,
      default: "", // "vnpay", "momo", "stripe"...
    },
    paymentGatewayId: {
      type: String,
      default: "", // transaction ID từ gateway
    },
    paidAt: {
      type: Date,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    refundReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ courseId: 1, status: 1 });
orderSchema.index({ status: 1, paidAt: -1 });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
