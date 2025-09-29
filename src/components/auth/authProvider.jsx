import React, { createContext, useContext, useState } from "react";
import { setToken as saveToken, clearToken, getToken, isAuthenticated } from "../../../auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());

  const login = async (email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Fel vid inloggning");
    const data = await res.json();
    // saveToken(data.token);
    setToken(data.token);
  };

  const logout = () => {
    // clearToken();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: isAuthenticated(), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}