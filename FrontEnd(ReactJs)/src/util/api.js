import axios from "./axios.customize";

// Auth APIs — matched to BE/src/routes/authRoutes.js
export const loginApi = (identifier, password) =>
  axios.post("/api/auth/login", { identifier, password });

export const googleLoginApi = (idToken) =>
  axios.post("/api/auth/google", { idToken });

export const registerApi = (username, email, password) =>
  axios.post("/api/auth/register", { username, email, password });

export const forgotPasswordApi = (email) =>
  axios.post("/api/auth/forgot-password", { email });

export const resetPasswordApi = (token, newPassword) =>
  axios.post("/api/auth/reset-password", { token, newPassword });

// Profile APIs — matched to BE/src/routes/api.js
export const getUserProfileApi = () => axios.get("/user/profile");

export const getAdminProfileApi = () => axios.get("/admin/profile");

export const updateProfileApi = (profileData) =>
  axios.put("/user/profile", profileData);
