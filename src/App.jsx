import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MyBookings from "./pages/MyBookings";
import "./styles.css";
import Sessions from "./pages/Sessions";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
  );
}
