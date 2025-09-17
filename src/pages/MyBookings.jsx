import React, { useState } from "react";
import Toast from "../components/Toast";
import { cancelBooking } from "../services/bookingService";

export default function MyBookings() {
  const [bookings, setBookings] = useState([
    { id: 1, title: "TESTA", date: "2025-09-18 18:00", memberEmail: "stefan@example.com", memberName: "Stefan" }
  ]);

  const [toast, setToast] = useState({ message: "", type: "success" });
  const [loadingId, setLoadingId] = useState(null);

  async function handleCancel(b) {
    try {
      setLoadingId(b.id);
      const res = await cancelBooking({
        bookingId: b.id,
        memberEmail: b.memberEmail,
        memberName: b.memberName,
      });

      setBookings([]);
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
