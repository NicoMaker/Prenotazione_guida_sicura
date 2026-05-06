export function padTwo(n) {
  return String(n).padStart(2, "0");
}

export function formatDateIT(dateStr) {
  const [yyyy, mm, dd] = dateStr.split("-");
  return `${padTwo(dd)}/${padTwo(mm)}/${yyyy}`;
}

export function formatDateLong(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
