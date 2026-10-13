export const usd = (n: number | null | undefined): string =>
  n == null ? '—' : n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: Math.abs(n) >= 1 ? 2 : 6 });

export const compact = (n: number | null | undefined): string =>
  n == null ? '—' : '$' + Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(n);

export const pct = (n: number | null | undefined): string => (n == null ? '—' : `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`);

export const ago = (unixSec: number): string => {
  const s = Math.max(0, Math.floor(Date.now() / 1000 - unixSec));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};
