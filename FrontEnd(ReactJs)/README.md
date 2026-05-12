# FlashLearn FE

Frontend của bài tập được xây dựng bằng React + Vite + Redux Toolkit + React Router DOM + Tailwind CSS. Ứng dụng tập trung vào luồng xác thực người dùng và quản lý hồ sơ cá nhân, gồm các màn hình chính: đăng nhập, đăng ký, quên mật khẩu, trang chủ và chỉnh sửa profile.

## 1. Công nghệ sử dụng

- React 19
- Vite
- Redux Toolkit + React Redux
- React Router DOM
- Axios
- Tailwind CSS

## 2. Cấu trúc thư mục chính

### `src/App.jsx`

Đây là component gốc của ứng dụng FE. App không dùng router riêng mà điều hướng bằng state cục bộ `screen`.

App hiện dùng `BrowserRouter` và khai báo route trực tiếp trong `App.jsx`.

- `/login`, `/register`, `/forgot-password` là các route public.
- `/home`, `/profile` là các route cần đăng nhập.
- `RequireAuth` sẽ chặn người chưa đăng nhập và đẩy về `/login`.
- `PublicOnly` sẽ đẩy người đã đăng nhập từ `/login` hoặc `/register` sang `/home`.

### `src/main.jsx`

File khởi tạo React app, mount `App` vào DOM và import `styles/global.css`.

### `src/store/index.js`

Khởi tạo Redux store. Hiện tại store chỉ có một slice chính là `auth`.

### `src/store/authSlice.js`

Đây là nơi quản lý toàn bộ logic auth của FE:

- trạng thái đăng nhập (`isAuthenticated`)
- thông tin người dùng (`user`)
- trạng thái loading
- thông báo lỗi / thành công
- các async thunk gọi API: login, register, forgot password, fetch profile, update profile

### `src/util/api.js`

Tập trung toàn bộ hàm gọi API đến backend.

- `loginApi`
- `registerApi`
- `forgotPasswordApi`
- `getUserProfileApi`
- `updateProfileApi`

### `src/components/ui/`

Chứa các UI component tái sử dụng:

- `InputField`: input có label, icon, error, hint
- `Button`: nút chính, nút phụ, nút ghost
- `Alert`: hiển thị lỗi hoặc thành công
- `Spinner`: trạng thái loading
- `AuthCard`: khung card dùng cho màn hình auth
- `BrandLogo`: logo của app

### `src/components/layout/`

- `AuthLayout.jsx`: layout nền gradient cho các trang login/register/forgot password
- `Navbar.jsx`: thanh điều hướng cho user đã đăng nhập
- `header.jsx`, `auth-shell.jsx`: các component layout phụ/legacy nếu cần tái sử dụng

### `src/pages/`

- `login.jsx`: màn hình đăng nhập
- `register.jsx`: màn hình đăng ký
- `forgot-password.jsx`: màn hình quên mật khẩu
- `home.jsx`: trang chủ sau khi đăng nhập
- `user.jsx`: trang hồ sơ và chỉnh sửa profile

### `src/styles/global.css`

Khai báo theme, utility class và style dùng chung cho toàn bộ FE.

## 3. Luồng hoạt động tổng quát

### 3.1 Khởi động ứng dụng

1. `main.jsx` render `App`.
2. `App.jsx` bọc toàn bộ ứng dụng bằng `Provider` của Redux và `BrowserRouter`.
3. Trạng thái `isAuthenticated` được khởi tạo từ `localStorage` qua `access_token`.
4. Router quyết định màn hình nào được render dựa trên URL hiện tại.

### 3.2 Luồng đăng nhập

File xử lý chính: `src/pages/login.jsx`

1. Người dùng nhập email/username và mật khẩu.
2. FE kiểm tra validate cơ bản ở phía client.
3. Gọi `dispatch(loginUser({ identifier, password }))`.
4. `loginUser` trong `authSlice` gọi `loginApi()` đến backend.
5. Nếu backend trả về `redirect_url` và `accessToken`, token được lưu vào `localStorage`.
6. Redux cập nhật `isAuthenticated = true`.
7. Component gọi `navigate("/home", { replace: true })` để chuyển sang trang chủ.

