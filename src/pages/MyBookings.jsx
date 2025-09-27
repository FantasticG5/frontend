// src/pages/MyBookings.jsx
import React, { useState } from "react";
import Toast from "../components/Toast";
import { cancelBooking } from "../services/bookingService";

export default function MyBookings() {
  // TODO: Byt till att hämta riktiga bokningar från API
  const [bookings, setBookings] = useState([
    { id: 1, title: "TESTA", date: "2025-09-18 18:00", memberEmail: "stefan@example.com", memberName: "Stefan" }
  ]);

  const [toast, setToast] = useState({ message: "", type: "success" });
  const [loadingId, setLoadingId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  function handleCancelClick(booking) {
    setBookingToCancel(booking);
    setShowConfirmDialog(true);
  }

  function handleConfirmCancel() {
    if (bookingToCancel) {
      performCancel(bookingToCancel);
    }
    setShowConfirmDialog(false);
    setBookingToCancel(null);
  }

  function handleCancelDialog() {
    setShowConfirmDialog(false);
    setBookingToCancel(null);
  }

  async function performCancel(b) {
    try {
      setLoadingId(b.id);

      const res = await cancelBooking({
        classId: b.classId,
        userId: b.userId,
        email: b.email
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
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>Inga kommande bokningar</h3>
          <p>Du har inga aktiva träningspass bokade just nu.</p>
        </div>
      ) : (
        <div className="booking-card">
          <div className="booking-info">
            <h3>{bookings[0].title}</h3>
            <div className="booking-details">
              <div className="detail-item">
                <span className="detail-label">📅 Datum & tid:</span>
                <span className="detail-value">{bookings[0].date}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">👨‍🏫 Instruktör:</span>
                <span className="detail-value">{bookings[0].instructor}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📍 Plats:</span>
                <span className="detail-value">{bookings[0].location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">⏱️ Längd:</span>
                <span className="detail-value">{bookings[0].duration}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">👥 Platser:</span>
                <span className="detail-value">{bookings[0].currentParticipants}/{bookings[0].maxParticipants}</span>
              </div>
            </div>
          </div>
          <div className="booking-actions">
            <button
              className="btn-cancel"
              onClick={() => handleCancelClick(bookings[0])}
              disabled={loadingId === bookings[0].id}
            >
              {loadingId === bookings[0].id ? "Avbokar..." : "Avboka"}
            </button>
          </div>
        </div>
      )}

      {showConfirmDialog && (
        <div className="modal-overlay" onClick={handleCancelDialog}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Bekräfta avbokning</h3>
            <p>Är du säker på att du vill avboka <strong>{bookingToCancel?.title}</strong>?</p>
            <p className="warning-text">⚠️ Genom att avboka frigör du platsen för andra medlemmar.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={handleCancelDialog}>
                Avbryt
              </button>
              <button className="btn-danger" onClick={handleConfirmCancel}>
                Ja, avboka
              </button>
            </div>
          </div>
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
