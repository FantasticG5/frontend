// src/pages/Sessions.jsx
import React from "react";
import SessionCard from "../components/SessionCard";
import BookingForm from "../components/BookingForm";
import { useAuth } from "../components/auth/authProvider";

// Bas-URL från .env (t.ex. VITE_EVENT_URL=https://localhost:7205)
const EVENT_BASE = import.meta.env.VITE_EVENT_URL;

// Undvik // i URL:er
function join(base, path) {
  const b = (base || "").replace(/\/+$/, "");
  const p = (path || "").replace(/^\/+/, "");
  return `${b}/${p}`;
}

const EVENT_API = join(EVENT_BASE, "/api");

export default function Sessions() {
  const { getAccessToken } = useAuth();
  const [sessions, setSessions] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedSession, setSelectedSession] = React.useState(null);

  async function fetchSession() {
    try {
      setError(null);
      setLoading(true);

      const at = getAccessToken?.();
      const res = await fetch(join(EVENT_API, "/event"), {
        method: "GET",
        credentials: "omit", // 👈 viktigt: inga cookies över CORS
        headers: {
          Accept: "application/json",
          ...(at ? { Authorization: `Bearer ${at}` } : {}), // 👈 Bearer-token
        },
        mode: "cors",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const normalized = (Array.isArray(data) ? data : []).map((x) => ({
        id: x.id ?? x.Id,
        title: x.title ?? x.Title,
        description: x.description ?? x.Description,
        startTime: x.startTime ?? x.StartTime,
        endTime: x.endTime ?? x.EndTime,
        location: x.location ?? x.Location,
        instructor: x.instructor ?? x.Instructor,
        capacity: x.capacity ?? x.Capacity,
        reservedSeats: x.reservedSeats ?? x.ReservedSeats,
      }));

      setSessions(normalized);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchSession();
    // kör igen om token ändras (t.ex. efter login/refresh)
  }, [getAccessToken]);

  if (loading) return <div className="my-sessions-container"><p>Laddar pass…</p></div>;
  if (error) return <div className="my-sessions-container"><p style={{ color: "crimson" }}>Fel: {error}</p></div>;
  if (sessions.length === 0) return <div className="my-sessions-container"><p>Inga pass hittades.</p></div>;

  return (
    <div className="container">
      <h1 className="session-title">Träningspass</h1>
      {sessions.map((s) => (
        <SessionCard key={s.id} session={s} onBook={() => setSelectedSession(s)} />
      ))}

      {selectedSession && (
        <BookingForm
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onBooked={async () => {
            setSessions((prev) =>
              prev.map((item) =>
                item.id === selectedSession.id
                  ? { ...item, reservedSeats: (Number(item.reservedSeats) || 0) + 1 }
                  : item
              )
            );
            setSelectedSession(null);
          }}
        />
      )}
    </div>
  );
}
