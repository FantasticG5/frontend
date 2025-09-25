import React, { useState } from "react";
import BookingButton from "../components/BookingButton";
import BookingForm from "../components/BookingForm";

export default function HomePage () {
  const [isOpen, setIsOpen] = useState(false);
    
  return (
    <div className="container">
        <h1>Välkommen till Core Gym Club</h1>
        <p>Här kan du boka pass, se schema och hantera din profil</p>

        {/* Lägger den här tillfälligt tills man kan lägga den på korten */}
        {/* <BookingButton buttonText="Boka nu" onClick={() => setIsOpen(true)} />

        {isOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={() => setIsOpen(false)}>X</button>
              <BookingForm />
            </div>
          </div>
        )} */}
        
    </div>
  )
}