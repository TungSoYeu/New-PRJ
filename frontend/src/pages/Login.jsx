import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Login() {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="glass-card w-full max-w-md p-8 md:p-10">
        <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Đăng Nhập</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full p-3"
              placeholder="Nhập email của bạn..." 
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Mật khẩu</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full p-3"
              placeholder="••••••••" 
            />
          </div>
          <button type="submit" className="btn-primary py-3 rounded-full mt-4 text-lg">Đăng Nhập</button>
        </form>
        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          Chưa có tài khoản? <a href="/register" className="text-primary font-bold hover:underline">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  );
}
