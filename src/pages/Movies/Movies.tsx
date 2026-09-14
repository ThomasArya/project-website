import { useEffect, useState } from 'react';
import { MediaBrowser } from '../../components/movie/MediaBrowser.tsx';
import { getMovies, getAllGenres } from '../../services/media.service.tsx';
import type { MovieItem } from '../../types/movie.tsx';
import { useSimulatedLoading } from '../../hooks/useSimulatedLoading.tsx';

export const Movies = () => {
  const loading = useSimulatedLoading(450);
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const movies = await getMovies();
      setMovies(movies);
      setGenres(getAllGenres());
    })();
  }, []);

  return (
    <div className="pt-16">
      <MediaBrowser
        title="Movies"
        description="Browse the latest and greatest movies in stunning quality"
        items={movies}
        variant="movie"
        genres={genres}
        loading={loading}
      />
    </div>
  );
};

export default Movies;