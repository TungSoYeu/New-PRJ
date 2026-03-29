import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Brand() {
  const { brandName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/products/brand/${brandName}`);
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching brand products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [brandName]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-10 gradient-text uppercase tracking-wider">
        Điện Thoại {brandName}
      </h1>
      {loading ? (
        <p className="text-center text-gray-500 text-lg">Đang tải dữ liệu...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Chưa có sản phẩm nào thuộc hãng này.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(p => <ProductCard key={p.ID} item={p} />)}
        </div>
      )}
    </div>
  );
}
