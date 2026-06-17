const express = require("express");
const router = express.Router();
const foodItemController = require("../controllers/foodItemController");

router.post("/", foodItemController.create);
router.get("/", foodItemController.getAll);
router.get("/available", foodItemController.getAvailable);
router.get("/type/:type", foodItemController.getByType);
router.get("/:id", foodItemController.getById);
router.put("/:id", foodItemController.update);
router.patch("/:id/availability", foodItemController.toggleAvailability);
router.delete("/:id", foodItemController.delete);

module.exports = router;
