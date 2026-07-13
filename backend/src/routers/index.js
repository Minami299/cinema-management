const express = require("express");
const router = express.Router();

const authRouter = require("./authRouter");
const movieRouter = require("./movieRouter");
const bookingRouter = require("./bookingRouter");
const showtimeRouter = require("./showtimeRoutes");
const cinemaRouter = require("./cinemaRouter");
const userRouter = require("./userRouter");
const foodItemRouter = require("./foodItemRouter");
const roomRouter = require("./roomRouter");
const roleRouter = require("./roleRouter");
const notificationRouter = require("./notificationRouter");

router.use("/auth", authRouter);
router.use("/movies", movieRouter);
router.use("/bookings", bookingRouter);
router.use("/showtimes", showtimeRouter);
router.use("/cinemas", cinemaRouter);
router.use("/users", userRouter);
router.use("/food-items", foodItemRouter);
router.use("/rooms", roomRouter);
router.use("/roles", roleRouter);
router.use("/notifications", notificationRouter);

module.exports = router;
