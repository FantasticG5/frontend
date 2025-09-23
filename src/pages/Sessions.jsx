import React, { useEffect, useState } from "react";
import SessionCard from "../components/SessionCard";

/*const mockSessions = [
  {
    id: 1,
    title: "Yoga",
    description: "Lugn och skön yoga",
    startTime: "2025-09-23T10:00:00",
    endTime: "2025-09-23T11:00:00",
    location: "Sal 1",
    instructor: "Anna",
    capacity: 20,
    reservedSeats: 5,
  },
  {
    id: 2,
    title: "Spinning",
    description: "Högintensiv spinningklass",
    startTime: "2025-09-23T12:00:00",
    endTime: "2025-09-23T13:00:00",
    location: "Sal 2",
    instructor: "Johan",
    capacity: 15,
    reservedSeats: 15,
  },
];*/

const BASE_URL = "http://localhost:5067";

export default function Sessions() {

    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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

                setSession(normalized);

                console.log("API-data:", normalized);

            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }

        load();
        //setSession(mockSessions)

    }, []);


    if (loading) return <p>Laddar pass…</p>;
    if (error) return <p style={{ color: "crimson" }}>Fel: {error}</p>;
    if (session.length === 0) return <p>Inga pass hittades.</p>;

    return (
        <div>
            <h1 className="session-title">Träningspass</h1>
            {session.map((s) => (
                <SessionCard
                    key={s.id}
                    Title={s.title}
                    Description={s.description}
                    StartTime={s.startTime}
                    EndTime={s.endTime}
                    Location={s.location}
                    Instructor={s.instructor}
                    Capacity={s.capacity}
                    ReservedSeats={s.reservedSeats}
                />
            ))}
        </div>

        /*<div>
        <h1>Träningspass</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {session &&
          session.map((s) => (
            <SessionCard
              key={s.id}
              Title={s.title}
              Description={s.description}
              StartTime={s.startTime}
              EndTime={s.endTime}
              Location={s.location}
              Instructor={s.instructor}
              Capacity={s.capacity}
              ReservedSeats={s.reservedSeats}
            />
          ))}
      </div>*/

    );
}
