// Small date-formatting helpers to keep display logic out of components.

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
}

// Returns a human-friendly countdown/overdue string relative to now, e.g.
// "2h left", "3d left", "Overdue by 1h".
export function timeUntil(iso: string): string {
  const diffMs = new Date(iso).getTime() - Date.now();
  const isPast = diffMs < 0;
  const absMs = Math.abs(diffMs);

  const minutes = Math.floor(absMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let value: string;
  if (days > 0) value = `${days}d`;
  else if (hours > 0) value = `${hours}h`;
  else value = `${Math.max(minutes, 1)}m`;

  return isPast ? `Overdue by ${value}` : `${value} left`;
}

export function isOverdue(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}
