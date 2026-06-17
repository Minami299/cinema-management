const foodItemService = require("../services/foodItemService");

class FoodItemController {
  async create(req, res) {
    try {
      const foodItem = await foodItemService.createFoodItem(req.body);
      res.status(201).json({ success: true, data: foodItem });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const foodItems = await foodItemService.getAllFoodItems();
      res.status(200).json({ success: true, data: foodItems });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAvailable(req, res) {
    try {
      const foodItems = await foodItemService.getAvailableFoodItems();
      res.status(200).json({ success: true, data: foodItems });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const foodItem = await foodItemService.getFoodItemById(req.params.id);
      if (!foodItem) {
        return res
          .status(404)
          .json({ success: false, message: "Đồ ăn không tồn tại." });
      }
      res.status(200).json({ success: true, data: foodItem });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getByType(req, res) {
    try {
      const foodItems = await foodItemService.getFoodItemsByType(
        req.params.type,
      );
      res.status(200).json({ success: true, data: foodItems });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const foodItem = await foodItemService.updateFoodItem(
        req.params.id,
        req.body,
      );
      if (!foodItem) {
        return res
          .status(404)
          .json({ success: false, message: "Đồ ăn không tồn tại." });
      }
      res.status(200).json({ success: true, data: foodItem });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async toggleAvailability(req, res) {
    try {
      const foodItem = await foodItemService.toggleAvailability(req.params.id);
      res.status(200).json({ success: true, data: foodItem });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const foodItem = await foodItemService.deleteFoodItem(req.params.id);
      if (!foodItem) {
        return res
          .status(404)
          .json({ success: false, message: "Đồ ăn không tồn tại." });
      }
      res.status(200).json({ success: true, message: "Xóa đồ ăn thành công." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new FoodItemController();
