import React from "react";
import BookingButton from "./BookingButton";

function formatDateTime(isoUtc) {
  if (!isoUtc) return "–";
  const d = new Date(isoUtc); // ex: "2025-09-20T17:00:00Z" (UTC)
  if (isNaN(d)) return "–";
  return new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Stockholm", // tvinga visning i svensk lokal tid
  }).format(d);
}

export default function SessionCard({ session, onBook })
     {

        

    const availableSeats =  session.capacity - session.reservedSeats;
    return (
        <article className="session-card">
            <h3 className="session-card__title">{session.title}</h3>
            <p className="session-card__time">
                <strong>Tid:</strong> {formatDateTime(session.startTime)} - {formatDateTime(session.endTime)}
            </p>
            <p className="session-card__location">
                <strong>Plats:</strong> {session.location}
            </p>
            <p className="session-card__instructor">
                <strong>Instruktör:</strong> {session.instructor}
            </p>
            <p className="session-card__description">
                <strong>Beskrivning:</strong> {session.description}
            </p>
            <p className="session-card__slots">
                <strong>Lediga platser:</strong> {availableSeats}
            </p>
            <BookingButton buttonText="Boka nu" onClick={onBook}/>
        </article>
    );



}