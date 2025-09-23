import React from "react";
import BookingButton from "./BookingButton";

// function formatDateTime(isoString) {
//   return new Intl.DateTimeFormat("sv-SE", {
//     dateStyle: "medium",
//     timeStyle: "short",
//   }).format(new Date(isoString));
// }

export default function SessionCard({ session, onBook })
     {

    const availableSeats = session.Capacity - session.ReservedSeats;
    return (
        <article className="session-card">
            <h3 className="session-card__title">{session.Title}</h3>
            {/* <p className="session-card__time">
                <strong>Tid:</strong> {formatDateTime(session.StartTime)} - {formatDateTime(session.EndTime)}
            </p> */}
            <p className="session-card__location">
                <strong>Plats:</strong> {session.Location}
            </p>
            <p className="session-card__instructor">
                <strong>Instruktör:</strong> {session.Instructor}
            </p>
            <p className="session-card__description">
                <strong>Beskrivning:</strong> {session.Description}
            </p>
            <p className="session-card__slots">
                <strong>Lediga platser:</strong> {availableSeats}
            </p>
            <BookingButton buttonText="Boka nu" onClick={onBook}/>
        </article>
    );



}