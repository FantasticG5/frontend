// import { post } from "./api";

// export function cancelBooking({ classId, userId, email }) {
//   return post("/api/booking/cancel", { classId, userId, email });
// }
import { apiGet, apiWrite, endpoints } from '../components/http';

// GET /api/booking/my  (om du har en sådan – annars ta bort den)
export async function getMyBookings() {
  return apiGet(`${endpoints.BOOKING}/booking/my`);
}

// POST /api/booking  body: { classId, ... }  <-- matcha BookingDto
export async function createBooking({ classId, ...rest }) {
  return apiWrite(`${endpoints.BOOKING}/booking`, 'POST', { classId });
}

// POST /api/booking/cancel  body: { classId, email, ... } <-- din CancelBookingDto kräver Email
export async function cancelBooking({ classId, email, ...rest }) {
  return apiWrite(`${endpoints.BOOKING}/booking/cancel`, 'POST', { classId });
}