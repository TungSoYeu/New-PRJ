import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Header() {
  const { user, cartCount, brands } = useContext(AppContext);

  return (
    <nav className="glass-header sticky top-0 z-50 h-[60px] flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-8">
        <Link to="/" className="no-underline">
          <h3 className="gradient-text font-extrabold text-2xl tracking-wide uppercase m-0 p-0 transform transition-transform hover:scale-105">SHOP_PTT</h3>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-900 dark:text-white font-bold hover:text-primary transition-colors no-underline drop-shadow-sm">Tất cả</Link>
          {brands.map((b) => (
             <Link key={b} to={`/brand/${b}`} className="text-gray-900 dark:text-white font-bold hover:text-primary transition-colors no-underline drop-shadow-sm">
                 {b}
             </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/profile" className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-primary no-underline font-bold drop-shadow-sm">
               <span>👤 {user.TenKH || user.Email}</span>
            </Link>
            <Link to="/profile?tab=cart" className="relative flex items-center text-gray-900 dark:text-white hover:text-primary no-underline drop-shadow-sm">
               <span className="text-xl">🛒</span>
               {cartCount > 0 && (
                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                   {cartCount}
                 </span>
               )}
            </Link>
          </>
        ) : (
          <>
            <Link to="/register" className="text-gray-900 dark:text-white font-bold hover:text-primary no-underline drop-shadow-sm">Đăng Ký</Link>
            <span className="text-gray-400">|</span>
            <Link to="/login" className="text-gray-900 dark:text-white font-bold hover:text-primary no-underline drop-shadow-sm">Đăng Nhập</Link>
          </>
        )}
      </div>
    </nav>
  );
}
