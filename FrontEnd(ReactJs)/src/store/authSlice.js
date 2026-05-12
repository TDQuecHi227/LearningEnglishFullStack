import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginApi,
  googleLoginApi,
  registerApi,
  forgotPasswordApi,
  getUserProfileApi,
  updateProfileApi,
} from "../util/api";

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ identifier, password }, { rejectWithValue }) => {
    try {
      const res = await loginApi(identifier, password);
      if (res?.redirect_url) {
        if (res.accessToken) {
          localStorage.setItem("access_token", res.accessToken);
        } else {
          localStorage.removeItem("access_token");
        }
        return res;
      }
      return rejectWithValue(res?.message || "Đăng nhập thất bại");
    } catch (err) {
      return rejectWithValue(err?.message || "Lỗi kết nối server");
    }
  },
);

export const googleLoginUser = createAsyncThunk(
  "auth/googleLogin",
  async ({ idToken }, { rejectWithValue }) => {
    try {
      const res = await googleLoginApi(idToken);
      if (res?.redirect_url) {
        if (res.accessToken) {
          localStorage.setItem("access_token", res.accessToken);
        } else {
          localStorage.removeItem("access_token");
        }
        return res;
      }
      return rejectWithValue(res?.message || "Đăng nhập Google thất bại");
    } catch (err) {
      return rejectWithValue(err?.message || "Lỗi kết nối server");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const res = await registerApi(username, email, password);
      if (res?.message) return res;
      return rejectWithValue(res?.message || "Đăng ký thất bại");
    } catch (err) {
      return rejectWithValue(err?.message || "Lỗi kết nối server");
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await forgotPasswordApi(email);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || "Lỗi kết nối server");
    }
  },
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserProfileApi();
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || "Không thể tải thông tin");
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await updateProfileApi(profileData);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || "Cập nhật thất bại");
    }
  },
);

const initialState = {
  user: null,
  isAuthenticated: !!localStorage.getItem("access_token"),
  loading: false,
  error: null,
  successMsg: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMsg = null;
      localStorage.removeItem("access_token");
    },
    clearMessages(state) {
      state.error = null;
      state.successMsg = null;
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
      state.successMsg = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.successMsg = action.payload?.message || "Đăng nhập thành công!";
      })
      .addCase(loginUser.rejected, rejected);

    builder
      .addCase(googleLoginUser.pending, pending)
      .addCase(googleLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.successMsg =
          action.payload?.message || "Đăng nhập Google thành công!";
      })
      .addCase(googleLoginUser.rejected, rejected);

    builder
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg =
          action.payload?.message || "Đăng ký thành công! Vui lòng đăng nhập.";
      })
      .addCase(registerUser.rejected, rejected);

    builder
      .addCase(forgotPassword.pending, pending)
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.successMsg =
          "Email khôi phục đã được gửi! Kiểm tra hộp thư của bạn.";
      })
      .addCase(forgotPassword.rejected, rejected);

    builder
      .addCase(fetchUserProfile.pending, pending)
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data || null;
      })
      .addCase(fetchUserProfile.rejected, rejected);

    builder
      .addCase(updateProfile.pending, pending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = "Cập nhật hồ sơ thành công!";
        if (action.payload?.user) state.user = action.payload.user;
      })
      .addCase(updateProfile.rejected, rejected);
  },
});

export const { logout, clearMessages, setUser } = authSlice.actions;
export default authSlice.reducer;
