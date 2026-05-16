const express = require("express");
const router = express.Router();
const uploadCloud = require("../config/cloudinary.config");
const uploadController = require("../controllers/uploadController");
const { verifyToken } = require("../middleware/authMiddleware");

const initUploadRoutes = (app) => {
  // Route upload ảnh (yêu cầu đăng nhập)
  // Field name trong form-data phải là "image"
  router.post(
    "/upload",
    verifyToken,
    uploadCloud.single("image"),
    uploadController.uploadImage
  );

  return app.use("/api/v1", router);
};

module.exports = initUploadRoutes;
