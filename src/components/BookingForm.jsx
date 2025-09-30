// src/components/BookingForm.jsx
import React, { useEffect, useState } from "react";
import Toast from "./Toast";
import { getMe } from "../services/identityService";
import { createBooking } from "../services/bookingService";

export default function BookingForm({ session, onClose, onBooked }) {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingMe, setFetchingMe] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success" });

  useEffect(() => {
    (async () => {
      try {
        setFetchingMe(true);
        const user = await getMe(); // läses via auth-cookie
        setMe(user);
      } catch (e) {
        setMe(null); // inte inloggad
      } finally {
        setFetchingMe(false);
      }
    })();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!me) {
      setToast({ message: "Du måste vara inloggad för att boka.", type: "error" });
      return;
    }

    try {
      setLoading(true);
      // Din backend kan läsa userId via cookie/claims; skicka bara classId
      await createBooking({ classId: session.id });

      setToast({ message: "Bokning genomförd!", type: "success" });
      onBooked?.();
    } catch (err) {
      setToast({
        message: err?.message || "Något gick fel vid bokningen.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="booking-form-container">
      <h2>Boka pass "{session.title}"</h2>

      {fetchingMe ? (
        <p>Laddar användare…</p>
      ) : !me ? (
        <p>
          Du är inte inloggad. <a href="/login">Logga in</a> för att boka.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="booking-form">
          <p>
            Du bokar plats på <strong>{session.title}</strong> med{" "}
            {session.instructor}.
          </p>

          <button type="submit" disabled={loading}>
            {loading ? "Bokar..." : "Bekräfta bokning"}
          </button>
          <button type="button" onClick={onClose}>
            Avbryt
          </button>
        </form>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}
