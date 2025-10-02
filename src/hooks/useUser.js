// src/hooks/useUser.js
import { useEffect, useState } from 'react';
import { getMe } from '../services/identityService';
import { ensureCsrf } from '../components/http';

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await ensureCsrf();        // se till att cookies + XSRF finns
        const u = await getMe();
        setUser(u);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { user, loading, error };
}
