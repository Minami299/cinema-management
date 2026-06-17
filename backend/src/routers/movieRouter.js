const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

// Định nghĩa endpoint của bạn
router.get("/all", movieController.handleGetAllMovies);

// 🔴 QUAN TRỌNG: Bạn phải có dòng này ở cuối file!
module.exports = router;
