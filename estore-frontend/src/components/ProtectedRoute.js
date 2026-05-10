import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // إذا لم يكن مستخدماً أو لم تكن رتبته ADMIN، يتم توجيهه لصفحة المنتجات
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/products" replace />;
  }

  return children;
};

export default ProtectedRoute;