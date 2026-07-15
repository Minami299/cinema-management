const foodOrderService = require("../services/foodOrderService");

class FoodOrderController {
  async create(req, res) {
    try {
      const order = await foodOrderService.createOrder(req.user.id, req.body);
      res.status(201).json({ success: true, message: "Đặt Food & Drink thành công.", data: order });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getMyOrders(req, res) {
    try {
      const orders = await foodOrderService.getUserOrders(req.user.id);
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const orders = await foodOrderService.getAllOrders();
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new FoodOrderController();
