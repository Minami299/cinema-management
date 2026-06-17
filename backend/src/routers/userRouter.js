const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/", userController.create);
router.get("/", userController.getAll);
router.get("/email/:email", userController.getByEmail);
router.get("/:id", userController.getById);
router.get("/:id/favorites", userController.getFavorites);
router.put("/:id", userController.update);
router.patch("/:id/password", userController.updatePassword);
router.post("/:id/favorites", userController.addFavorite);
router.delete("/:id/favorites", userController.removeFavorite);
router.delete("/:id", userController.delete);

module.exports = router;
