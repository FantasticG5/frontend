// src/hooks/useMyBookings.js
import { useEffect, useMemo, useState } from 'react';
import { getMyBookings, cancelBooking } from '../services/bookingService';
import { getAllClasses } from '../services/eventService';

export function useMyBookings() {
  const [items, setItems] = useState([]); // aggregerade bokningar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  async function refetch() {
    setLoading(true);
    setError(null);
    try {
      const [bookings, classes] = await Promise.all([
        getMyBookings(),
        getAllClasses()
      ]);

      const classMap = new Map(
        (Array.isArray(classes) ? classes : []).map(c => [
          c.id ?? c.Id,
          {
            id: c.id ?? c.Id,
            title: c.title ?? c.Title,
            startTime: c.startTime ?? c.StartTime,
            endTime: c.endTime ?? c.EndTime,
            location: c.location ?? c.Location,
            instructor: c.instructor ?? c.Instructor
          }
        ])
      );

      const combined = (Array.isArray(bookings) ? bookings : []).map(b => {
        const cls = classMap.get(b.classId);
        return {
          id: b.id ?? b.Id,                 // bookingId
          classId: b.classId ?? b.ClassId,
          createdAt: b.createdAt ?? b.CreatedAt,
          isCancelled: b.isCancelled ?? b.IsCancelled,
          title: cls?.title ?? '(okänd klass)',
          date: cls?.startTime ?? null,
          location: cls?.location ?? '',
          instructor: cls?.instructor ?? ''
        };
      }).filter(x => !x.isCancelled);

      setItems(combined);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refetch(); }, []);

  async function onCancel(bookingId) {
    setBusyId(bookingId);
    try {
      await cancelBooking(bookingId);
      setItems(prev => prev.filter(x => x.id !== bookingId)); // optimistiskt
    } finally {
      setBusyId(null);
    }
  }

  const empty = useMemo(() => items.length === 0, [items]);

  return { items, loading, error, empty, busyId, refetch, onCancel };
}
