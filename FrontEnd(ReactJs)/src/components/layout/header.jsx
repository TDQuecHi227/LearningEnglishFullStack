import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { key: "login", label: "Login", path: "/login" },
  { key: "register", label: "Register", path: "/register" },
  { key: "forgot", label: "Forgot", path: "/forgot-password" },
  { key: "profile", label: "Profile", path: "/profile" },
];

export function LearningHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeScreen = location.pathname.replace(/^\//, "") || "login";

  return (
    <header className="app-header">
      <nav className="nav-tabs" aria-label="Auth navigation">
        {navItems.map((item) => {
          const isActive = activeScreen === item.key;

          return (
            <button
              key={item.key}
              type="button"
              className={`nav-tab${isActive ? " nav-tab--active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
