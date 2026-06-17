const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

router.post("/", roomController.create);
router.get("/", roomController.getAll);
router.get("/cinema/:cinemaId", roomController.getByCinema);
router.get("/:id", roomController.getById);
router.get("/:id/seats", roomController.getSeats);
router.get("/:id/capacity", roomController.getCapacity);
router.put("/:id", roomController.update);
router.delete("/:id", roomController.delete);

module.exports = router;
