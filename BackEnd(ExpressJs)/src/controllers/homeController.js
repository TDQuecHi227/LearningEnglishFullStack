const httpStatus = require("http-status").status;
const homeService = require("../services/homeService")
const getHomePage = async (req, res) => {
    try {
        const data = await homeService.getHomePageData();
        return res.status(httpStatus.OK).json(data);
    } catch (error) {
        console.error("Home Page Data Error:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Lỗi server nội bộ khi lấy dữ liệu trang chủ."
        });
    }
};

module.exports = {
    getHomePage,
};