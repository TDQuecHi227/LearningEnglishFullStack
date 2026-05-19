import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import OtpInput from '../../components/common/OtpInput';
import Button from '../../components/common/Button';
import { authService } from '../../services/auth.service';
import heroImg from '../../assets/hero.png';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  
  const [formData, setFormData] = useState({ 
    email: '', 
    otpCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: '', text: '' });
  const [resetToken, setResetToken] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setApiMessage({ type: '', text: '' });
    
    if (!formData.email) {
      setErrors({ email: 'Vui lòng nhập địa chỉ email' });
      return;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: 'Email không hợp lệ' });
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(formData.email);
      setApiMessage({ type: 'success', text: 'Mã OTP đã được gửi đến email của bạn.' });
      setStep(2);
    } catch (error) {
      setApiMessage({ type: 'error', text: error.message || 'Không tìm thấy tài khoản với email này.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setApiMessage({ type: '', text: '' });
    
    if (!formData.otpCode) {
      setErrors({ otpCode: 'Vui lòng nhập mã OTP' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.verifyOtp(formData.email, formData.otpCode);
      if (res.resetToken) {
        setResetToken(res.resetToken);
        setApiMessage({ type: 'success', text: 'Xác thực thành công. Vui lòng nhập mật khẩu mới.' });
        setStep(3);
      } else {
        throw new Error('Không nhận được token xác thực');
      }
    } catch (error) {
      setApiMessage({ type: 'error', text: error.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setApiMessage({ type: '', text: '' });
    
    const newErrors = {};
    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(resetToken, formData.newPassword);
      setApiMessage({ type: 'success', text: 'Đổi mật khẩu thành công! Đang chuyển hướng...' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setApiMessage({ type: 'error', text: error.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  const MailIcon = (
    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const ShieldIcon = (
    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const LockIcon = (
    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      
      {/* Left Sidebar */}
      <div className="hidden lg:flex w-[45%] bg-[#1f3f2d] flex-col justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-md z-10 w-full relative left-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
            Khôi phục<br />tài khoản
          </h1>
          <p className="text-[#a0b5a8] text-lg mb-12 max-w-md leading-relaxed">
            Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập vào tài khoản EduLingo một cách an toàn và nhanh chóng thông qua quy trình xác thực.
          </p>
          
          <div className="w-full relative rounded-xl overflow-hidden shadow-2xl mt-4">
             <img src={heroImg} alt="Illustration" className="w-full h-auto object-cover opacity-90 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-[55%] flex flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-8">
          
          {/* Header */}
          <div className="flex flex-col items-start">
            <div className="flex items-center space-x-2 mb-6">
              <svg className="w-8 h-8 text-[#1f3f2d]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9L4 10.63V15C4 16.66 7.58 18 12 18C16.42 18 20 16.66 20 15V10.63L23 9L12 3ZM12 16.5C8.69 16.5 5.5 15.54 5.5 14.5C5.5 13.46 8.69 12.5 12 12.5C15.31 12.5 18.5 13.46 18.5 14.5C18.5 15.54 15.31 16.5 12 16.5Z"/>
              </svg>
              <span className="text-xl font-bold text-[#1f3f2d] tracking-tight">EduLingo</span>
            </div>
            
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {step === 1 && "Quên mật khẩu?"}
              {step === 2 && "Nhập mã xác thực"}
              {step === 3 && "Đặt lại mật khẩu"}
            </h2>
            <p className="mt-2 text-gray-500 text-sm">
              {step === 1 && "Vui lòng nhập địa chỉ email đã đăng ký để nhận mã khôi phục."}
              {step === 2 && `Mã xác thực 6 số đã được gửi tới ${formData.email}.`}
              {step === 3 && "Vui lòng nhập mật khẩu mới của bạn và ghi nhớ nó."}
            </p>
          </div>

          {apiMessage.text && (
            <div className={`p-4 text-sm rounded-xl border flex items-start ${apiMessage.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
              {apiMessage.type === 'error' ? (
                <svg className="w-5 h-5 mr-2 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {apiMessage.text}
            </div>
          )}

          {/* Form */}
          {step === 1 && (
            <form className="space-y-6" onSubmit={handleSendEmail}>
              <InputField
                id="email"
                type="email"
                label="Địa chỉ Email"
                placeholder="example@lexicon.edu.vn"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={MailIcon}
              />
              <Button 
                type="submit" 
                isLoading={isLoading} 
                className="!bg-[#2f6345] hover:!bg-[#1f3f2d] !py-3 !rounded-xl text-base shadow-md w-full transition-all mt-2"
              >
                Gửi mã xác nhận
              </Button>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mã xác thực OTP</label>
                <OtpInput 
                  value={formData.otpCode}
                  onChange={handleChange}
                  error={errors.otpCode}
                />
              </div>
              <Button 
                type="submit" 
                isLoading={isLoading} 
                className="!bg-[#2f6345] hover:!bg-[#1f3f2d] !py-3 !rounded-xl text-base shadow-md w-full transition-all mt-2"
              >
                Xác thực mã OTP
              </Button>
              <div className="text-center mt-4 text-sm text-gray-500">
                Không nhận được mã?{' '}
                <button 
                  type="button" 
                  onClick={handleSendEmail} 
                  disabled={isLoading}
                  className="text-[#2f6345] font-semibold hover:underline disabled:opacity-50"
                >
                  Gửi lại
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <InputField
                id="newPassword"
                type="password"
                label="Mật khẩu mới"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
                icon={LockIcon}
              />
              <InputField
                id="confirmPassword"
                type="password"
                label="Xác nhận mật khẩu"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={LockIcon}
              />
              <Button 
                type="submit" 
                isLoading={isLoading} 
                className="!bg-[#2f6345] hover:!bg-[#1f3f2d] !py-3 !rounded-xl text-base shadow-md w-full transition-all mt-2"
              >
                Đặt lại mật khẩu
              </Button>
            </form>
          )}

          <div className="flex items-center justify-center pt-6">
            <Link to="/login" className="flex items-center text-sm font-semibold text-gray-500 hover:text-[#2f6345] transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
