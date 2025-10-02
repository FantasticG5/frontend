// src/components/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authProvider";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Laddar auth…</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