Lưu ý:

- Checkbox “Ghi nhớ” hiện đang là trạng thái UI, chưa được xử lý riêng ở store.
- Khi có lỗi, thông báo được hiển thị bằng `Alert`.
- Sau khi login thành công, route `/login` sẽ tự bị chặn bởi `PublicOnly` nếu người dùng quay lại.

### 3.3 Luồng đăng ký

File xử lý chính: `src/pages/register.jsx`

1. Người dùng nhập `username`, `email`, `password`, `confirmPassword`.
2. FE kiểm tra các trường bắt buộc và xác nhận mật khẩu.
3. Gọi `dispatch(registerUser({ username, email, password }))`.
4. `registerUser` gọi `registerApi()` lên backend.
5. Nếu thành công, app hiển thị thông báo và gọi `navigate("/login", { replace: true })`.

### 3.4 Luồng quên mật khẩu

File xử lý chính: `src/pages/forgot-password.jsx`

1. Người dùng nhập email.
2. FE kiểm tra email không rỗng.
3. Gọi `dispatch(forgotPassword({ email }))`.
4. Backend xử lý gửi email khôi phục mật khẩu.
5. FE hiển thị thông báo thành công hoặc lỗi.
6. Nút quay lại đăng nhập dùng `navigate("/login")`.

### 3.5 Luồng xem và chỉnh sửa profile

File xử lý chính: `src/pages/user.jsx`

1. Khi vào màn hình profile, FE kiểm tra `isAuthenticated`.
2. Nếu chưa đăng nhập, `RequireAuth` trong `App.jsx` điều hướng về `login`.
3. Nếu đã đăng nhập, FE gọi `dispatch(fetchUserProfile())` để lấy dữ liệu hồ sơ.
4. Dữ liệu trả về được map vào form gồm `fullName`, `bio`, `phoneNumber`.
5. Người dùng bấm nút `Chỉnh sửa` để bật `editMode`.
6. Khi lưu, FE validate `fullName` rồi gọi `dispatch(updateProfile(form))`.
7. Nếu backend trả về thành công, `user` trong Redux được cập nhật và form thoát khỏi chế độ chỉnh sửa.
8. Nút đăng xuất gọi `dispatch(logout())` rồi `navigate("/login", { replace: true })`.

## 4. Các component quan trọng trong flow

### `AuthLayout`

Bao bọc các màn hình auth bằng một layout riêng, có background gradient và khối giới thiệu thương hiệu FlashLearn.

### `AuthCard`

Khung card trung tâm chứa form login/register/forgot password.

### `InputField`

Component input dùng lại cho nhiều màn hình. Nó hỗ trợ:

- label
- icon ở bên trái
- nút phụ ở bên phải
- hiển thị lỗi validate

### `Button`

Tự động hiển thị spinner khi `loading = true`.

### `Alert`

Hiển thị trạng thái lỗi và thành công từ Redux hoặc validate phía client.

### `Navbar`

Hiển thị khi user đã đăng nhập. Chứa:

- chuyển sang trang chủ
- chuyển sang hồ sơ
- đăng xuất
- sử dụng `useNavigate()` để đổi route theo URL thay vì đổi state nội bộ

### `BrandLogo`

Logo nhận diện của ứng dụng, dùng ở cả màn auth và màn chính.

## 5. Trạng thái auth trong Redux

Slice `auth` đang quản lý các trạng thái chính sau:

- `user`: dữ liệu profile của người dùng
- `isAuthenticated`: xác định đã đăng nhập hay chưa
- `loading`: trạng thái đang gọi API
- `error`: thông báo lỗi
- `successMsg`: thông báo thành công

Các hành động chính:

