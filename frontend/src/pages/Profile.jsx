import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

export default function Profile() {
  const { user, showToast, fetchCartCount, logout } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('info'); // info, cart, orders
  
  // Info Form
  const [profile, setProfile] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Sync URL tabs
    const params = new URLSearchParams(window.location.search);
    if(params.get('tab')) setActiveTab(params.get('tab'));
  }, []);

  useEffect(() => {
    if (!user) return;
    if (activeTab === 'info') fetchProfile();
    else if (activeTab === 'cart') fetchCart();
    else if (activeTab === 'orders') fetchOrders();
  }, [activeTab, user]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/user');
      if (res.data.success) setProfile(res.data.user || {});
    } catch {}
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart');
      if (res.data.success) setCartItems(res.data.data);
    } catch {}
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/user/orders');
      if (res.data.success) setOrders(res.data.data);
    } catch {}
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/user', profile);
      showToast(res.data.message, res.data.success ? 'success' : 'error');
    } catch (err) {
      showToast('Lỗi cập nhật', 'error');
    }
  };

  const handleRemoveFromCart = async (productId) => {
    if(!window.confirm('Xóa sản phẩm này khỏi giỏ hàng?')) return;
    try {
      const res = await axios.post('/api/cart/remove', { productId });
      if (res.data.success) {
        showToast('Đã xóa', 'success');
        fetchCart();
        fetchCartCount();
      }
    } catch {}
  };

  const handleCheckout = async () => {
    if(!window.confirm('Tiến hành đặt mua tất cả sản phẩm trong giỏ?')) return;
    try {
      const res = await axios.post('/api/cart/checkout');
      if (res.data.success) {
        showToast(res.data.message, 'success');
        fetchCartCount();
        setActiveTab('orders'); // Nhảy sang trang đơn hàng
      } else {
        showToast(res.data.message, 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Lỗi thanh toán', 'error');
    }
  };

  if (!user) {
    return <div className="text-center py-20 text-xl font-bold">Vui lòng đăng nhập!</div>;
  }

  const cartTotal = cartItems.reduce((acc, curr) => acc + (curr.GiaBan * curr.SoLuong), 0);

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8 min-h-[70vh]">
      {/* Sidebar Navigation */}
      <div className="md:w-1/4">
        <div className="glass-card p-4 flex flex-col gap-2">
          <div className="text-center pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
             <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl">
               👤
             </div>
             <h3 className="font-bold text-xl">{user.TenKH || 'Người dùng'}</h3>
             <p className="text-sm text-gray-500">Số dư: <span className="text-primary font-bold">{user.SoDu} Triệu</span></p>
          </div>
          
          <button onClick={() => setActiveTab('info')} className={`text-left px-4 py-3 rounded-xl transition-colors font-medium ${activeTab==='info' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>👤 Thông tin</button>
          <button onClick={() => setActiveTab('cart')} className={`text-left px-4 py-3 rounded-xl transition-colors font-medium flex justify-between ${activeTab==='cart' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            🛒 Giỏ hàng {cartItems.length > 0 && <span className="bg-red-500 text-white px-2 rounded-full text-sm">{cartItems.length}</span>}
          </button>
          <button onClick={() => setActiveTab('orders')} className={`text-left px-4 py-3 rounded-xl transition-colors font-medium flex justify-between ${activeTab==='orders' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            📦 Đơn hàng đã mua {orders.length > 0 && <span className="bg-green-500 text-white px-2 rounded-full text-sm">{orders.length}</span>}
          </button>
          
          <button onClick={logout} className="text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 font-bold transition-colors mt-auto">➜ Đăng Xuất</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:w-3/4">
        {activeTab === 'info' && (
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6 border-b pb-4 border-gray-100 dark:border-gray-700">Thông Tin Cá Nhân</h2>
            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Họ Vật Tên</label>
                <input required type="text" className="glass-input w-full p-2.5" value={profile.hovaten || ''} onChange={e => setProfile({...profile, hovaten: e.target.value})} />
              </div>
              <div>
                 <label className="block text-sm font-semibold mb-2">Email</label>
                 <input required type="email" className="glass-input w-full p-2.5 bg-gray-50 dark:bg-gray-900 opacity-70" disabled value={profile.email || user.Email || ''} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Số Điện Thoại</label>
                <input type="text" className="glass-input w-full p-2.5" value={profile.sodienthoai || ''} onChange={e => setProfile({...profile, sodienthoai: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Sinh Nhật (YYYY-MM-DD)</label>
                <input type="text" placeholder="2000-01-01" className="glass-input w-full p-2.5" value={profile.sinhnhat ? profile.sinhnhat.substring(0,10) : ''} onChange={e => setProfile({...profile, sinhnhat: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-sm font-semibold mb-2">Địa Chỉ Nhận Hàng</label>
                 <input type="text" className="glass-input w-full p-2.5" value={profile.diachi || ''} onChange={e => setProfile({...profile, diachi: e.target.value})} />
              </div>
              <div className="md:col-span-2 mt-4">
                 <button type="submit" className="btn-primary px-8 py-3 rounded-full text-sm">Cập Nhật Hồ Sơ</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="glass-card p-8">
             <h2 className="text-2xl font-bold mb-6 border-b pb-4 border-gray-100 dark:border-gray-700">Giỏ Hàng Của Bạn</h2>
             {cartItems.length === 0 ? (
               <p className="text-gray-500 italic">Giỏ hàng đang trống.</p>
             ) : (
               <div className="flex flex-col gap-4">
                 {cartItems.map(item => (
                   <div key={item.SanPhamID} className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <img src={item.Anh} className="w-24 h-24 object-contain rounded bg-white" />
                      <div className="flex-grow text-center sm:text-left">
                        <h4 className="font-bold text-lg mb-1">{item.TenSP}</h4>
                        <p className="text-gray-500 text-sm">{item.MoTaSP}</p>
                        <p className="text-primary font-bold mt-2">Giá: {item.GiaBan} Triệu <span className="text-gray-400 font-normal">x {item.SoLuong}</span></p>
                      </div>
                      <button onClick={() => handleRemoveFromCart(item.SanPhamID)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-md">
                         Xóa
                      </button>
                   </div>
                 ))}
                 
                 <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/20 dark:bg-black/20 p-6 rounded-2xl ring-1 ring-gray-900/5 shadow-sm">
                    <div className="text-xl">Tổng thanh toán: <span className="text-2xl font-extrabold text-primary ml-2">{cartTotal.toFixed(2)} Triệu</span></div>
                    <button onClick={handleCheckout} className="btn-primary text-white font-extrabold text-lg py-3 px-10 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                       CHỐT ĐƠN NGAY
                    </button>
                 </div>
               </div>
             )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="glass-card p-8">
             <h2 className="text-2xl font-bold mb-6 border-b pb-4 border-gray-100 dark:border-gray-700">Lịch Sử Mua Hàng</h2>
             {orders.length === 0 ? (
               <p className="text-gray-500 italic">Hiện không có đơn hàng nào.</p>
             ) : (
               <div className="flex flex-col gap-4">
                 {orders.map(order => (
                   <div key={order.MaDonHang} className="bg-gray-50/50 dark:bg-gray-800/50 border border-green-500/20 p-5 rounded-xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500 to-emerald-400 text-white px-8 py-1 font-bold text-sm transform translate-x-[25px] translate-y-[15px] rotate-45 shadow-md">Đã Đặt</div>
                      <img src={order.Anh} className="w-20 h-20 object-contain rounded bg-white p-1" />
                      <div className="flex-grow">
                         <h4 className="font-bold text-lg">{order.TenSP}</h4>
                         <p className="text-gray-500">Mã đơn: #{order.MaDonHang} | Số lượng: {order.SoLuong}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-sm text-gray-400 mb-1">Thành tiền</p>
                         <p className="font-bold text-green-500 text-xl">{(parseFloat(order.GiaMua) * order.SoLuong).toFixed(2)} Tr</p>
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
}
