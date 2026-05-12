import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import store from "./store/index.js";
import HomePage from "./pages/home.jsx";
import LoginPage from "./pages/login.jsx";
import RegisterPage from "./pages/register.jsx";
import ForgotPasswordPage from "./pages/forgot-password.jsx";
import ProfilePage from "./pages/user.jsx";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={
              <PublicOnly>
                <LoginPage />
              </PublicOnly>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnly>
                <RegisterPage />
              </PublicOnly>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicOnly>
                <ForgotPasswordPage />
              </PublicOnly>
            }
          />
          <Route
            path="/home"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

function RequireAuth({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicOnly({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default App;
