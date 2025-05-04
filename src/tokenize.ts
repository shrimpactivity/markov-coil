export function tokenize(text: string) {
  const trimmed = text.replace(/\s+/g, " ").trim().toLowerCase();
  return trimmed.split(" ");
}