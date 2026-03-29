import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function ToastContainer() {
  const { toasts } = useContext(AppContext);

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-3">
      {toasts.map(t => (
        <div key={t.id} className={`toast-animate-in glass-card px-6 py-4 flex items-center gap-3 border-l-4 ${t.type === 'success' ? 'border-l-green-500' : 'border-l-red-500'} font-medium`}>
          {t.type === 'success' ? (
            <span className="text-green-500 text-xl">✓</span>
          ) : (
            <span className="text-red-500 text-xl">!</span>
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
