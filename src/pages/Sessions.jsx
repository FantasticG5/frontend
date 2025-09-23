import React, { useEffect, useState } from "react";
import SessionCard from "../components/SessionCard";
import BookingForm from "../components/BookingForm";



const BASE_URL = "http://localhost:5067";

export default function Sessions() {

  const [sessions, setSessions] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null)

  useEffect(() => {
    async function load() {
      try {

        setError(null);
        setLoading(true);

        const res = await fetch(`${BASE_URL}/api/event`, {
          headers: { Accept: "application/json" },
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

        console.log("API-data:", normalized);

      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();


  }, []);


  if (loading) return <p>Laddar pass…</p>;
  if (error) return <p style={{ color: "crimson" }}>Fel: {error}</p>;
  if (sessions.length === 0) return <p>Inga pass hittades.</p>;

  return (
    <div>
      <h1 className="session-title">Träningspass</h1>
      {sessions.map((s) => (
        <SessionCard
          key={s.id}
          session={s}
          onBook={() => setSelectedSession(s)}
        />
      ))}

      {selectedSession && (
        <BookingForm 
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>



  );
}
