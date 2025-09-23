import React from "react";

function formatDateTime(isoString) {
  return new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoString));
}

export default function SessionCard
    ({ Title, Description, StartTime, EndTime, Location, Instructor, Capacity, ReservedSeats }) {

    const availableSeats = Capacity - ReservedSeats;
return(
    <article className="session-card">
        <h3 className="session-card__title">{Title}</h3>
        <p className="session-card__time">
            <strong>Tid:</strong> {formatDateTime(StartTime)} - {formatDateTime(EndTime)}
        </p>
        <p className="session-card__location">
            <strong>Plats:</strong> {Location}
        </p>
        <p className="session-card__instructor">
            <strong>Instruktör:</strong> {Instructor}
        </p>
        <p className="session-card__description">
            <strong>Beskrivning:</strong> {Description}
        </p>
        <p className="session-card__slots">
            <strong>Lediga platser:</strong> {availableSeats}
        </p>
    </article>
);



}