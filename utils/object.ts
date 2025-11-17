export function getKeyValue(obj: { [key: string]: string }) {
  const entries = Object.entries(obj);

  if (entries.length === 0) return null;

  const [key, value] = entries[0];
  return { key, value };
}
