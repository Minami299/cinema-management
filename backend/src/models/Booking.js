const mongoose = require("mongoose");

// Chi tiết các ghế được đặt trong hóa đơn này
const TicketDetailSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  price: { type: Number, required: true },
});

// Chi tiết đồ ăn thức uống kèm theo
const FoodOrderSchema = new mongoose.Schema({
  foodItem: {
    type: String,
    ref: "FoodItem",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, // Giá tại thời điểm mua
});

// Thông tin chi tiết về giao dịch thanh toán
const PaymentSchema = new mongoose.Schema({
  paymentMethod: {
    type: String,
    enum: ["VNPAY", "MOMO", "CASH"],
    required: true,
  },
  transactionId: { type: String }, // Mã giao dịch từ cổng thanh toán
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  paidAt: { type: Date },
});

const BookingSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    user: { type: String, ref: "User", required: true },
    showtime: {
      type: String,
      ref: "Showtime",
      required: true,
    },
    tickets: [TicketDetailSchema], // Nhúng chi tiết vé ghế ngồi
    foods: [FoodOrderSchema], // Nhúng chi tiết đồ ăn kèm theo (F&B)
    payment: PaymentSchema, // Nhúng trạng thái và thông tin giao dịch thanh toán
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", BookingSchema);
