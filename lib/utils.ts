// Fix malformed URLs with multiple ? marks (e.g., ?branch=x?environment=y -> ?branch=x&environment=y)
export function fixImageUrl(url: string | undefined): string {
  if (!url) return '';
  const firstQuestionMark = url.indexOf('?');
  if (firstQuestionMark === -1) return url;
  const beforeQuery = url.substring(0, firstQuestionMark + 1);
  const queryPart = url.substring(firstQuestionMark + 1);
  return beforeQuery + queryPart.replace(/\?/g, '&');
}
