const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const foodOrderController = require("../controllers/foodOrderController");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();
router.post("/", authMiddleware, foodOrderController.create);
router.get("/my-orders", authMiddleware, foodOrderController.getMyOrders);
router.get("/", authMiddleware, authorizeRoles("ADMIN", "MANAGER", "STAFF"), foodOrderController.getAll);

module.exports = router;
