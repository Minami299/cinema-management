const mongoose = require("mongoose");

// Chi tiết vé ghế đã đặt
const TicketDetailSchema = new mongoose.Schema(
  {
    seatNumber: { type: String, required: true },
    seatType: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
);

// Chi tiết đồ ăn kèm đã mua
const FoodOrderDetailSchema = new mongoose.Schema(
  {
    foodItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodItem",
      required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // Lưu giá tại thời điểm mua thực tế
  },
  { _id: false },
);

const BookingSchema = new mongoose.Schema(
  {
    bookingCode: { type: String, required: true, unique: true }, // Mã đặt vé sinh ngẫu nhiên
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    showtimeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Showtime",
      required: true,
    },
    tickets: [TicketDetailSchema], // DANH SÁCH GHẾ ĐẶT (Nhúng trực tiếp)
    foodOrders: [FoodOrderDetailSchema], // DANH SÁCH ĐỒ ĂN ĐÍNH KÈM (Nhúng trực tiếp)
    totalPrice: { type: Number, required: true }, // Tổng tiền cuối cùng sau khi tính toán
    status: {
      type: String,
      enum: ["Pending", "Paid", "Cancelled"],
      default: "Pending",
    },
    payment: {
      // THÔNG TIN THANH TOÁN TÍCH HỢP (Nhúng trực tiếp)
      transactionId: { type: String }, // Mã giao dịch từ cổng thanh toán (VNPay/Momo)
      paymentMethod: { type: String }, // Ví dụ: 'VNPAY', 'MOMO', 'COUNTER_CASH'
      paidAt: { type: Date },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", BookingSchema);
s;
