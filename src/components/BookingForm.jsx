import React from 'react'
import { useState } from 'react';
import Toast from './Toast';

const BookingForm = ({ session, onClose, onBooked}) => {
  
  const BOOKING_URL = "http://localhost:5142/api/booking";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const userId = 231; // tills vidare hårdkodat

  async function handleSubmit(e) {

    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);


    try {
      const res = await fetch(BOOKING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: session.id,
          userId: userId,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setSuccess(true);
      if (onBooked) onBooked();
      setToast({ message: "Bokning genomförd!", type: "success" });
    } catch (err) {
      setError(err.message);
      setToast({ message: "Något gick fel vid bokningen.", type: "error" });
    } finally {
      setLoading(false);
    }
  }
  
  return (

    <div className="booking-form-container">
      <h2>Boka pass "{session.title}"</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <p>
          Du kommer att boka plats på <strong>{session.title}</strong> med{" "}
          {session.instructor}.
        </p>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>Bokningen lyckades!</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Bokar..." : "Bekräfta bokning"}
        </button>
        <button type="button" onClick={onClose}>
          Avbryt
        </button>
      </form>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>    
  )
}

export default BookingForm

{/* <h1>Boka pass "HIIT 45"</h1> */}

{/* <form className='booking-form'>
  <label htmlFor="name" className='booking-label'>Namn:</label>
  <input type="text" id="name" name="name" required className='booking-input'/>

  <label htmlFor="email" className='booking-label'>E-post:</label>
  <input type="email" id="email" name="email" required className='booking-input'/>

  <label htmlFor="date" className='booking-label'>Datum:</label>
  <input type="date" id="date" name="date" required className='booking-input'/>

  <label htmlFor="time" className='booking-label'>Tid:</label>
  <input type="time" id="time" name="time" required className='booking-input'/>

  <button type="submit" className='booking-button'>Boka</button>
</form> */}






  

