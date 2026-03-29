import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [listsRes, saleRes] = await Promise.all([
          axios.get('/api/products/lists'),
          axios.get('/api/products/sale')
        ]);
        
        if (listsRes.data.success) setAllProducts(listsRes.data.data);
        if (saleRes.data.success) setSaleProducts(saleRes.data.data);
      } catch (err) {
        console.error('Lỗi tải dữ liệu Landing Page', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const scrollToAll = () => {
    const el = document.getElementById('all-products-section');
    if(el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
     return <div className="text-center py-24 text-xl font-bold animate-pulse text-primary">Khởi động hệ thống...</div>;
  }

  return (
    <div className="w-full">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative w-full h-[600px] flex items-center overflow-hidden">
         {/* Background Effect */}
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black z-0"></div>
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?ixlib=rb-4.0.3')] bg-cover bg-center opacity-40 mix-blend-overlay z-10"></div>
         {/* Dark overlay để tách biệt chữ */}
         <div className="absolute inset-0 bg-black/40 z-10"></div>
         <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-[128px] opacity-60 z-10"></div>
         
         <div className="container mx-auto px-4 z-20 flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-primary font-bold tracking-widest uppercase mb-4 text-sm md:text-base animate-slideDown drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Thế Giới Công Nghệ Đỉnh Cao</span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] w-full md:w-2/3">
               Cú Chạm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-400 drop-shadow-[0_4px_8px_rgba(255,100,100,0.5)]">Tương Lai</span> Dành Riêng Cho Bạn
            </h1>
            <p className="text-white text-lg md:text-xl md:w-1/2 mb-10 leading-relaxed font-medium drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
               Sở hữu ngay các siêu phẩm Smartphone hiện đại nhất với mức giá và chính sách ưu đãi không thể nào tuyệt vời hơn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={scrollToAll} className="btn-primary px-8 py-4 rounded-full text-lg shadow-[0_10px_20px_rgba(248,63,95,0.4)] transform transition hover:-translate-y-1">Khám Phá Ngay</button>
                <a href="#sale-products" className="glass-card !bg-white/10 !border-white/20 text-white px-8 py-4 rounded-full text-lg hover:!bg-white/20 font-bold transition flex items-center justify-center gap-2 drop-shadow-lg backdrop-blur-md">🔥 Flash Sale</a>
            </div>
         </div>
      </section>

      {/* 2. HOT DEALS SECTION */}
      {saleProducts.length > 0 && (
          <section id="sale-products" className="container mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 border-l-8 border-primary pl-6">
                <div>
                   <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">Top Sản Phẩm Giá Tốt Nhất</h2>
                   <p className="text-gray-500 mt-2">Đang được trợ giá tại SHOW_PTT. Hãy bỏ vào giỏ hàng ngay!</p>
                </div>
                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-6 py-2 rounded-full font-bold flex items-center gap-2 mt-4 md:mt-0 animate-pulse border border-red-200 dark:border-red-800">
                    MUA NHANH KẺO LỠ
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {saleProducts.map(p => <ProductCard key={p.ID} item={p} />)}
            </div>
          </section>
      )}

      {/* 3. ALL PRODUCTS SECTION */}
      <section id="all-products-section" className="bg-gray-50 dark:bg-[#121212] py-16 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4">
             <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-4xl font-extrabold gradient-text uppercase tracking-wider mb-4">Tất cả Bộ sưu tập</h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
                <p className="text-gray-600 dark:text-gray-400">Danh mục đầy đủ mọi dòng máy từ các hãng công nghệ danh tiếng trên thế giới được chọn lọc khắt khe nhất.</p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {allProducts.map(p => <ProductCard key={p.ID} item={p} />)}
             </div>
          </div>
      </section>

      {/* NEWSLETTER BANNER */}
      <section className="container mx-auto px-4 py-16">
          <div className="glass-card bg-gradient-to-r from-primary to-secondary p-10 md:p-16 rounded-3xl text-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             <div className="relative z-10">
                 <h2 className="text-3xl md:text-5xl font-black mb-4">Đăng ký Email Nhận Lịch Sale</h2>
                 <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Cam kết không spam. Chỉ gửi mã giảm giá siêu chớp nhoáng hàng tuần trực tiếp đến hòm thư của bạn.</p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                    <input type="email" placeholder="Địa chỉ thư điện tử..." className="px-6 py-4 rounded-full flex-grow text-gray-900 border-none outline-none font-bold" />
                    <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition">Tham Gia</button>
                 </div>
             </div>
          </div>
      </section>
    </div>
  );
}
