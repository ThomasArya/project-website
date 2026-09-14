import { useEffect, useState } from 'react';
import { MediaBrowser } from '../../components/movie/MediaBrowser.tsx';
import { getDrama, getAllGenres } from '../../services/media.service.tsx';
import type { MovieItem } from '../../types/movie.tsx';
import { useSimulatedLoading } from '../../hooks/useSimulatedLoading.tsx';

const COUNTRIES = ['South Korea', 'Japan', 'China'];

export const Drama = () => {
  const loading = useSimulatedLoading(450);
  const [drama, setDrama] = useState<MovieItem[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const drama = await getDrama();
      setDrama(drama);
      setGenres(getAllGenres());
    })();
  }, []);

  return (
    <div className="pt-16">
      <MediaBrowser
        title="Drama"
        description="Korean, Japanese & Chinese dramas worth staying up for"
        items={drama}
        variant="drama"
        genres={genres}
        showCountryFilter
        countryValues={COUNTRIES}
        loading={loading}
      />
    </div>
  );
};

export default Drama;