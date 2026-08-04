/**
 * Extracts an 11-character YouTube video ID from any common URL shape,
 * or passes through a bare ID unchanged. Returns null if nothing matches,
 * so callers can skip/flag broken entries instead of rendering a dead embed.
 *
 * Accepted inputs:
 *   https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *   https://youtu.be/dQw4w9WgXcQ
 *   https://www.youtube.com/embed/dQw4w9WgXcQ
 *   https://www.youtube.com/shorts/dQw4w9WgXcQ
 *   dQw4w9WgXcQ
 */
export function extractYouTubeId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  const bareId = /^[a-zA-Z0-9_-]{11}$/;
  if (bareId.test(value)) return value;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = url.pathname.slice(1).split('/')[0];
      return bareId.test(id) ? id : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      const vParam = url.searchParams.get('v');
      if (vParam && bareId.test(vParam)) return vParam;

      const pathMatch = url.pathname.match(/\/(embed|shorts|live)\/([a-zA-Z0-9_-]{11})/);
      if (pathMatch) return pathMatch[2];
    }
  } catch {
    // Not a valid URL — fall through to null.
  }

  return null;
}

export function youtubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
