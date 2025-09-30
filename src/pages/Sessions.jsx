import React, { useEffect, useState } from "react";
import SessionCard from "../components/SessionCard";
import BookingForm from "../components/BookingForm";

const EVENT_API = import.meta.env.VITE_EVENT_URL;     // ⬅️ rätt service

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  async function fetchSession() {
    try {
      setError(null);
      setLoading(true);

      const res = await fetch(`${EVENT_API}/api/event`, {
        headers: { Accept: "application/json" },
        credentials: "include", // ok om du kräver cookie
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

  useEffect(() => {
    fetchSession();
  }, []);

  if (loading) return <p>Laddar pass…</p>;
  if (error) return <p style={{ color: "crimson" }}>Fel: {error}</p>;
  if (sessions.length === 0) return <p>Inga pass hittades.</p>;

  return (
    <div>
      <h1 className="session-title">Träningspass</h1>
      {sessions.map((s) => (
        <SessionCard key={s.id} session={s} onBook={() => setSelectedSession(s)} />
      ))}

      {selectedSession && (
        <BookingForm
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onBooked={async () => {
            setSessions(prev =>
              prev.map(item =>
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
