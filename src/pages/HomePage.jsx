import React, { useState } from "react";
import BookingButton from "../components/BookingButton";
import BookingForm from "../components/BookingForm";
import homeImg from "../components/img/homeimg.jpg"
import gymClass from "../components/img/gymclass.jpg"

export default function HomePage () {
  const [isOpen, setIsOpen] = useState(false);
    
  return (
    <div className="home-container">
      <div className="hero">
        <img src={homeImg} alt="Gym" className="hero-image" />
        <div className="hero-overlay"></div>
        <div className="hero-text">
          <h1>Välkommen till Core Gym Club</h1>
          <p>Träna hårt. Känn styrkan.</p>
        </div>
      </div>

      

      <div className="membership-section">
        <h2>Våra medlemskap</h2>
        <div className="membership-cards">
          <div className="membership-card">
            <h3>Basic</h3>
            <p>Träna under bemannade tider</p>
            <p className="price">299 kr/mån</p>
          </div>
          <div className="membership-card">
            <h3>Premium</h3>
            <p>Dygnet runt tillgång + gruppass</p>
            <p className="price">499 kr/mån</p>
          </div>
          <div className="membership-card">
            <h3>VIP</h3>
            <p>Allt i Premium + PT timmar</p>
            <p className="price">799 kr/mån</p>
          </div>
        </div>
      </div>

      <div className="campaign-banner">
        <img src={gymClass} alt="Gym Class" className="banner-img" />
        <div className="banner-text">
          <h2>🔥 Höstkampanj! 🔥</h2>
          <p>Bli medlem idag och få 50% rabatt på första månaden!</p>
        </div>
      </div>

      <div className="contact-section">
        <h2>Kontakta oss</h2>
        <p><strong>Adress:</strong> Gymvägen 1, 123 45 Staden</p>
        <p><strong>Telefon:</strong> 012-345 678</p>
        <p><strong>Email:</strong> info@coregym.se</p>
        <p><strong>Öppettider:</strong> Mån–Sön: 05:00–23:00</p>
      </div>

    </div>
  )
}