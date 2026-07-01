const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Public routes - không cần đăng nhập
router.get("/all", movieController.handleGetAllMovies);
router.get("/home", movieController.getHomeMovies);
router.get("/:id", movieController.handleGetMovieById);

// Write routes - chỉ ADMIN và MANAGER (dùng khi bổ sung controller sau)
// router.post("/", authMiddleware, authorizeRoles("ADMIN", "MANAGER"), movieController.create);
// router.put("/:id", authMiddleware, authorizeRoles("ADMIN", "MANAGER"), movieController.update);
// router.delete("/:id", authMiddleware, authorizeRoles("ADMIN"), movieController.delete);

module.exports = router;
