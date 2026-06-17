const express = require("express");
const router = express.Router();

// Import các router con độc lập
const movieRouter = require("./movieRouter");
const bookingRouter = require("./bookingRoutes");
const cinemaRouter = require("./cinemaRouter");
const userRouter = require("./userRouter");
const foodItemRouter = require("./foodItemRouter");
const roomRouter = require("./roomRouter");
const roleRouter = require("./roleRouter");
const notificationRouter = require("./notificationRouter");
const showtimeRouter = require("./showtimeRoutes");

// Đăng ký các tuyến đường (routes)
router.use("/movies", movieRouter);
router.use("/bookings", bookingRouter);
router.use("/cinemas", cinemaRouter);
router.use("/users", userRouter);
router.use("/food-items", foodItemRouter);
router.use("/rooms", roomRouter);
router.use("/roles", roleRouter);
router.use("/notifications", notificationRouter);
router.use("/showtimes", showtimeRouter);

// Xuất router tổng ra để server.js sử dụng
module.exports = router;
