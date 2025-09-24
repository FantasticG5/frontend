import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MyBookings from "./pages/MyBookings";
import "./styles.css";
import Sessions from "./pages/Sessions";

export default function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/sessions" element={<Sessions />} />
        </Routes>
      </Router>
  );
}
