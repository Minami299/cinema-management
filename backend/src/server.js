require("dotenv").config(); // Vẫn để trên đầu, tự động tìm file .env ở thư mục gốc

const express = require("express");
const connectDB = require("./config/db"); // Đường dẫn tương đối tính từ src/server.js
const router = require("./routers/index"); // ĐÃ SỬA: Bỏ chữ "src/" đi vì bạn đang ở trong src rồi

const app = express();
connectDB();

app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
