import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import { authService } from '../../services/auth.service';
import heroImg from '../../assets/hero.png';

const Login = () => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.identifier) {
      newErrors.identifier = 'Vui lòng nhập tên đăng nhập hoặc email';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await authService.login(formData.identifier, formData.password);

      if (response.redirect_url) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', response.redirect_url.includes('admin') ? 'admin' : 'user');
      }

      navigate('/');
    } catch (error) {
      setApiError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setApiError('');
    setIsLoading(true);
    try {
      // credential chính là idToken mà Google trả về
      const response = await authService.googleLogin(credential);
      if (response.redirect_url) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', response.redirect_url.includes('admin') ? 'admin' : 'user');
      }
      navigate('/');
    } catch (error) {
      setApiError(error.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const MailIcon = (
    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const LockIcon = (
    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">

      {/* Left Sidebar (Illustration) */}
      <div className="hidden lg:flex w-1/2 bg-[#1f3f2d] flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        {/* Decorative circle lines */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full pointer-events-none"></div>

        <div className="max-w-xl flex flex-col items-center text-center z-10 w-full">
          <div className="bg-white p-3 rounded-2xl mb-8 shadow-lg">
            <svg className="w-10 h-10 text-[#1f3f2d]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Làm chủ từ vựng</h1>
          <p className="text-[#a0b5a8] text-lg mb-12 max-w-md mx-auto leading-relaxed">
            Sự xuất sắc trong tiếng Anh chuyên nghiệp bắt đầu từ đây. Gia nhập hàng ngàn học viên đang làm chủ giao tiếp toàn cầu.
          </p>

          <div className="w-full max-w-md relative bg-[#2a4d3a] rounded-t-xl overflow-hidden shadow-2xl pt-4 px-4 pb-0 mt-4 border border-[#3b664f]">
            <div className="flex space-x-2 absolute top-3 left-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="mt-6 w-full h-auto bg-[#e5ece8] rounded-t-lg overflow-hidden">
              {/* Replace with actual illustration or fallback */}
              <img src={heroImg} alt="Illustration" className="w-full h-auto object-cover opacity-90 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar (Login Form) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">

          {/* Header */}
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 mb-8">
              <svg className="w-8 h-8 text-[#1f3f2d]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9L4 10.63V15C4 16.66 7.58 18 12 18C16.42 18 20 16.66 20 15V10.63L23 9L12 3ZM12 16.5C8.69 16.5 5.5 15.54 5.5 14.5C5.5 13.46 8.69 12.5 12 12.5C15.31 12.5 18.5 13.46 18.5 14.5C18.5 15.54 15.31 16.5 12 16.5Z" />
              </svg>
              <span className="text-2xl font-bold text-[#1f3f2d] tracking-tight">EduLingo</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 text-center tracking-tight leading-tight">
              Chào mừng bạn trở lại<br />EduLingo
            </h2>
            <p className="mt-3 text-gray-500 text-center text-sm">
              Vui lòng nhập thông tin của bạn để tiếp tục hành trình.
            </p>
          </div>

          {/* Toggle Login/Register */}
          <div className="flex p-1 bg-gray-100/80 rounded-xl mb-8">
            <button className="flex-1 py-2.5 text-sm font-semibold rounded-lg bg-white shadow-sm text-gray-900 transition-all">
              Đăng nhập
            </button>
            <Link to="/register" className="flex-1 py-2.5 text-sm font-medium rounded-lg text-gray-500 hover:text-gray-900 text-center transition-all">
              Đăng ký
            </Link>
          </div>

          {apiError && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-start">
              <svg className="w-5 h-5 mr-2 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {apiError}
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <InputField
              id="identifier"
              type="text"
              label="Email hoặc Tên đăng nhập"
              placeholder="ten@congty.com hoặc taikhoan"
              value={formData.identifier}
              onChange={handleChange}
              error={errors.identifier}
              autoComplete="username"
              icon={MailIcon}
            />

            <InputField
              id="password"
              type="password"
              label="Mật khẩu"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
              icon={LockIcon}
              labelRight={
                <Link to="/forgot-password" className="font-semibold text-[#2f6345] hover:text-[#1f3f2d] transition-colors">
                  Quên mật khẩu?
                </Link>
              }
            />

            <Button
              type="submit"
              isLoading={isLoading}
              className="!bg-[#2f6345] hover:!bg-[#1f3f2d] !py-3 !rounded-xl text-base shadow-md w-full transition-all"
            >
              Đăng nhập
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-semibold">
              <span className="bg-white px-4 text-gray-400 tracking-wider">Hoặc tiếp tục với</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="w-full flex justify-center">
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'}>
              <div className="w-full h-[44px] [&>div]:w-full [&>div>div]:w-full flex justify-center">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    handleGoogleSuccess(credentialResponse.credential);
                  }}
                  onError={() => {
                    setApiError('Khởi tạo đăng nhập Google thất bại.');
                  }}
                  type="standard"
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="400"
                />
              </div>
            </GoogleOAuthProvider>
          </div>

          <p className="text-xs text-center text-gray-500 mt-10 max-w-xs mx-auto leading-relaxed">
            Bằng cách tiếp tục, bạn đồng ý với <a href="#" className="text-[#2f6345] font-semibold hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-[#2f6345] font-semibold hover:underline">Chính sách bảo mật</a> của EduLingo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
