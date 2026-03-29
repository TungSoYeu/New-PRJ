import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    checkAuth();
    fetchBrands();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        fetchCartCount();
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await axios.get('/api/cart');
      if (res.data.success) {
        const count = res.data.data.reduce((acc, item) => acc + item.SoLuong, 0);
        setCartCount(count);
      }
    } catch {
      setCartCount(0);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get('/api/products/brands');
      if (res.data.success) {
        setBrands(res.data.data);
      }
    } catch {
      setBrands([]);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        fetchCartCount();
        showToast('Đăng nhập thành công', 'success');
        return true;
      }
      return false;
    } catch (err) {
      showToast(err.response?.data?.message || 'Lỗi server', 'error');
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      setCartCount(0);
      showToast('Đã đăng xuất', 'success');
    } catch {
      showToast('Lỗi khi đăng xuất', 'error');
    }
  };

  const addToCart = async (productId) => {
    try {
      const res = await axios.post('/api/cart/add', { productId });
      if (res.data.success) {
        showToast('Thêm vào giỏ hàng thành công', 'success');
        fetchCartCount();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Bạn cần đăng nhập', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      login, 
      logout, 
      checkAuth, 
      cartCount, 
      fetchCartCount, 
      addToCart, 
      toasts, 
      showToast,
      brands
    }}>
      {children}
    </AppContext.Provider>
  );
};
