const express = require("express");
const router = express.Router();
const showtimeController = require("../controllers/showtimeController");

router.post("/", showtimeController.create);
router.get("/cinema/:cinemaId", showtimeController.getByCinema);
router.get("/:id", showtimeController.getById);

module.exports = router;
