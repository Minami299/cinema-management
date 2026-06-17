const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");

router.post("/", roleController.create);
router.get("/", roleController.getAll);
router.get("/name/:name", roleController.getByName);
router.get("/:id", roleController.getById);
router.put("/:id", roleController.update);
router.patch("/:id/permissions", roleController.updatePermissions);
router.post("/:id/permissions", roleController.addPermission);
router.delete("/:id/permissions", roleController.removePermission);
router.delete("/:id", roleController.delete);

module.exports = router;
