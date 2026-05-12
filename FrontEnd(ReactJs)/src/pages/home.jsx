import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, logout } from "../store/authSlice.js";
import { BrandLogo, Button } from "../components/ui/index.jsx";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated, navigate, user]);

  useEffect(() => {
    const onDocumentClick = (event) => {
      const target = event.target;
      if (target && !target.closest?.("[data-avatar-menu]")) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  const avatarInitial = useMemo(() => {
    const source =
      user?.profile?.fullName || user?.username || user?.email || "U";
    return source.trim().charAt(0).toUpperCase();
  }, [user]);

  const avatarSrc =
    user?.profile?.avatarUrl && user.profile.avatarUrl !== "default-avatar.png"
      ? user.profile.avatarUrl
      : "";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-teal-50/30">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="shrink-0"
          >
            <BrandLogo size="sm" />
          </button>

          <div className="hidden md:flex items-center gap-2 rounded-full bg-gray-50 px-2 py-1.5 border border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="nav-pill nav-pill-active"
            >
              Trang chủ
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="nav-pill nav-pill-inactive"
            >
              Hồ sơ
            </button>
          </div>

          <div className="relative" data-avatar-menu>
            <button
              type="button"
              onClick={() => setProfileOpen((current) => !current)}
              className="flex items-center gap-3 rounded-full bg-white border border-brand-100 shadow-sm px-2.5 py-1.5 hover:shadow-md transition-shadow"
            >
              <span className="hidden sm:block text-sm font-medium text-gray-600 max-w-[180px] truncate">
                {user?.profile?.fullName ||
                  user?.username ||
                  user?.email ||
                  "Tài khoản"}
              </span>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-sm">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={user?.profile?.fullName || user?.username || "Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{avatarInitial}</span>
                )}
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-3xl border border-brand-100 bg-white shadow-2xl shadow-brand-100/40 overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-brand-500 to-teal-500" />
                <div className="px-5 pb-5 -mt-10">
                  <div className="flex items-end gap-4">
                    <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden bg-white shadow-lg flex items-center justify-center text-2xl font-bold text-brand-700">
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt={
                            user?.profile?.fullName ||
                            user?.username ||
                            "Avatar"
                          }
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{avatarInitial}</span>
                      )}
                    </div>
                    <div className="pb-1">
                      <h3 className="font-display text-lg font-bold text-gray-900 leading-tight">
                        {user?.profile?.fullName ||
                          user?.username ||
                          "Tài khoản"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        @{user?.username || "user"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3 text-sm text-gray-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Email</span>
                        <span className="font-medium text-gray-800 truncate max-w-[180px]">
                          {user?.email || "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Trạng thái</span>
                        <span className="font-medium text-brand-700">
                          {user?.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        className="text-sm"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/profile");
                        }}
                      >
                        Xem hồ sơ
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="text-sm text-red-600 border-red-200 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
          <div className="space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-100 px-4 py-2 text-sm font-medium text-brand-700">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              FlashLearn đang hoạt động
            </div>

            <div className="space-y-4 max-w-2xl">
              <h1 className="font-display text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Chào mừng, {user?.profile?.fullName || user?.username || "bạn"}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                Học tiếng Anh theo cách gọn gàng, trực quan và dễ nhớ hơn. Nhấn
                avatar ở góc trên bên phải để xem profile nhanh.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                className="w-auto px-6"
                onClick={() => navigate("/profile")}
              >
                Mở hồ sơ
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-auto px-6"
                onClick={() => setProfileOpen(true)}
              >
                Xem nhanh profile
              </Button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-4">
              {[
                ["10k+", "Từ vựng"],
                ["95%", "Ghi nhớ"],
                ["30 ngày", "Lộ trình"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-3xl bg-white/80 border border-white shadow-lg shadow-brand-100/40 p-5"
                >
                  <div className="font-display text-2xl font-bold text-brand-700">
                    {value}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-brand-500 to-teal-500 blur-2xl opacity-20" />
            <div className="relative rounded-[2rem] bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-brand-100/40 p-8 overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,_#16a34a_0,_transparent_35%),radial-gradient(circle_at_bottom_right,_#14b8a6_0,_transparent_32%)]" />
              <div className="relative space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-3xl">
                  ✨
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-gray-900">
                    Học từ vựng mỗi ngày
                  </h2>
                  <p className="mt-2 text-gray-600 leading-relaxed">
                    Tạo lộ trình học, kiểm tra tiến độ và mở profile nhanh từ
                    avatar mà không cần rời trang chủ.
                  </p>
                </div>
                <div className="grid gap-3">
                  <div className="rounded-2xl bg-brand-50 border border-brand-100 px-4 py-3 text-sm text-brand-800">
                    Avatar góc phải trên để mở profile
                  </div>
                  <div className="rounded-2xl bg-teal-50 border border-teal-100 px-4 py-3 text-sm text-teal-800">
                    Có thể xem hồ sơ nhanh hoặc đi tới trang profile đầy đủ
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
