const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Gửi email OTP
 * @param {string} to - Email người nhận
 * @param {string} otp - Mã OTP
 * @param {string} type - 'register' hoặc 'reset'
 */
const sendOtpEmail = async (to, otp, type = "reset") => {
  const isRegister = type === "register";
  const subject = isRegister
    ? "Mã OTP xác thực đăng ký"
    : "Mã OTP đặt lại mật khẩu";
  const title = isRegister ? "🔐 Xác thực đăng ký" : "🔐 Đặt lại mật khẩu";
  const bodyText = isRegister
    ? "Chào mừng bạn! Sử dụng mã OTP bên dưới để hoàn tất đăng ký tài khoản của bạn:"
    : "Bạn đã yêu cầu đặt lại mật khẩu. Sử dụng mã OTP bên dưới:";

  const mailOptions = {
    from: `"Flashcard App" <${process.env.EMAIL_USER}>`,
    to,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #4F46E5; text-align: center;">${title}</h2>
        <p style="color: #333; line-height: 1.5;">${bodyText}</p>
        <div style="text-align: center; margin: 32px 0; background-color: #F3F4F6; padding: 16px; border-radius: 8px;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">${otp}</span>
        </div>
        <p style="color: #666; font-size: 14px;">Mã này có hiệu lực trong <strong>10 phút</strong>. Vì lý do bảo mật, tuyệt đối không chia sẻ mã này với bất kỳ ai.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">Nếu bạn không yêu cầu mã này, bạn có thể an tâm bỏ qua email này.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP (${type}) sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("EMAIL_SEND_FAILED");
  }
};

module.exports = { sendOtpEmail };
