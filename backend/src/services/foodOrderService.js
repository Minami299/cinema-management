const FoodItem = require("../models/FoodItem");
const FoodOrder = require("../models/FoodOrder");

class FoodOrderService {
  async createOrder(userId, orderData) {
    const { items, paymentMethod = "CASH" } = orderData;
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Vui lòng chọn ít nhất một món.");
    }
    if (!["CASH", "MOMO", "VNPAY"].includes(paymentMethod)) {
      throw new Error("Phương thức thanh toán không hợp lệ.");
    }

    const quantities = new Map();
    for (const item of items) {
      if (!item.foodItem || !Number.isInteger(item.quantity) || item.quantity < 1) {
        throw new Error("Thông tin món ăn không hợp lệ.");
      }
      quantities.set(item.foodItem, (quantities.get(item.foodItem) || 0) + item.quantity);
    }

    const foodItems = await FoodItem.find({ _id: { $in: [...quantities.keys()] }, isAvailable: true });
    if (foodItems.length !== quantities.size) {
      throw new Error("Một hoặc nhiều món đã ngừng phục vụ.");
    }

    const savedItems = foodItems.map((food) => ({
      foodItem: food._id,
      quantity: quantities.get(food._id),
      price: food.price,
    }));
    const totalAmount = savedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const isOnlinePayment = paymentMethod !== "CASH";

    return FoodOrder.create({
      user: userId,
      items: savedItems,
      totalAmount,
      paymentMethod,
      paymentStatus: isOnlinePayment ? "Completed" : "Pending",
    });
  }

  async getUserOrders(userId) {
    return FoodOrder.find({ user: userId }).populate("items.foodItem").sort({ createdAt: -1 });
  }

  async getAllOrders() {
    return FoodOrder.find()
      .populate("user", "name email phone")
      .populate("items.foodItem", "name")
      .sort({ createdAt: -1 });
  }
}

module.exports = new FoodOrderService();
