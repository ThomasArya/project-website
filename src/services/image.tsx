const imageCache = new Map<string, string>();

export const imageUrl = (url: string, width = 600): string => {
  if (!url) return '';
  if (url.startsWith('https://picsum.photos/seed/')) {
    const cached = imageCache.get(`${url}-${width}`);
    if (cached) return cached;
    const path = url.split('/seed/')[1];
    const seed = path.split('/')[0];
    const aspect = url.includes('/300/450') ? `${width}/${Math.round((width * 450) / 300)}` : `${width}/${Math.round((width * 720) / 1280)}`;
    const next = `https://picsum.photos/seed/${seed}/${aspect}`;
    imageCache.set(`${url}-${width}`, next);
    return next;
  }
  return url;
};

export default imageUrl;