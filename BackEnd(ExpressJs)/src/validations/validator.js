const httpStatus = require("http-status").status || require("http-status");
const Joi = require("joi");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true });
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    return res.status(httpStatus.BAD_REQUEST).json({ message: errorMessage });
  }
  next();
};

const loginSchema = Joi.object({
  identifier: Joi.string().required().messages({
    "string.empty": "Dữ liệu bị trống hoặc sai định dạng.",
    "any.required": "Dữ liệu bị trống hoặc sai định dạng.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Dữ liệu bị trống hoặc sai định dạng.",
    "any.required": "Dữ liệu bị trống hoặc sai định dạng.",
  }),
});

const profileUpdateSchema = Joi.object({
  fullName: Joi.string().optional(),
  avatarUrl: Joi.string().uri().optional(),
  bio: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
}).min(1).messages({
  "object.min": "Vui lòng cung cấp ít nhất một trường profile hợp lệ.",
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email không hợp lệ.",
    "string.empty": "Email không hợp lệ.",
    "any.required": "Email không hợp lệ.",
  }),
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email không hợp lệ.",
    "string.empty": "Email không hợp lệ.",
    "any.required": "Email không hợp lệ.",
  }),
  otp: Joi.string().length(6).pattern(/^\d{6}$/).required().messages({
    "string.length": "OTP phải là 6 chữ số.",
    "string.pattern.base": "OTP phải là 6 chữ số.",
    "string.empty": "OTP phải là 6 chữ số.",
    "any.required": "OTP phải là 6 chữ số.",
  }),
});

const resetPasswordSchema = Joi.object({
  resetToken: Joi.string().required().messages({
    "string.empty": "Thiếu token xác thực.",
    "any.required": "Thiếu token xác thực.",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "Mật khẩu mới phải có ít nhất 6 ký tự.",
    "string.empty": "Mật khẩu mới phải có ít nhất 6 ký tự.",
    "any.required": "Mật khẩu mới phải có ít nhất 6 ký tự.",
  }),
});

const registerSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Vui lòng điền đầy đủ thông tin.",
    "any.required": "Vui lòng điền đầy đủ thông tin.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email không hợp lệ.",
    "string.empty": "Vui lòng điền đầy đủ thông tin.",
    "any.required": "Vui lòng điền đầy đủ thông tin.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Mật khẩu phải có ít nhất 6 ký tự.",
    "string.empty": "Vui lòng điền đầy đủ thông tin.",
    "any.required": "Vui lòng điền đầy đủ thông tin.",
  }),
});

const otpSchema = Joi.object({
  email: Joi.string().required().messages({
    "string.empty": "Email và mã OTP không được để trống.",
    "any.required": "Email và mã OTP không được để trống.",
  }),
  otpCode: Joi.string().length(6).pattern(/^\d{6}$/).required().messages({
    "string.empty": "Email và mã OTP không được để trống.",
    "any.required": "Email và mã OTP không được để trống.",
    "string.length": "Mã OTP phải có 6 chữ số.",
    "string.pattern.base": "Mã OTP phải có 6 chữ số.",
  }),
});

const validateLogin = validate(loginSchema);
const validateProfileUpdate = validate(profileUpdateSchema);
const validateForgotPassword = validate(forgotPasswordSchema);
const validateVerifyOtp = validate(verifyOtpSchema);
const validateResetPassword = validate(resetPasswordSchema);
const validateRegister = validate(registerSchema);
const validateOtp = validate(otpSchema);

module.exports = {
  validateLogin,
  validateProfileUpdate,
  validateForgotPassword,
  validateVerifyOtp,
  validateResetPassword,
  validateRegister,
  validateOtp,
};
