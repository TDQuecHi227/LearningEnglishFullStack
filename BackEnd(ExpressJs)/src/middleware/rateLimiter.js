const rateLimit = require("express-rate-limit");
const httpStatus = require("http-status").status || require("http-status");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    res
      .status(httpStatus.TOO_MANY_REQUESTS)
      .json({ message: "Vượt quá giới hạn truy cập. Vui lòng thử lại sau." });
  },
});

// Giới hạn request gửi OTP (tránh spam email)
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(httpStatus.TOO_MANY_REQUESTS).json({
      message: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.",
    });
  },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  handler: (req, res) => {
    res.status(httpStatus.TOO_MANY_REQUESTS).json({
      message: "Quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau 1 giờ.",
    });
  },
});

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  handler: (req, res) => {
    res.status(httpStatus.TOO_MANY_REQUESTS).json({
      message: "Quá nhiều lần thử OTP. Vui lòng thử lại sau 15 phút.",
    });
  },
});

module.exports = {
  loginLimiter,
  forgotPasswordLimiter,
  registerLimiter,
  otpLimiter,
};

