const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

// GET ALL MOVIES
router.get("/all", movieController.handleGetAllMovies);

// HOME MOVIES
router.get("/home", movieController.getHomeMovies);

// GET MOVIE DETAIL (FIX 404 ERROR)
router.get("/:id", movieController.handleGetMovieById);

module.exports = router;
