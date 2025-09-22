import React from "react";
import BookingButton from "../components/BookingButton";
import BookingForm from "../components/BookingForm";

export default function HomePage () {
    
  return (
    <div className="container">
        <h1>Välkommen till Core Gym Club</h1>
        <p>Här kan du boka pass, se schema och hantera din profil</p>

        {/* Lägger den här tillfälligt tills man kan lägga den på korten */}
        <BookingButton buttonText="Boka nu" />

        <BookingForm /> 
    </div>
  )
}