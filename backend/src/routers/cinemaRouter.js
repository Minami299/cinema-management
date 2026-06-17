const express = require("express");
const router = express.Router();
const cinemaController = require("../controllers/cinemaController");

router.post("/", cinemaController.create);
router.get("/", cinemaController.getAll);
router.get("/city/:city", cinemaController.getByCity);
router.get("/:id", cinemaController.getById);
router.put("/:id", cinemaController.update);
router.patch("/:id/status", cinemaController.updateStatus);
router.delete("/:id", cinemaController.delete);

module.exports = router;
