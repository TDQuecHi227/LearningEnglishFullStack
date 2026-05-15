import express from "express";
import httpStatus from "http-status";
import cookieParser from "cookie-parser";
import cors from "cors";
import viewEngine from "./config/viewEngine";
import connectDB from "./config/configdb";
import authRoutes from "./routes/authRoutes";
import initAPI from "./routes/api";
import initUploadRoutes from "./routes/uploadRoutes";
const app = express();
const PORT = process.env.PORT || 8081;
connectDB();

// Cấu hình CORS để cho phép frontend gọi API và gửi cookie
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
viewEngine(app);

authRoutes(app);
initAPI(app);
initUploadRoutes(app);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: "Đã có lỗi xảy ra từ phía server!",
    error: err.message // Hiện lỗi chi tiết để debug
  });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
