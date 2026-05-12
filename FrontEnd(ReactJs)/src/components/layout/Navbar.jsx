import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import { BrandLogo } from "../ui/index.jsx";

export function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const publicNav = [
    { key: "login", label: "Đăng nhập" },
    { key: "register", label: "Đăng ký" },
    { key: "forgot", label: "Quên mật khẩu" },
  ];

  const authNav = [
    { key: "home", label: "Trang chủ" },
    { key: "profile", label: "Hồ sơ" },
  ];

  const navItems = isAuthenticated ? authNav : publicNav;
  const currentPage = location.pathname.replace(/^\//, "") || "login";
  const activeKey = currentPage === "forgot-password" ? "forgot" : currentPage;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(isAuthenticated ? "/home" : "/login")}
          className="shrink-0"
        >
          <BrandLogo size="sm" />
        </button>

        <nav className="flex items-center gap-1 bg-gray-50 rounded-full px-2 py-1.5">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() =>
                navigate(
                  `/${item.key === "forgot" ? "forgot-password" : item.key}`,
                )
              }
              className={`nav-pill ${activeKey === item.key ? "nav-pill-active" : "nav-pill-inactive"}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors font-medium px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            Đăng xuất
          </button>
        )}
      </div>
    </header>
  );
}
