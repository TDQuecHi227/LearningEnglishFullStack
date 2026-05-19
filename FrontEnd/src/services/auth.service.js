import { apiCall } from './api';

export const authService = {
  login: async (identifier, password) => {
    return await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  },

  googleLogin: async (idToken) => {
    return await apiCall('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  },

  register: async (userData) => {
    return await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  verifyOtp: async (email, otpCode) => {
    return await apiCall('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otpCode }),
    });
  },

  forgotPassword: async (email) => {
    return await apiCall('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (resetToken, newPassword) => {
    return await apiCall('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ resetToken, newPassword }),
    });
  },

  logout: async () => {
    return await apiCall('/api/auth/logout', {
      method: 'POST',
    });
  },

  getProfile: async (role) => {
    // role is either 'user' or 'admin'
    return await apiCall(`/${role}/profile`, {
      method: 'GET',
    });
  },

  updateProfile: async (role, profileData) => {
    return await apiCall(`/${role}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  uploadAvatar: async (file) => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${BASE_URL}/api/v1/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Có lỗi xảy ra khi tải ảnh lên');
    }
    return data;
  }
};
