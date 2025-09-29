import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MyBookings from "./pages/MyBookings";
import "./styles.css";
import Sessions from "./pages/Sessions";
import RegisterForm from "./components/RegisterForm";
import CookieSettings from "./pages/CookieSettings";
import AboutCookies from "./pages/AboutCookies";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import CookieBanner from "./components/CookieBanner";
import { useAnalytics } from "./hooks/useAnalytics";

export default function App() {
  // Ladda analytics baserat på samtycke
  useAnalytics();

  return (
      <Router>
        <Navbar />
               <Routes>
                 <Route path="/" element={<HomePage />} />
                 <Route path="/bookings" element={<MyBookings />} />
                 <Route path="/sessions" element={<Sessions />} />
                 <Route path="/login" element={<LoginPage />} />
                 <Route path="/register" element={<RegisterForm />} />
                 <Route path="/cookie-settings" element={<CookieSettings />} />
                 <Route path="/about-cookies" element={<AboutCookies />} />
               </Routes>
        <CookieBanner />
      </Router>
  );
}
