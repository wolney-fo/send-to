export function formatUrl(url: string) {
  if (!url.match(/^https?:\/\//i)) {
    return `http://${url}`;
  }
  return url;
}
