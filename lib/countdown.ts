export function getCountdown(now: Date) {
  const year = now.getFullYear();
  if (now.getMonth() === 8 && now.getDate() === 18)
    return { celebration: true, days: 0, hours: 0, minutes: 0 };
  const target = new Date(year, 8, 18);
  if (now >= target) target.setFullYear(year + 1);
  const minutes = Math.max(
    0,
    Math.ceil((target.getTime() - now.getTime()) / 60000),
  );
  return {
    celebration: false,
    days: Math.floor(minutes / 1440),
    hours: Math.floor(minutes / 60) % 24,
    minutes: minutes % 60,
  };
}
