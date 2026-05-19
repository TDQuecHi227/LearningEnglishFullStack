const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");
const { validateProfileUpdate } = require("../validations/validator");
const profileController = require("../controllers/profileController");
const homeController = require("../controllers/homeController");
const courseController = require("../controllers/courseController");
const initAPI = (app) => {
  router.get("/", (req, res) => {
    return res.send("Homepage");
  });
  router.get(
    "/user/profile",
    verifyToken,
    authorizeRole("user"),
    profileController.userProfile,
  );
  router.put(
    "/user/profile",
    verifyToken,
    authorizeRole("user"),
    validateProfileUpdate,
    profileController.updateProfile,
  );
  router.get(
    "/admin/profile",
    verifyToken,
    authorizeRole("admin"),
    profileController.adminProfile,
  );
  router.put(
    "/admin/profile",
    verifyToken,
    authorizeRole("admin"),
    validateProfileUpdate,
    profileController.updateProfile,
  );
  router.get("/home", homeController.getHomePage);
  router.get("/courses", courseController.getAllCourses);
  router.get("/courses/:id", courseController.getCourseDetail);
  return app.use("/", router);
};
module.exports = initAPI;
