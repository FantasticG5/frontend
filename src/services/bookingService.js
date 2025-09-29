// import { post } from "./api";

// export function cancelBooking({ classId, userId, email }) {
//   return post("/api/booking/cancel", { classId, userId, email });
// }

// GET /api/booking/my  (om du har en sådan – annars ta bort den)
export async function getMyBookings() {
  return apiGet(`${endpoints.BOOKING}/api/booking/my`);
}

// POST /api/booking  body: { classId, ... }  <-- matcha BookingDto
export async function createBooking({ classId, ...rest }) {
  return apiWrite(`${endpoints.BOOKING}/api/booking`, 'POST', { classId, ...rest });
}

// POST /api/booking/cancel  body: { classId, email, ... } <-- din CancelBookingDto kräver Email
export async function cancelBooking({ classId, email, ...rest }) {
  return apiWrite(`${endpoints.BOOKING}/api/booking/cancel`, 'POST', { classId, email, ...rest });
}