export function formatDateTimeWithDay(isoDateTime: string): string {
  const date = new Date(isoDateTime);

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = dayNames[date.getDay()];

  return `${year}.${month}.${day} (${dayOfWeek}) ${hours}:${minutes}`;
}
