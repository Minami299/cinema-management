const mongoose = require("mongoose");

const FoodOrderItemSchema = new mongoose.Schema(
  {
    foodItem: { type: String, ref: "FoodItem", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const FoodOrderSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    user: { type: String, ref: "User", required: true },
    items: { type: [FoodOrderItemSchema], required: true, validate: [(items) => items.length > 0, "Đơn hàng phải có ít nhất một món."] },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ["CASH", "MOMO", "VNPAY"], default: "CASH" },
    paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
    status: { type: String, enum: ["Pending", "Preparing", "Ready", "Completed", "Cancelled"], default: "Pending" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FoodOrder", FoodOrderSchema);
