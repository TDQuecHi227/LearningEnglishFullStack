import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  role: localStorage.getItem("role") || null,
  isAuthenticated: Boolean(localStorage.getItem("role")),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      const { user, role } = action.payload || {};
      state.user = user || null;
      state.role = role || null;
      state.isAuthenticated = Boolean(user || role);
    },
    clearAuth(state) {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
