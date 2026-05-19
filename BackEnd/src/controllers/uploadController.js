const httpStatus = require("http-status").status;

const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Không có tệp nào được tải lên!",
    });
  }

  return res.status(httpStatus.OK).json({
    message: "Tải ảnh lên thành công!",
    url: req.file.path, // Link ảnh từ Cloudinary
  });
};

module.exports = {
  uploadImage,
};
