const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

router.get("/all", movieController.handleGetAllMovies);
router.get("/home", movieController.getHomeMovies);
router.get("/:id", movieController.handleGetMovieById);

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  movieController.handleCreateMovie,
);
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  movieController.handleUpdateMovie,
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  movieController.handleDeleteMovie,
);

module.exports = router;
