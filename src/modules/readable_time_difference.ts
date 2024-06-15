export function generateReadableTimeDifference(differenceMs: number) {
  const seconds = differenceMs / 1000;
  if (seconds < 60) {
    return `less than a minute`;
  } else if (seconds < 3600) {
    const minutes = Math.round(seconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else if (seconds < 86400) {
    const hours = Math.round(seconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (seconds < 2592000) {
    const days = Math.round(seconds / 86400);
    return `${days} day${days > 1 ? "s" : ""}`;
  } else if (seconds < 31536000) {
    const months = Math.round(seconds / 2592000);
    return `${months} month${months > 1 ? "s" : ""}`;
  } else {
    const years = Math.round(seconds / 31536000);
    return `${years} year${years > 1 ? "s" : ""}`;
  }
}
