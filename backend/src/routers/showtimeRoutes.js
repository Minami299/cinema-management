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
router.get("/all", showtimeController.getAll);
router.get("/movie/:movieId", showtimeController.getByMovie);
router.get("/cinema/:cinemaId", showtimeController.getByCinema);
router.get("/:id", showtimeController.getById);
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  showtimeController.update,
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  showtimeController.delete,
);

module.exports = router;
