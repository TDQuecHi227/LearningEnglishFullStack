const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Nếu không có googleId thì bắt buộc phải có password
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Cho phép nhiều bản ghi có giá trị null (dành cho người đăng ký thường)
    },

    // Phần dành cho Edit Profile
    profile: {
      fullName: { type: String, default: "" },
      avatarUrl: { type: String, default: "default-avatar.png" },
      bio: { type: String, default: "" },
      phoneNumber: { type: String, default: "" },
    },

    // Phần dành cho Đăng ký & Quên mật khẩu qua OTP
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: { type: String },
      expiresAt: { type: Date },
    },
    // Vai trò của người dùng
    role: {
      type: String,
      enum: ["user", "teacher", "manager", "admin"],
      default: "user",
    },

    // Thông tin bổ sung cho giáo viên
    teacherProfile: {
      bio: { type: String, default: "" },
      expertise: { type: [String], default: [] }, // ["IELTS", "TOEIC", ...]
      bankAccount: { type: String, default: "" }, // tài khoản nhận thanh toán
      bankName: { type: String, default: "" },
      revenueShare: { type: Number, default: 0.7 }, // 70% doanh thu về GV, 30% platform
      isApproved: { type: Boolean, default: false }, // admin duyệt trước khi bán được
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
