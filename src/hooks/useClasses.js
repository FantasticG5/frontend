// src/hooks/useClasses.js
import { useEffect, useState } from 'react';
import { getAllClasses } from '../services/eventService';

export function useClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await getAllClasses();
        // normalisera (din backend kan returnera PascalCase)
        const norm = (Array.isArray(list) ? list : []).map(c => ({
          id: c.id ?? c.Id,
          title: c.title ?? c.Title,
          description: c.description ?? c.Description,
          startTime: c.startTime ?? c.StartTime,
          endTime: c.endTime ?? c.EndTime,
          location: c.location ?? c.Location,
          instructor: c.instructor ?? c.Instructor,
          capacity: c.capacity ?? c.Capacity,
          reservedSeats: c.reservedSeats ?? c.ReservedSeats
        }));
        setClasses(norm);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { classes, loading, error };
}
