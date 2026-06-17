const FoodItem = require("../models/FoodItem");

class FoodItemService {
  async createFoodItem(foodData) {
    try {
      const newFoodItem = new FoodItem(foodData);
      return await newFoodItem.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Tên đồ ăn đã tồn tại.");
      }
      throw error;
    }
  }

  async getAllFoodItems() {
    return await FoodItem.find().sort({ name: 1 });
  }

  async getAvailableFoodItems() {
    return await FoodItem.find({ isAvailable: true }).sort({ name: 1 });
  }

  async getFoodItemById(id) {
    return await FoodItem.findById(id);
  }

  async getFoodItemsByType(type) {
    return await FoodItem.find({ type, isAvailable: true }).sort({ name: 1 });
  }

  async updateFoodItem(id, updateData) {
    return await FoodItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async toggleAvailability(id) {
    const foodItem = await FoodItem.findById(id);
    if (!foodItem) throw new Error("Đồ ăn không tồn tại.");

    foodItem.isAvailable = !foodItem.isAvailable;
    return await foodItem.save();
  }

  async deleteFoodItem(id) {
    return await FoodItem.findByIdAndDelete(id);
  }

  async getFoodItemsByIds(ids) {
    return await FoodItem.find({ _id: { $in: ids } });
  }
}

module.exports = new FoodItemService();
