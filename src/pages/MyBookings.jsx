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

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const meRes = await getMe();           // ← kräver att du är inloggad
        setMe(meRes);

        const [bookings, classes] = await Promise.all([
          getMyBookings().catch(() => []),
          getAllClasses().catch(() => []),
        ]);

        const classMap = new Map(
          classes.map(c => [ (c.id ?? c.Id), {
            id: c.id ?? c.Id,
            title: c.title ?? c.Title,
            startTime: c.startTime ?? c.StartTime,
            location: c.location ?? c.Location,
            instructor: c.instructor ?? c.Instructor
          } ])
        );

        const combined = bookings.map(b => {
          const cls = classMap.get(b.classId ?? b.ClassId);
          return {
            id: b.id ?? b.Id,
            classId: b.classId ?? b.ClassId,
            title: cls?.title ?? "(okänd klass)",
            date: cls?.startTime ?? null,
            location: cls?.location ?? "",
            instructor: cls?.instructor ?? ""
          };
        });

        setItems(combined);
      } catch (e) {
        setToast({ message: e.message || "Kunde inte hämta bokningar.", type: "error" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleCancel(b) {
    try {
      if (!me) throw new Error("Inte inloggad.");
      setBusyId(b.id);

      await cancelBooking({ classId: b.classId, userId: me.id, email: me.email });

      setItems(prev => prev.filter(x => x.id !== b.id));
      setToast({ message: "Avbokning genomförd!", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "Något gick fel vid avbokning.", type: "error" });
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p>Laddar bokningar…</p>;
  if (!me) return <p>Du är inte inloggad. <a href="/login">Logga in</a></p>;
  if (items.length === 0) return <p>Du har inga kommande bokningar.</p>;

  return (
    <div className="container">
      <h1>Mina bokningar</h1>

      <div className="booking-list">
        {items.map(b => (
          <div key={b.id} className="booking-card">
            <div>
              <h3>{b.title}</h3>
              <p>{b.location} • {b.instructor}</p>
              <p>{b.date ? new Date(b.date).toLocaleString() : "Okänt datum"}</p>
            </div>
            <button
              className="btn-cancel"
              onClick={() => handleCancel(b)}
              disabled={busyId === b.id}
            >
              {busyId === b.id ? "Avbokar..." : "Avboka"}
            </button>
          </div>
        ))}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}
