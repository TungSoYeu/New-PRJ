import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import ToastContainer from './components/ToastContainer';
import Home from './pages/Home';
import Brand from './pages/Brand';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/brand/:brandName" element={<Brand />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          {/* Footer Component Simple */}
          <footer className="mt-auto py-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500">
            Trang web Cửa hàng điện thoại - Chạy bằng ReactJS & TailwindCSS 
          </footer>
        </div>
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
