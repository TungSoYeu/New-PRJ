import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function ProductCard({ item }) {
  const { addToCart } = useContext(AppContext);

  return (
    <div className="glass-card flex flex-col items-center p-4 relative overflow-hidden group">
      {item.GiaSale && item.GiaSale > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
            {item.GiaSale}% Giảm
          </div>
      )}
      <div className="w-full h-48 flex justify-center items-center overflow-hidden mb-4">
        <img 
          src={item.Anh} 
          alt={item.TenSP} 
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <h3 className="text-lg font-semibold text-center mb-2">{item.TenSP}</h3>
      <div className="flex flex-col items-center gap-1 mb-4">
        {item.GiaSale > 0 ? (
          <>
            <p className="text-gray-400 line-through text-sm">{item.GiaGoc} Triệu</p>
            <p className="text-primary font-bold text-xl">{item.GiaBan} Triệu</p>
          </>
        ) : (
          <p className="text-primary font-bold text-xl">{item.GiaBan || item.GiaGoc} Triệu</p>
        )}
      </div>
      <button 
        onClick={() => addToCart(item.ID)}
        className="btn-primary w-full py-2.5 rounded-b-xl rounded-t-sm absolute bottom-0 left-0 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
      >
        THÊM VÀO GIỎ
      </button>
    </div>
  );
}
