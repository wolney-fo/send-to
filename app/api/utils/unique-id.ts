export function generateCompactID() {
  const now = new Date();
  const timestamp = now.getTime().toString(36);
  const random = Math.random().toString(36).substring(2, 4);

  return `${timestamp.substring(0, 4)}${random}`;
}
