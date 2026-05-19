import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import OtpInput from '../../components/common/OtpInput';
import Button from '../../components/common/Button';
import { authService } from '../../services/auth.service';
import heroImg from '../../assets/hero.png';

const Register = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    otpCode: '',
    password: '',
    role: 'user',
    agreed: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: '', text: '' });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [id]: type === 'checkbox' ? checked : value 
    }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  const handleSendOtp = async () => {
    setApiMessage({ type: '', text: '' });
    
    // Validate only username, email, password before sending OTP
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Vui lòng nhập họ và tên';
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu ít nhất 6 ký tự';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      setApiMessage({ type: 'success', text: res.message || 'Mã OTP đã được gửi đến email của bạn.' });
    } catch (error) {
      setApiMessage({ type: 'error', text: error.message || 'Đăng ký thất bại. Email hoặc username có thể đã tồn tại.' });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const validateFull = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Vui lòng nhập họ và tên';
    if (!formData.email) newErrors.email = 'Vui lòng nhập email';
    if (!formData.otpCode) newErrors.otpCode = 'Vui lòng nhập mã OTP';
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    if (!formData.agreed) newErrors.agreed = 'Bạn cần đồng ý với điều khoản';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage({ type: '', text: '' });
    
    if (!validateFull()) return;
    
    setIsLoading(true);
    try {
      // Gọi verifyOtp để kích hoạt tài khoản
      const res = await authService.verifyOtp(formData.email, formData.otpCode);
      setApiMessage({ type: 'success', text: 'Tạo tài khoản thành công! Đang chuyển hướng...' });
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setApiMessage({ type: 'error', text: error.message || 'Xác thực OTP thất bại.' });
    } finally {
      setIsLoading(false);
    }
  };

  const UserIcon = (
    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

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
  
  const ShieldIcon = (
    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      
      {/* Left Sidebar */}
      <div className="hidden lg:flex w-[45%] bg-[#1f3f2d] flex-col justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-md z-10 w-full relative left-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
            Bắt đầu hành trình<br />của bạn
          </h1>
          <p className="text-[#a0b5a8] text-lg mb-12 max-w-md leading-relaxed">
            Nâng tầm kỹ năng Tiếng Anh chuyên nghiệp cùng Lexicon. Nơi kết nối tri thức và sự xuất sắc thông qua các chương trình học thuật chuẩn quốc tế.
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
              Đăng ký tài khoản
            </h2>
            <p className="mt-2 text-gray-500 text-sm">
              Tham gia cùng hàng ngàn học viên ngay hôm nay
            </p>
          </div>

          {/* Toggle Login/Register */}
          <div className="flex p-1 bg-gray-100/80 rounded-xl mb-6">
            <Link to="/login" className="flex-1 py-2.5 text-sm font-medium rounded-lg text-gray-500 hover:text-gray-900 text-center transition-all">
              Đăng nhập
            </Link>
            <button className="flex-1 py-2.5 text-sm font-semibold rounded-lg bg-white shadow-sm text-gray-900 transition-all">
              Đăng ký
            </button>
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
          <form className="space-y-5" onSubmit={handleSubmit}>
            <InputField
              id="username"
              type="text"
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              icon={UserIcon}
            />

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

            {/* OTP Field with Send Button */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-gray-700">Mã OTP</label>
                <button 
                  type="button" 
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="text-[#2f6345] hover:text-[#1f3f2d] text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {isSendingOtp ? 'Đang gửi...' : 'Nhận mã OTP'}
                </button>
              </div>
              <OtpInput 
                value={formData.otpCode}
                onChange={handleChange}
                error={errors.otpCode}
              />
            </div>
            
            <InputField
              id="password"
              type="password"
              label="Mật khẩu"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={LockIcon}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tôi là...</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${formData.role === 'user' ? 'border-[#2f6345] bg-[#f0f6f3]' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="role" checked={formData.role === 'user'} onChange={() => setFormData({...formData, role: 'user'})} className="hidden" />
                  <svg className={`w-5 h-5 mr-3 ${formData.role === 'user' ? 'text-[#2f6345]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  <span className={`text-sm font-medium ${formData.role === 'user' ? 'text-[#1f3f2d]' : 'text-gray-600'}`}>Học viên</span>
                </label>
                <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${formData.role === 'teacher' ? 'border-[#2f6345] bg-[#f0f6f3]' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="role" checked={formData.role === 'teacher'} onChange={() => setFormData({...formData, role: 'teacher'})} className="hidden" />
                  <svg className={`w-5 h-5 mr-3 ${formData.role === 'teacher' ? 'text-[#2f6345]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className={`text-sm font-medium ${formData.role === 'teacher' ? 'text-[#1f3f2d]' : 'text-gray-600'}`}>Giáo viên</span>
                </label>
              </div>
            </div>

            <div className="flex items-center pt-2">
              <input
                id="agreed"
                type="checkbox"
                checked={formData.agreed}
                onChange={handleChange}
                className="h-4 w-4 text-[#2f6345] focus:ring-[#2f6345] border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="agreed" className="ml-3 block text-sm text-gray-600 cursor-pointer">
                Tôi đồng ý với <a href="#" className="text-[#2f6345] font-semibold hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-[#2f6345] font-semibold hover:underline">Chính sách bảo mật</a>.
              </label>
            </div>
            {errors.agreed && <p className="mt-1 text-sm text-red-500">{errors.agreed}</p>}

            <Button 
              type="submit" 
              isLoading={isLoading} 
              className="!bg-[#2f6345] hover:!bg-[#1f3f2d] !py-3 !rounded-xl text-base shadow-md w-full transition-all mt-4"
            >
              Tạo tài khoản
            </Button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-10">
            Đã có tài khoản? <Link to="/login" className="text-[#2f6345] font-bold hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
