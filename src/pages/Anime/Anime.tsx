import { useEffect, useState } from 'react';
import { MediaBrowser } from '../../components/movie/MediaBrowser.tsx';
import { getAnime, getAllGenres } from '../../services/media.service.tsx';
import type { MovieItem } from '../../types/movie.tsx';
import { useSimulatedLoading } from '../../hooks/useSimulatedLoading.tsx';

export const Anime = () => {
  const loading = useSimulatedLoading(450);
  const [anime, setAnime] = useState<MovieItem[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const anime = await getAnime();
      setAnime(anime);
      setGenres(getAllGenres());
    })();
  }, []);

  return (
    <div className="pt-16">
      <MediaBrowser
        title="Anime"
        description="Stream the best anime — from ongoing hits to timeless classics"
        items={anime}
        variant="anime"
        genres={genres}
        showStatusFilter
        loading={loading}
      />
    </div>
  );
};

export default Anime;