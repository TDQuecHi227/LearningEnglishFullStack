const Course = require("../models/Course.js");
const getAllCourses = async (page = 1, limit = 9, filters = {}) => {
    try {
        const skip = (page - 1) * limit;
        const query = { status: "published" };

        // Lọc theo từ khóa tìm kiếm (title)
        if (filters.search) {
            query.title = { $regex: filters.search, $options: "i" };
        }

        // Lọc theo danh mục
        if (filters.category && filters.category !== "All") {
            query.category = filters.category;
        }

        // Lọc theo giá (Miễn phí/Có phí)
        if (filters.priceType === "free") {
            query.price = 0;
        } else if (filters.priceType === "paid") {
            query.price = { $gt: 0 };
        }

        const [courses, totalCourses] = await Promise.all([
            Course.find(query)
                .populate("teacherId", "username email")
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Course.countDocuments(query)
        ]);

        return {
            courses,
            pagination: {
                totalItems: totalCourses,
                totalPages: Math.ceil(totalCourses / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        };
    } catch (error) {
        console.log("Error in courseService.getAllCourses: ", error);
        throw error;
    }
};

const getCourseById = async (id) => {
    try {
        const course = await Course.findById(id).populate("teacherId", "username email");
        return course;
    }
    catch (error) {
        console.log("Error in courseService.getCourseById: ", error);
        throw error;
    }
}
module.exports = {
    getAllCourses,
    getCourseById
};