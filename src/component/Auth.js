import React from 'react';
import { Navigate } from 'react-router-dom';


export default function RequireAuth({ children, allowedStatuts }) {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedStatuts && !allowedStatuts.includes(user.statut)) {
    return <Navigate to="/" replace />;
  }

  return children;
}