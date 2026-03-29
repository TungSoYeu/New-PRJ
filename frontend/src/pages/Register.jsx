import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

export default function Register() {
  const { showToast } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
     fullname: '',
     email: '',
     password: '',
     password_confirmation: ''
  });

  const handleChange = e => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
        return showToast('Mật khẩu xác nhận không khớp', 'error');
    }
    try {
      const res = await axios.post('/api/auth/register', formData);
      if (res.data.success) {
        showToast('Đăng ký thành công! Hãy đăng nhập.', 'success');
        navigate('/login');
      } else {
        showToast(res.data.message, 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Lỗi đăng ký', 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="glass-card w-full max-w-md p-8 md:p-10">
        <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Đăng Ký Tài Khoản</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Họ Vật Tên</label>
            <input name="fullname" type="text" required onChange={handleChange} className="glass-input w-full p-3" placeholder="Nhập tên..." />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Email</label>
            <input name="email" type="email" required onChange={handleChange} className="glass-input w-full p-3" placeholder="user@gmail.com" />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Mật khẩu</label>
            <input name="password" type="password" required onChange={handleChange} className="glass-input w-full p-3" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Xác nhận Mật khẩu</label>
            <input name="password_confirmation" type="password" required onChange={handleChange} className="glass-input w-full p-3" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-primary py-3 rounded-full mt-4 text-lg">Đăng Ký</button>
        </form>
        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          Đã có tài khoản? <a href="/login" className="text-primary font-bold hover:underline">Đăng nhập ngay</a>
        </p>
      </div>
    </div>
  );
}
