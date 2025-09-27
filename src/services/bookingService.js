import { post } from "./api";

export function cancelBooking({ classId, userId, email }) {
  return post("/api/booking/cancel", { classId, userId, email });
}
