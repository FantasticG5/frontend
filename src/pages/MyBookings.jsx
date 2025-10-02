// src/pages/MyBookings.jsx
import React, { useEffect, useState } from "react";
import Toast from "../components/Toast";
import { getMyBookings, cancelBooking } from "../services/bookingService";
import { getAllClasses } from "../services/eventService";
import { getMe } from "../services/identityService";

export default function MyBookings() {
  const [me, setMe] = useState(null);
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  // UI från development-grenen
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // Kräver auth-cookie; om 401 -> fånga i catch
        const meRes = await getMe();
        setMe(meRes);

        const [bookings, classes] = await Promise.all([
          getMyBookings().catch(() => []),
          getAllClasses().catch(() => []),
        ]);

        const classMap = new Map(
          (classes || []).map((c) => [
            c.id ?? c.Id,
            {
              id: c.id ?? c.Id,
              title: c.title ?? c.Title,
              startTime: c.startTime ?? c.StartTime,
              location: c.location ?? c.Location,
              instructor: c.instructor ?? c.Instructor,
            },
          ])
        );

        const combined = (bookings || [])
          .map((b) => {
            const cls = classMap.get(b.classId ?? b.ClassId);
            return {
              id: b.id ?? b.Id, // bookingId
              classId: b.classId ?? b.ClassId,
              title: cls?.title ?? "(okänd klass)",
              date: cls?.startTime ?? null,
              location: cls?.location ?? "",
              instructor: cls?.instructor ?? "",
            };
          });

        setItems(combined);
      } catch (e) {
        // Troligen 401 från /me
        setToast({
          message: e.message || "Kunde inte hämta bokningar (är du inloggad?).",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // --- Avbokningsflöde med bekräftelse ---
  function handleCancelClick(booking) {
    setBookingToCancel(booking);
    setShowConfirmDialog(true);
  }

  function handleCancelDialog() {
    setShowConfirmDialog(false);
    setBookingToCancel(null);
  }

  async function handleConfirmCancel() {
    if (bookingToCancel) {
      await performCancel(bookingToCancel);
    }
    setShowConfirmDialog(false);
    setBookingToCancel(null);
  }

  async function performCancel(b) {
    try {
      if (!me) throw new Error("Inte inloggad.");
      setBusyId(b.id);

      // Din backend kräver { classId, userId, email }
      await cancelBooking({ classId: b.classId, userId: me.id, email: me.email });

      // Optimistisk uppdatering
      setItems((prev) => prev.filter((x) => x.id !== b.id));
      setToast({ message: "Avbokning genomförd!", type: "success" });
    } catch (err) {
      setToast({
        message: err.message || "Något gick fel vid avbokning.",
        type: "error",
      });
    } finally {
      setBusyId(null);
    }
  }

  // --- Render ---
  if (loading) return <div className="my-bookings-container"><p>Laddar bokningar…</p></div>;
  if (!me) return <div className="my-bookings-container"><p>Du är inte inloggad. <a href="/login">Logga in</a></p></div>;
  if (items.length === 0) return <div className="my-bookings-container"><p>Du har inga kommande bokningar.</p></div>;

  return (
    <div className="container">
      <h1>Mina bokningar</h1>

      <div className="booking-list">
        {items.map((b) => (
          <div key={b.id} className="booking-card">
            <div className="booking-info">
              <h3>{b.title}</h3>
              <p>{b.location} • {b.instructor}</p>
              <p>{b.date ? new Date(b.date).toLocaleString() : "Okänt datum"}</p>
            </div>
            <div className="booking-actions">
              <button
                className="btn-cancel"
                onClick={() => handleCancelClick(b)}
                disabled={busyId === b.id}
              >
                {busyId === b.id ? "Avbokar..." : "Avboka"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showConfirmDialog && (
        <div className="modal-overlay" onClick={handleCancelDialog}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Bekräfta avbokning</h3>
            <p>
              Är du säker på att du vill avboka <strong>{bookingToCancel?.title}</strong>?
            </p>
            <p className="warning-text">
              Genom att avboka frigör du platsen för andra medlemmar.
            </p>
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
