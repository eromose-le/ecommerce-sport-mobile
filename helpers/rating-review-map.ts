export const getRatingComment = (avg: number, total: number) => {
  if (total === 0) return "No ratings yet";
  if (avg >= 4.5) return "Excellent";
  if (avg >= 4) return "Very satisfied";
  if (avg >= 3) return "Satisfied";
  if (avg >= 2) return "Needs improvement";
  return "Poor";
};