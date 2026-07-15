import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axiosClient from "../services/axiosClient";
import "./FoodOrderPage.css";

const money = (value) => `${Number(value || 0).toLocaleString("vi-VN")} VNĐ`;
const fallbackFoodImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='240' viewBox='0 0 400 240'%3E%3Crect width='400' height='240' fill='%231b1b34'/%3E%3Ctext x='200' y='125' text-anchor='middle' fill='%2393c5fd' font-family='Arial' font-size='24'%3EFood %26 Drink%3C/text%3E%3C/svg%3E";

export default function FoodOrderPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axiosClient.get("/food-items/available")
      .then((res) => setFoods(res.data.data || []))
      .catch(() => alert("Không thể tải danh sách Food & Drink."))
      .finally(() => setLoading(false));
  }, []);

  const cartItems = useMemo(() => foods.filter((food) => cart[food._id] > 0), [foods, cart]);
  const total = useMemo(() => cartItems.reduce((sum, food) => sum + food.price * cart[food._id], 0), [cartItems, cart]);
  const changeQuantity = (id, amount) => setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] || 0) + amount) }));
  const paymentQrUrl = paymentMethod === "MOMO"
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`https://nhantien.momo.vn/0379198883/${total}`)}`
    : `https://img.vietqr.io/image/MB-0379198883-compact2.png?amount=${total}&addInfo=${encodeURIComponent("Thanh toan Food Drink CinemaHub")}&accountName=CinemaHub`;

  const submitOrder = async () => {
    if (!user) return navigate("/login");
    if (!cartItems.length) return alert("Vui lòng chọn ít nhất một món.");
    setSubmitting(true);
    try {
      await axiosClient.post("/food-orders", {
        items: cartItems.map((food) => ({ foodItem: food._id, quantity: cart[food._id] })),
        paymentMethod,
      });
      setCart({});
      alert("Đặt Food & Drink thành công. Vui lòng nhận món tại quầy.");
    } catch (error) {
      alert(error.response?.data?.message || "Không thể tạo đơn hàng.");
    } finally {
      setSubmitting(false);
    }
  };

  return <main className="food-order-page">
    <header className="food-order-header">
      <button className="food-back-button" onClick={() => navigate("/")}>← Trang chủ</button>
      <div><p>RẠP CINEMAHUB</p><h1>Food & Drink</h1></div>
      <button className="food-back-button" onClick={() => navigate("/profile")}>Tài khoản</button>
    </header>
    <section className="food-order-content">
      <div>
        <div className="food-order-intro"><h2>Chọn món yêu thích</h2><p>Đặt trước và nhận món nhanh tại quầy.</p></div>
        {loading ? <p>Đang tải thực đơn...</p> : foods.length === 0 ? <p>Hiện chưa có món nào phục vụ.</p> : <div className="food-menu-grid">
          {foods.map((food) => <article className="food-menu-card" key={food._id}>
            <img src={food.imageUrl || fallbackFoodImage} alt={food.name} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackFoodImage; }} />
            <div className="food-menu-body"><span className="food-type">{food.type}</span><h3>{food.name}</h3><p>{food.description || "Thưởng thức cùng bộ phim của bạn."}</p><strong>{money(food.price)}</strong>
              <div className="food-counter"><button onClick={() => changeQuantity(food._id, -1)} disabled={!cart[food._id]}>−</button><span>{cart[food._id] || 0}</span><button onClick={() => changeQuantity(food._id, 1)}>+</button></div>
            </div>
          </article>)}
        </div>}
      </div>
      <aside className="food-cart">
        <h2>Đơn hàng của bạn</h2>
        {cartItems.length ? <>{cartItems.map((food) => <div className="cart-line" key={food._id}><span>{food.name} <small>× {cart[food._id]}</small></span><strong>{money(food.price * cart[food._id])}</strong></div>)}
          <div className="food-total"><span>Tổng cộng</span><strong>{money(total)}</strong></div>
          <label>Thanh toán<select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}><option value="CASH">Tiền mặt tại quầy</option><option value="MOMO">MoMo</option><option value="VNPAY">VNPAY</option></select></label>
          {paymentMethod !== "CASH" && <div className="food-payment-qr"><p>{paymentMethod === "MOMO" ? "Quét mã MoMo để thanh toán" : "Quét mã VNPAY để thanh toán"}</p><img src={paymentQrUrl} alt={`Mã QR ${paymentMethod}`} /><small>Số tiền cần thanh toán: {money(total)}</small></div>}
          <button className="food-submit" onClick={submitOrder} disabled={submitting}>{submitting ? "Đang đặt..." : "Đặt Food & Drink"}</button>
        </> : <p className="cart-empty">Giỏ hàng đang trống.</p>}
      </aside>
    </section>
  </main>;
}
