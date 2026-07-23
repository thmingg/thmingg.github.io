/**
 * Convert common video share URLs into an iframe-friendly embed URL.
 * Returns null when the URL isn't a known embeddable provider.
 */
export function getVideoEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (
      parsed.hostname.includes("youtube.com") ||
      parsed.hostname.includes("youtube-nocookie.com")
    ) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
      const embedMatch = parsed.pathname.match(/\/embed\/([^/]+)/);
      if (embedMatch?.[1]) {
        return `https://www.youtube-nocookie.com/embed/${embedMatch[1]}`;
      }
      const shortsMatch = parsed.pathname.match(/\/shorts\/([^/]+)/);
      if (shortsMatch?.[1]) {
        return `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}`;
      }
      const liveMatch = parsed.pathname.match(/\/(?:live|v)\/([^/]+)/);
      if (liveMatch?.[1]) {
        return `https://www.youtube-nocookie.com/embed/${liveMatch[1]}`;
      }
      return null;
    }

    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.replace(/^\//, "").split("/")[0];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }

    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }

    // Direct media / already-embeddable URL
    if (/\.(mp4|webm|ogg)(\?|$)/i.test(parsed.pathname)) {
      return url;
    }

    return null;
  } catch {
    return null;
  }
}

export function isDirectVideoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return /\.(mp4|webm|ogg)(\?|$)/i.test(parsed.pathname);
  } catch {
    return false;
  }
}
