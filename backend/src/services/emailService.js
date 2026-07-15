const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendBookingSuccessEmail(userEmail, user, booking) {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === "your_email@gmail.com") {
      console.warn("Email service is not configured. Please set EMAIL_USER and EMAIL_PASS in your .env file.");
      return;
    }

    try {
      const movieTitle = booking.showtime?.movie?.title || "Phim chưa cập nhật";
      const posterUrl = booking.showtime?.movie?.posterUrl || "";
      const cinemaName = booking.showtime?.cinema?.name || "Rạp chưa cập nhật";
      const roomName = booking.showtime?.room?.name || "N/A";
      const showDate = booking.showtime?.date
        ? new Date(booking.showtime.date).toLocaleDateString("vi-VN")
        : "N/A";
      const showTime = booking.showtime?.startTime || "N/A";
      const seatsStr = booking.tickets?.map((t) => t.seatNumber).join(", ") || "N/A";
      const totalVal = booking.totalAmount
        ? booking.totalAmount.toLocaleString("vi-VN") + " VNĐ"
        : "0 VNĐ";

      let foodsListHtml = "";
      if (booking.foods && booking.foods.length > 0) {
        foodsListHtml = `
          <div style="margin-top: 15px; padding: 12px; background: #2a2a35; border-radius: 8px;">
            <strong style="color: #a78bfa; font-size: 0.95rem; display: block; margin-bottom: 8px;">ĐỒ ĂN KÈM:</strong>
            <ul style="margin: 0; padding-left: 20px; color: #d1d5db; font-size: 0.9rem;">
              ${booking.foods
                .map(
                  (f) =>
                    `<li>${f.foodItem?.name || "Combo"} x${f.quantity}</li>`
                )
                .join("")}
            </ul>
          </div>
        `;
      }

      const bookingId = booking._id || booking.id;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
        `VE_${bookingId}`
      )}`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Xác nhận đặt vé thành công - CinemaHub</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #121214;
              color: #e4e4e7;
              margin: 0;
              padding: 0;
            }
            .email-wrapper {
              max-width: 600px;
              margin: 30px auto;
              background: #1e1e24;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0,0,0,0.5);
              border: 1px solid #2e2e38;
            }
            .header {
              background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%);
              padding: 30px 20px;
              text-align: center;
              border-bottom: 1px solid #2e2e38;
            }
            .logo {
              color: #ffffff;
              font-size: 24px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin: 0;
            }
            .logo span {
              color: #ff3b30;
            }
            .content {
              padding: 30px;
            }
            .title {
              font-size: 20px;
              color: #ffffff;
              margin-top: 0;
              margin-bottom: 10px;
              text-align: center;
              font-weight: 700;
            }
            .subtitle {
              color: #9ca3af;
              font-size: 14px;
              margin-bottom: 30px;
              text-align: center;
            }
            .ticket-card {
              border: 1px dashed #4b5563;
              border-radius: 12px;
              padding: 20px;
              background: #18181c;
              margin-bottom: 25px;
            }
            .movie-title {
              font-size: 18px;
              color: #fca5a5;
              font-weight: bold;
              margin-bottom: 15px;
              border-bottom: 1px solid #2e2e38;
              padding-bottom: 10px;
            }
            .grid {
              display: table;
              width: 100%;
            }
            .grid-row {
              display: table-row;
            }
            .grid-cell {
              display: table-cell;
              padding: 8px 0;
              font-size: 14px;
            }
            .label {
              color: #9ca3af;
              font-weight: 500;
            }
            .value {
              color: #ffffff;
              font-weight: bold;
              text-align: right;
            }
            .qr-section {
              text-align: center;
              margin-top: 25px;
              padding-top: 20px;
              border-top: 1px solid #2e2e38;
            }
            .qr-image {
              background: #ffffff;
              padding: 10px;
              border-radius: 8px;
              display: inline-block;
            }
            .ticket-id {
              display: block;
              margin-top: 8px;
              font-size: 12px;
              color: #9ca3af;
              font-family: monospace;
            }
            .footer {
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              background: #18181c;
              border-top: 1px solid #2e2e38;
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <h1 class="logo">Cinema<span>Hub</span></h1>
            </div>
            <div class="content">
              <h2 class="title">Xác Nhận Đặt Vé Thành Công!</h2>
              <p class="subtitle">Chào ${user.name || "khách hàng"}, cảm ơn bạn đã đặt vé tại CinemaHub. Dưới đây là thông tin vé của bạn:</p>
              
              <div class="ticket-card">
                <div class="movie-title">${movieTitle}</div>
                <div class="grid">
                  <div class="grid-row">
                    <div class="grid-cell label">Rạp:</div>
                    <div class="grid-cell value">${cinemaName}</div>
                  </div>
                  <div class="grid-row">
                    <div class="grid-cell label">Phòng chiếu:</div>
                    <div class="grid-cell value">${roomName}</div>
                  </div>
                  <div class="grid-row">
                    <div class="grid-cell label">Ngày chiếu:</div>
                    <div class="grid-cell value">${showDate}</div>
                  </div>
                  <div class="grid-row">
                    <div class="grid-cell label">Suất chiếu:</div>
                    <div class="grid-cell value">${showTime}</div>
                  </div>
                  <div class="grid-row">
                    <div class="grid-cell label">Danh sách ghế:</div>
                    <div class="grid-cell value" style="color: #ffb400;">${seatsStr}</div>
                  </div>
                  <div class="grid-row">
                    <div class="grid-cell label">Tổng tiền:</div>
                    <div class="grid-cell value" style="color: #4ade80;">${totalVal}</div>
                  </div>
                  <div class="grid-row">
                    <div class="grid-cell label">Trạng thái:</div>
                    <div class="grid-cell value" style="color: ${booking.status === 'Confirmed' ? '#4ade80' : booking.status === 'Cancelled' ? '#f87171' : '#fbbf24'};">${booking.status === 'Confirmed' ? 'Đã xác nhận' : booking.status === 'Cancelled' ? 'Đã hủy' : 'Chờ thanh toán'}</div>
                  </div>
                </div>
                
                ${foodsListHtml}

                <div class="qr-section">
                  <div class="qr-image">
                    <img src="${qrCodeUrl}" alt="QR Code Vé" width="130" height="130" style="display: block;">
                  </div>
                  <span class="ticket-id">MÃ VÉ: ${bookingId.toString().toUpperCase()}</span>
                </div>
              </div>
              
              <p style="font-size: 13px; color: #9ca3af; text-align: center;">Vui lòng đưa mã QR này cho nhân viên soát vé tại rạp để nhận vé vào phòng chiếu.</p>
            </div>
            <div class="footer">
              Đây là email tự động từ hệ thống CinemaHub. Vui lòng không trả lời email này.<br>
              &copy; 2026 CinemaHub. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `;

      await this.transporter.sendMail({
        from: `"CinemaHub" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `[CinemaHub] Xác nhận đặt vé thành công: ${movieTitle}`,
        html: htmlContent,
      });

      console.log(`[EmailService] Đã gửi email xác nhận thành công tới: ${userEmail}`);
    } catch (error) {
      console.error("[EmailService] Lỗi khi gửi email:", error.message);
    }
  }

  async sendResetPasswordOTPEmail(userEmail, userName, otp) {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === "your_email@gmail.com") {
      console.warn("Email service is not configured. Please set EMAIL_USER and EMAIL_PASS in your .env file.");
      return;
    }

    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Khôi phục mật khẩu - CinemaHub</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #121214;
              color: #e4e4e7;
              margin: 0;
              padding: 0;
            }
            .email-wrapper {
              max-width: 600px;
              margin: 30px auto;
              background: #1e1e24;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0,0,0,0.5);
              border: 1px solid #2e2e38;
            }
            .header {
              background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%);
              padding: 30px 20px;
              text-align: center;
              border-bottom: 1px solid #2e2e38;
            }
            .logo {
              color: #ffffff;
              font-size: 24px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin: 0;
            }
            .logo span {
              color: #ff3b30;
            }
            .content {
              padding: 30px;
            }
            .title {
              font-size: 20px;
              color: #ffffff;
              margin-top: 0;
              margin-bottom: 10px;
              text-align: center;
              font-weight: 700;
            }
            .subtitle {
              color: #9ca3af;
              font-size: 14px;
              margin-bottom: 30px;
              text-align: center;
            }
            .otp-box {
              font-size: 32px;
              font-weight: 800;
              letter-spacing: 6px;
              color: #ffb400;
              background: #18181c;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
              margin: 20px 0;
              border: 1px dashed #4b5563;
            }
            .footer {
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              background: #18181c;
              border-top: 1px solid #2e2e38;
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <h1 class="logo">Cinema<span>Hub</span></h1>
            </div>
            <div class="content">
              <h2 class="title">Yêu Cầu Khôi Phục Mật Khẩu</h2>
              <p class="subtitle">Chào ${userName || "khách hàng"}, bạn đã gửi yêu cầu khôi phục mật khẩu tài khoản tại CinemaHub. Dưới đây là mã OTP xác thực của bạn:</p>
              
              <div class="otp-box">${otp}</div>
              
              <p style="font-size: 13px; color: #9ca3af; text-align: center;">Mã OTP này có hiệu lực trong vòng 10 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
              <p style="font-size: 13px; color: #9ca3af; text-align: center;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
            </div>
            <div class="footer">
              Đây là email tự động từ hệ thống CinemaHub. Vui lòng không trả lời email này.<br>
              &copy; 2026 CinemaHub. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `;

      await this.transporter.sendMail({
        from: `"CinemaHub" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `[CinemaHub] Mã OTP khôi phục mật khẩu của bạn`,
        html: htmlContent,
      });

      console.log(`[EmailService] Đã gửi mã OTP khôi phục mật khẩu tới: ${userEmail}`);
    } catch (error) {
      console.error("[EmailService] Lỗi khi gửi email OTP:", error.message);
    }
  }

  async sendBookingCancelledEmail(userEmail, user, booking) {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === "your_email@gmail.com") {
      console.warn("Email service is not configured. Please set EMAIL_USER and EMAIL_PASS in your .env file.");
      return;
    }

    try {
      const movieTitle = booking.showtime?.movie?.title || "Phim chưa cập nhật";
      const cinemaName = booking.showtime?.cinema?.name || "Rạp chưa cập nhật";
      const roomName = booking.showtime?.room?.name || "N/A";
      const showDate = booking.showtime?.date
        ? new Date(booking.showtime.date).toLocaleDateString("vi-VN")
        : "N/A";
      const showTime = booking.showtime?.startTime || "N/A";
      const seatsStr = booking.tickets?.map((t) => t.seatNumber).join(", ") || "N/A";
      const totalVal = booking.totalAmount
        ? booking.totalAmount.toLocaleString("vi-VN") + " VNĐ"
        : "0 VNĐ";
      const bookingId = booking._id || booking.id;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Xác nhận hủy vé thành công - CinemaHub</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #121214;
              color: #e4e4e7;
              margin: 0;
              padding: 0;
            }
            .email-wrapper {
              max-width: 600px;
              margin: 30px auto;
              background: #1e1e24;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0,0,0,0.5);
              border: 1px solid #2e2e38;
            }
            .header {
              background: linear-gradient(135deg, #4c0519 0%, #1e1b4b 100%);
              padding: 30px 20px;
              text-align: center;
              border-bottom: 1px solid #2e2e38;
            }
            .logo {
              color: #ffffff;
              font-size: 24px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin: 0;
            }
            .logo span {
              color: #ff3b30;
            }
            .content {
              padding: 30px;
            }
            .title {
              font-size: 20px;
              color: #fca5a5;
              margin-top: 0;
              margin-bottom: 10px;
              text-align: center;
              font-weight: 700;
            }
            .subtitle {
              color: #9ca3af;
              font-size: 14px;
              margin-bottom: 30px;
              text-align: center;
            }
            .ticket-card {
              border: 1px dashed #f43f5e;
              border-radius: 12px;
              padding: 20px;
              background: #1c1917;
              margin-bottom: 25px;
            }
            .movie-title {
              font-size: 18px;
              color: #fca5a5;
              font-weight: bold;
              margin-bottom: 15px;
              border-bottom: 1px solid #2e2e38;
              padding-bottom: 10px;
            }
            .grid {
              display: table;
              width: 100%;
            }
            .grid-row {
              display: table-row;
            }
            .grid-cell {
              display: table-cell;
              padding: 8px 0;
              font-size: 14px;
            }
            .label {
              color: #9ca3af;
              font-weight: 500;
            }
            .value {
              color: #ffffff;
              font-weight: bold;
              text-align: right;
            }
            .footer {
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              background: #18181c;
              border-top: 1px solid #2e2e38;
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <h1 class="logo">Cinema<span>Hub</span></h1>
            </div>
            <div class="content">
              <h2 class="title">Xác Nhận Hủy Vé Thành Công</h2>
              <p class="subtitle">Chào ${user.name || "khách hàng"}, yêu cầu hủy đơn đặt vé của bạn tại CinemaHub đã được xử lý thành công. Dưới đây là thông tin đơn đặt vé đã bị hủy:</p>
              
              <div class="ticket-card">
                <div class="movie-title">${movieTitle} (ĐÃ HỦY)</div>
                <div class="grid">
                  <div class="grid-row">
                    <div class="grid-cell label">Rạp:</div>
                    <div class="grid-cell value">${cinemaName}</div>
                  </div>
                  <div class="grid-row">
                    <div class="grid-cell label">Phòng chiếu:</div>
                    <div class="grid-cell value">${roomName}</div>
                  </div>
                  <div class="grid-row">
                    <div class="grid-cell label">Ngày chiếu:</div>
                    <div class="grid-cell value">${showDate}</div>
                  </div>
                  <div class="grid-row">
                    <div class="grid-cell label">Suất chiếu:</div>
                    <div class="grid-cell value">${showTime}</div>
                  </div>
                  <div class="grid-row">
                    <div class="grid-cell label">Danh sách ghế giải phóng:</div>
                    <div class="grid-cell value" style="color: #f43f5e;">${seatsStr}</div>
                  </div>
                  <div class="grid-row">
                    <div class="grid-cell label">Tổng tiền hoàn/đã hủy:</div>
                    <div class="grid-cell value" style="color: #9ca3af; text-decoration: line-through;">${totalVal}</div>
                  </div>
                  <div class="grid-row">
                    <div class="grid-cell label">Trạng thái hiện tại:</div>
                    <div class="grid-cell value" style="color: #f43f5e; font-weight: bold;">Đã hủy</div>
                  </div>
                </div>
              </div>
              
              <p style="font-size: 13px; color: #9ca3af; text-align: center;">Mã QR của vé cũ ${bookingId.toString().toUpperCase()} hiện đã bị vô hiệu hóa hoàn toàn.</p>
            </div>
            <div class="footer">
              Đây là email tự động từ hệ thống CinemaHub. Vui lòng không trả lời email này.<br>
              &copy; 2026 CinemaHub. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `;

      await this.transporter.sendMail({
        from: `"CinemaHub" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `[CinemaHub] Thông báo hủy vé thành công: ${movieTitle}`,
        html: htmlContent,
      });

      console.log(`[EmailService] Đã gửi email xác nhận hủy vé tới: ${userEmail}`);
    } catch (error) {
      console.error("[EmailService] Lỗi khi gửi email hủy vé:", error.message);
    }
  }
}

module.exports = new EmailService();
