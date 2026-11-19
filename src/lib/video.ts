/*
 * Vídeo exclusivo para suscriptores (juanandresromero.es/video).
 * Para cambiar de vídeo o pasarlo a Vimeo basta con tocar EXCLUSIVE_VIDEO:
 *   { provider: "vimeo", id: "123456789", hash: "abcdef" }   (hash: el «h=» del enlace, si lo hay)
 * Con Vimeo, en el vídeo: Privacidad → «Ocultar de Vimeo» e «Insertar solo en
 * dominios específicos» → juanandresromero.es. Así no se reproduce fuera de la web.
 */

export type ExclusiveVideo =
  | { provider: "youtube"; id: string; title: string }
  | { provider: "vimeo"; id: string; hash?: string; title: string };

export const EXCLUSIVE_VIDEO: ExclusiveVideo = {
  provider: "youtube",
  id: "iYKmNjIFY7s",
  title: "Mesa redonda Investor Day · Bolsa Zone",
};

export function embedUrl(v: ExclusiveVideo): string {
  if (v.provider === "youtube") {
    return `https://www.youtube-nocookie.com/embed/${v.id}?rel=0&modestbranding=1`;
  }
  const h = v.hash ? `h=${encodeURIComponent(v.hash)}&` : "";
  return `https://player.vimeo.com/video/${v.id}?${h}dnt=1&title=0&byline=0&portrait=0`;
}

export function thumbnailUrl(v: ExclusiveVideo): string | null {
  return v.provider === "youtube" ? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` : null;
}
