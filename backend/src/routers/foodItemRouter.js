const express = require("express");
const router = express.Router();
const foodItemController = require("../controllers/foodItemController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  foodItemController.create,
);
router.get("/", foodItemController.getAll);
router.get("/available", foodItemController.getAvailable);
router.get("/type/:type", foodItemController.getByType);
router.get("/:id", foodItemController.getById);
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  foodItemController.update,
);
router.patch(
  "/:id/availability",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  foodItemController.toggleAvailability,
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  foodItemController.delete,
);

module.exports = router;
