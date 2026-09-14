import { useEffect, useState } from 'react';
import { MediaBrowser } from '../../components/movie/MediaBrowser.tsx';
import { getSeries, getAllGenres } from '../../services/media.service.tsx';
import type { MovieItem } from '../../types/movie.tsx';
import { useSimulatedLoading } from '../../hooks/useSimulatedLoading.tsx';

export const Series = () => {
  const loading = useSimulatedLoading(450);
  const [series, setSeries] = useState<MovieItem[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const series = await getSeries();
      setSeries(series);
      setGenres(getAllGenres());
    })();
  }, []);

  return (
    <div className="pt-16">
      <MediaBrowser
        title="TV Series"
        description="Western series and global TV shows all in one place"
        items={series}
        variant="series"
        genres={genres}
        loading={loading}
      />
    </div>
  );
};

export default Series;