// src/pages/MyBookings.jsx
import React, { useState } from "react";
import Toast from "../components/Toast";
import { cancelBooking } from "../services/bookingService";

export default function MyBookings() {
  // TODO: Byt till att hämta riktiga bokningar från API
  const [bookings, setBookings] = useState([
    {
      id: 16,                 // bookingId (valfritt att visa)
      classId: 1,            // behövs för cancel
      userId: 444,           // behövs för cancel
      title: "TESTA",
      date: "2025-09-18 18:00",
      email: "pavado@pm.me", // skickas till backend
      memberName: "Stefan"
    }
  ]);

  const [toast, setToast] = useState({ message: "", type: "success" });
  const [loadingId, setLoadingId] = useState(null);

  async function handleCancel(b) {
    try {
      setLoadingId(b.id);

      const res = await cancelBooking({
        classId: b.classId,
        userId: b.userId,
        email: b.email
      });

      // Ta bort raden (optimistiskt) eller gör en refetch efteråt
      setBookings(prev => prev.filter(x => x.id !== b.id));

      setToast({ message: res?.message || "Avbokning genomförd!", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "Något gick fel vid avbokning.", type: "error" });
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="container">
      <h1>Mina bokningar</h1>

      {bookings.length === 0 ? (
        <p>Du har inga kommande bokningar.</p>
      ) : (
        <div className="booking-card">
          <div>
            <h3>{bookings[0].title}</h3>
            <p>{bookings[0].date}</p>
          </div>
          <button
            className="btn-cancel"
            onClick={() => handleCancel(bookings[0])}
            disabled={loadingId === bookings[0].id}
          >
            {loadingId === bookings[0].id ? "Avbokar..." : "Avboka"}
          </button>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}
