'use client';

import * as React from 'react';

// Share one request between components that poll the same URL.
const inflight = new Map<string, { t: number; p: Promise<unknown> }>();
function fetchShared(url: string): Promise<unknown> {
  const hit = inflight.get(url);
  if (hit && Date.now() - hit.t < 5000) return hit.p;
  const p = fetch(url).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });
  inflight.set(url, { t: Date.now(), p });
  p.catch(() => inflight.delete(url));
  return p;
}

export function useLive<T>(url: string, everyMs = 60_000) {
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const j = (await fetchShared(url)) as T;
        if (alive) {
          setData(j);
          setError(null);
        }
      } catch (e) {
        if (alive) setError((e as Error).message);
      } finally {
        if (alive) setLoading(false);
      }
    }
    void load();
    const id = setInterval(() => void load(), everyMs);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [url, everyMs]);

  return { data, error, loading };
}
