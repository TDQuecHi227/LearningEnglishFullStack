import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth.service';

const Header = () => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const role = localStorage.getItem('role');
      if (isLoggedIn === 'true' && role) {
        try {
          const res = await authService.getProfile(role);
          setUser(res.data);
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          // If token expired or error, clear auth state
          if (error.message.includes('xác thực')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('role');
          }
        }
      }
    };
    fetchUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');
      setUser(null);
      setIsDropdownOpen(false);
      navigate('/login');
    }
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <svg className="w-8 h-8 text-[#1f3f2d]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9L4 10.63V15C4 16.66 7.58 18 12 18C16.42 18 20 16.66 20 15V10.63L23 9L12 3ZM12 16.5C8.69 16.5 5.5 15.54 5.5 14.5C5.5 13.46 8.69 12.5 12 12.5C15.31 12.5 18.5 13.46 18.5 14.5C18.5 15.54 15.31 16.5 12 16.5Z"/>
            </svg>
            <span className="text-xl font-bold text-[#1f3f2d] tracking-tight">EduLingo</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/' ? 'text-[#1f3f2d] font-extrabold' : 'text-gray-500 hover:text-[#1f3f2d]'
              }`}
            >
              Trang chủ
            </Link>
            <Link 
              to="/courses" 
              className={`text-sm font-semibold transition-colors ${
                location.pathname.startsWith('/courses') ? 'text-[#1f3f2d] font-extrabold' : 'text-gray-500 hover:text-[#1f3f2d]'
              }`}
            >
              Khóa học
            </Link>
            <Link 
              to="/vocabulary" 
              className={`text-sm font-semibold transition-colors ${
                location.pathname.startsWith('/vocabulary') ? 'text-[#1f3f2d] font-extrabold' : 'text-gray-500 hover:text-[#1f3f2d]'
              }`}
            >
              Từ vựng
            </Link>
            <Link 
              to="/grammar" 
              className={`text-sm font-semibold transition-colors ${
                location.pathname.startsWith('/grammar') ? 'text-[#1f3f2d] font-extrabold' : 'text-gray-500 hover:text-[#1f3f2d]'
              }`}
            >
              Ngữ pháp
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-semibold transition-colors ${
                location.pathname.startsWith('/about') ? 'text-[#1f3f2d] font-extrabold' : 'text-gray-500 hover:text-[#1f3f2d]'
              }`}
            >
              Giới thiệu
            </Link>
          </div>

          {/* Auth Buttons / User Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-1 pr-3 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                >
                  <img 
                    src={user.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=1f3f2d&color=fff`} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-semibold text-gray-700">{user.profile?.fullName || user.username}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm text-gray-900 font-bold truncate">{user.profile?.fullName || user.username}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link 
                      to={user.role === 'admin' ? '/admin/profile' : '/user/profile'} 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1f3f2d] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Hồ sơ cá nhân
                    </Link>
                    <Link 
                      to="/my-courses" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1f3f2d] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Khóa học của tôi
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-[#1f3f2d] hover:text-green-800 transition-colors">
                  Đăng nhập
                </Link>
                <Link to="/register" className="px-5 py-2.5 rounded-full bg-[#1f3f2d] text-white text-sm font-semibold hover:bg-[#152a1e] transition-colors shadow-lg shadow-green-900/20">
                  Bắt đầu miễn phí
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
