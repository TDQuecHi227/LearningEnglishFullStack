import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    avatarUrl: '',
    bio: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    setLoading(true);
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    
    if (isLoggedIn !== 'true' || !role) {
      navigate('/login');
      return;
    }

    try {
      const res = await authService.getProfile(role);
      if (res && res.data) {
        setUser(res.data);
        setFormData({
          fullName: res.data.profile?.fullName || '',
          avatarUrl: res.data.profile?.avatarUrl || '',
          bio: res.data.profile?.bio || '',
          phoneNumber: res.data.profile?.phoneNumber || ''
        });
      }
    } catch (err) {
      console.error("Lỗi lấy thông tin hồ sơ:", err);
      setStatusMsg({ type: 'error', text: 'Không thể tải thông tin hồ sơ. Vui lòng đăng nhập lại!' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMsg({ type: 'error', text: 'Chỉ chấp nhận tệp tin hình ảnh (jpg, png, webp)!' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatusMsg({ type: 'error', text: 'Dung lượng ảnh vượt quá giới hạn cho phép (5MB)!' });
      return;
    }

    setUploading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await authService.uploadAvatar(file);
      if (res && res.url) {
        setFormData(prev => ({
          ...prev,
          avatarUrl: res.url
        }));
        setStatusMsg({ type: 'success', text: 'Đã tải ảnh đại diện lên Cloudinary thành công!' });
      }
    } catch (err) {
      console.error("Lỗi tải ảnh đại diện lên Cloudinary:", err);
      setStatusMsg({ type: 'error', text: err.message || 'Lỗi trong quá trình tải ảnh lên máy chủ!' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: '', text: '' });
    
    const role = localStorage.getItem('role');

    const payload = {};
    if (formData.fullName.trim()) payload.fullName = formData.fullName.trim();
    if (formData.bio.trim()) payload.bio = formData.bio.trim();
    if (formData.phoneNumber.trim()) payload.phoneNumber = formData.phoneNumber.trim();
    if (formData.avatarUrl.trim()) payload.avatarUrl = formData.avatarUrl.trim();

    try {
      const res = await authService.updateProfile(role, payload);
      if (res && res.data) {
        setUser(res.data);
        setStatusMsg({ type: 'success', text: 'Cập nhật hồ sơ cá nhân thành công!' });
        window.dispatchEvent(new Event('storage'));
      }
    } catch (err) {
      console.error("Lỗi cập nhật hồ sơ:", err);
      setStatusMsg({ 
        type: 'error', 
        text: err.response?.data?.message || 'Có lỗi xảy ra trong quá trình lưu thông tin!' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err);
    } finally {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1f3f2d] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Đang tải hồ sơ của bạn...</p>
        </div>
      </div>
    );
  }

  const defaultAvatar = `https://ui-avatars.com/api/?name=${user?.username}&background=1f3f2d&color=fff&size=128`;

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Cài đặt tài khoản</h1>
          <p className="text-sm text-gray-500 mt-2">Quản lý thông tin cá nhân và thiết lập tài khoản học tập của bạn.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
              
              {/* Profile Card Summary */}
              <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
                <div 
                  onClick={handleAvatarClick}
                  className="relative group mb-4 cursor-pointer w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-50 flex items-center justify-center"
                  title="Nhấp vào để đổi ảnh đại diện"
                >
                  <img 
                    src={formData.avatarUrl || defaultAvatar} 
                    alt="Avatar Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = defaultAvatar; }}
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
                    <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[10px] font-bold">Thay ảnh</span>
                  </div>
                  {/* Uploading Spinner Overlay */}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <h2 className="text-lg font-bold text-gray-900">{formData.fullName || user?.username}</h2>
                <span className="px-3 py-1 mt-2 text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-700 rounded-full">
                  Học viên {user?.role === 'admin' && '(Quản lý)'}
                </span>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-50/60 text-[#1f3f2d] font-bold text-sm transition-colors text-left">
                  <svg className="w-5 h-5 text-[#1f3f2d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Hồ sơ cá nhân
                </button>
                
                <button 
                  onClick={() => navigate('/courses')} 
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold text-sm transition-colors text-left"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Khám phá khóa học
                </button>

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 font-semibold text-sm transition-colors text-left"
                >
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Đăng xuất tài khoản
                </button>
              </nav>

            </div>
          </aside>

          {/* Edit Form */}
          <main className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              
              <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin cơ bản</h2>

              {statusMsg.text && (
                <div className={`p-4 rounded-2xl mb-6 flex items-start gap-3 border text-sm font-semibold ${
                  statusMsg.type === 'success' 
                    ? 'bg-green-50 text-green-800 border-green-200' 
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  {statusMsg.type === 'success' ? (
                    <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Read-only: Username */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tên đăng nhập</label>
                    <input 
                      type="text" 
                      value={user?.username || ''} 
                      disabled
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 font-semibold cursor-not-allowed text-sm focus:outline-none"
                    />
                  </div>

                  {/* Read-only: Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Địa chỉ Email</label>
                    <input 
                      type="email" 
                      value={user?.email || ''} 
                      disabled
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 font-semibold cursor-not-allowed text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Editable: Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Họ và tên</label>
                    <input 
                      type="text" 
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên đầy đủ của bạn..."
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#1f3f2d] focus:ring-2 focus:ring-[#1f3f2d]/10 text-sm text-gray-800 font-medium transition-all focus:outline-none"
                    />
                  </div>

                  {/* Editable: Phone Number */}
                  <div>
                    <label htmlFor="phoneNumber" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Số điện thoại</label>
                    <input 
                      type="tel" 
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại..."
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#1f3f2d] focus:ring-2 focus:ring-[#1f3f2d]/10 text-sm text-gray-800 font-medium transition-all focus:outline-none"
                    />
                  </div>
                </div>

                {/* Editable: Bio */}
                <div>
                  <label htmlFor="bio" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Giới thiệu ngắn (Bio)</label>
                  <textarea 
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Chia sẻ một chút thông tin thú vị về bản thân bạn..."
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#1f3f2d] focus:ring-2 focus:ring-[#1f3f2d]/10 text-sm text-gray-800 font-medium transition-all resize-none focus:outline-none"
                  ></textarea>
                </div>

                {/* Cloudinary Tip Box */}
                <div className="bg-yellow-50/50 border border-yellow-100 rounded-2xl p-4 flex gap-3 text-xs text-yellow-800">
                  <svg className="w-5 h-5 text-yellow-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-bold">Mẹo hay cho bạn:</span> Nhấp trực tiếp vào ảnh đại diện hình tròn ở cột bên trái để tải ảnh mới lên trực tiếp từ thiết bị của bạn. Hệ thống sẽ tự động đồng bộ hóa hình ảnh của bạn lên Cloudinary vô cùng bảo mật!
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-gray-50 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={saving || uploading}
                    className="px-8 py-3 bg-[#1f3f2d] hover:bg-[#152a1e] text-white font-bold rounded-2xl shadow-lg shadow-green-950/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    Lưu thay đổi
                  </button>
                </div>

              </form>

            </div>
          </main>
        </div>

      </div>
    </div>
  );
};

export default Profile;
