const express = require("express");
const router = express.Router();
const showtimeController = require("../controllers/showtimeController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  showtimeController.create,
);
router.get("/movie/:movieId", showtimeController.getByMovie);

module.exports = router;