- `loginUser`
- `registerUser`
- `forgotPassword`
- `fetchUserProfile`
- `updateProfile`
- `logout`
- `clearMessages`

### Luồng Redux chi tiết

1. Component dùng `useDispatch()` để gửi action/thunk.
2. `createAsyncThunk` gọi API trong `src/util/api.js`.
3. Khi request bắt đầu, reducer `pending` bật `loading = true` và xóa `error`/`successMsg` cũ.
4. Khi request thành công, reducer `fulfilled` cập nhật `user`, `isAuthenticated` hoặc `successMsg`.
5. Khi request thất bại, reducer `rejected` gán `error` để UI hiển thị qua `Alert`.
6. Component dùng `useSelector()` để đọc state và render lại tương ứng.

Tóm tắt nhanh theo màn hình:

- Login: `dispatch(loginUser(...))` → lưu token vào `localStorage` → `navigate("/home")`.
- Register: `dispatch(registerUser(...))` → hiển thị thông báo → `navigate("/login")`.
- Forgot password: `dispatch(forgotPassword(...))` → hiển thị thông báo kết quả.
- Home/Profile: `dispatch(fetchUserProfile())` để lấy dữ liệu user, `dispatch(updateProfile(...))` để lưu chỉnh sửa.
- Logout: `dispatch(logout())` → xóa token khỏi `localStorage` → `navigate("/login")`.

### Luồng navigate chi tiết

1. React Router đọc URL hiện tại trong `BrowserRouter`.
2. `Routes` trong `App.jsx` quyết định component nào được render.
3. Khi người dùng bấm nút hoặc hoàn tất thao tác, component gọi `navigate(path)` từ `useNavigate()`.
4. Một số route được bảo vệ bằng `RequireAuth` và `PublicOnly`.
5. `replace: true` được dùng ở các bước login/logout để thay thế history hiện tại, tránh quay lại màn hình không phù hợp bằng nút Back.

## 6. Kết nối FE và BE

FE giao tiếp với BE thông qua `axios` được cấu hình sẵn trong `src/util/axios.customize.js`.

Luồng kết nối cụ thể:

1. Component ở `src/pages/` hoặc `src/store/authSlice.js` gọi các hàm API trong `src/util/api.js`.
2. `api.js` map từng nghiệp vụ sang đúng endpoint của backend, ví dụ:
   - `loginApi()` → `POST /api/auth/login`
   - `registerApi()` → `POST /api/auth/register`
   - `forgotPasswordApi()` → `POST /api/auth/forgot-password`
   - `getUserProfileApi()` → `GET /user/profile`
   - `updateProfileApi()` → `PUT /user/profile`
3. `axios.customize.js` tự gắn `baseURL` từ biến môi trường `VITE_BACKEND_URL`.
4. Nếu trong `localStorage` có `access_token`, interceptor sẽ tự thêm header `Authorization: Bearer <token>` vào request.
5. BE trả về JSON, interceptor response sẽ lấy trực tiếp `response.data` để component và Redux xử lý.
6. Nếu BE trả lỗi, interceptor sẽ trả về `error.response.data`, nên thông báo lỗi có thể hiển thị ngay trong `Alert`.

Ví dụ cấu hình môi trường:

```env
VITE_BACKEND_URL=http://localhost:8080
```

Ghi chú:

- `withCredentials: true` đang được bật để FE có thể làm việc với cookie/session nếu BE cần.
- Token đăng nhập được lưu trong `localStorage` với key `access_token`, nên các request cần xác thực sẽ tự có header `Authorization`.

## 7. Chạy dự án

```bash
npm install
npm run dev
```

Các lệnh khác:

```bash
npm run build
npm run lint
npm run preview
```

## 8. Ghi chú ngắn

- Ứng dụng hiện dùng React Router DOM để điều hướng giữa các màn hình.
- Token đăng nhập được lưu trong `localStorage` với key `access_token`.
- Luồng edit profile phụ thuộc vào dữ liệu profile lấy từ backend sau khi user đã đăng nhập.
