const express = require("express");
const router = express.Router();
const foodItemController = require("../controllers/foodItemController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const staffOnly = [authMiddleware, authorizeRoles("ADMIN", "MANAGER", "STAFF")];

router.get("/", foodItemController.getAll);
router.get("/available", foodItemController.getAvailable);
router.get("/type/:type", foodItemController.getByType);
router.get("/:id", foodItemController.getById);
router.post("/", ...staffOnly, foodItemController.create);
router.put("/:id", ...staffOnly, foodItemController.update);
router.patch("/:id/availability", ...staffOnly, foodItemController.toggleAvailability);
router.delete("/:id", ...staffOnly, foodItemController.delete);

module.exports = router;
