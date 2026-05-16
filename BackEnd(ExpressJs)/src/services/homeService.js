const Course = require("../models/Course");

const getHomePageData = async () => {
    const baseQuery = { status: "published" };

    const promotionalCoursesPromise = Course.find({
        ...baseQuery,
        discountPrice: { $gt: 0, $ne: null },
    })
        .populate("teacherId", "username avatar")
        .limit(4);

    const newestCoursesPromise = Course.find(baseQuery)
        .sort({ createdAt: -1 })
        .limit(4);

    const bestSellingCoursesPromise = Course.find(baseQuery)
        .sort({ totalEnrollments: -1 })
        .limit(4);

    const [promotionalCourses, newestCourses, bestSellingCourses] =
        await Promise.all([
            promotionalCoursesPromise,
            newestCoursesPromise,
            bestSellingCoursesPromise,
        ]);

    return {
        promotionalCourses,
        newestCourses,
        bestSellingCourses,
    };
};

module.exports = {
    getHomePageData,
};
