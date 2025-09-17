import { post } from "./api";

export function cancelBooking({ bookingId, memberEmail, memberName }) {
  return post("/api/booking/cancel", { bookingId, memberEmail, memberName });
}
