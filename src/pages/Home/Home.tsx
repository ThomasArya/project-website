import { useEffect, useState } from "react";
import { Clapperboard, PlayCircle } from "lucide-react";
import { HeroBanner } from "../../components/movie/HeroBanner.tsx";
import { MovieCarousel } from "../../components/movie/MovieCarousel.tsx";
import { ContinueWatchingCard } from "../../components/movie/ContinueWatchingCard.tsx";
import { SectionHeader } from "../../components/movie/SectionHeader.tsx";
import {
  getTrending,
  getMovies,
  getAnime,
  getDrama,
} from "../../services/media.service.tsx";
import type { MovieItem } from "../../types/movie.tsx";
import { useSimulatedLoading } from "../../hooks/useSimulatedLoading.tsx";
import { useWatchlist } from "../../contexts/WatchlistContext.tsx";
import { Link } from "react-router-dom";

export const Home = () => {
  const loading = useSimulatedLoading(500);
  const { continueWatching } = useWatchlist();

  const [trending, setTrending] = useState<MovieItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MovieItem[]>([]);
  const [popularAnime, setPopularAnime] = useState<MovieItem[]>([]);
  const [popularDrama, setPopularDrama] = useState<MovieItem[]>([]);
  const [latest, setLatest] = useState<MovieItem[]>([]);
  const [recommended, setRecommended] = useState<MovieItem[]>([]);

  useEffect(() => {
    (async () => {
      const [trending, allMovies, anime, drama] = await Promise.all([
        getTrending(),
        getMovies(),
        getAnime(),
        getDrama(),
      ]);
      setTrending(trending);
      setPopularMovies(allMovies.slice(0, 25));
      setPopularAnime(anime.slice(0, 25));
      setPopularDrama(drama.slice(0, 25));
      setLatest(
        [...allMovies, ...anime, ...drama]
          .sort((a, b) => b.releaseYear - a.releaseYear)
          .slice(0, 25),
      );
      setRecommended(
        [...allMovies, ...anime, ...drama]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 25),
      );
    })();
  }, []);

  return (
    <div>
      <HeroBanner />

      <div className="mx-auto max-w-screen-2xl space-y-12 px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        {continueWatching.length > 0 && (
          <section aria-label="Continue watching">
            <SectionHeader
              title="Continue Watching"
              subtitle="Pick up where you left off"
            />
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
              {continueWatching.map((item) => (
                <ContinueWatchingCard
                  key={`${item.mediaId}-${item.episodeId ?? ""}`}
                  item={item}
                />
              ))}
            </div>
          </section>
        )}

        <MovieCarousel
          title="Trending Now"
          subtitle="What everyone is watching right now"
          items={trending}
          loading={loading}
          viewAllHref="/search?sort=popular"
        />

        <MovieCarousel
          title="Popular Movies"
          subtitle="Blockbusters loved by millions"
          items={popularMovies}
          loading={loading}
          viewAllHref="/movies"
        />

        <MovieCarousel
          title="Popular Anime"
          subtitle="Top rated anime series"
          items={popularAnime}
          loading={loading}
          variant="anime"
          viewAllHref="/anime"
        />

        <MovieCarousel
          title="Popular Drama"
          subtitle="Addictive dramas from around the world"
          items={popularDrama}
          loading={loading}
          viewAllHref="/drama"
        />

        <MovieCarousel
          title="Latest Releases"
          subtitle="Fresh content added recently"
          items={latest}
          loading={loading}
          viewAllHref="/search?sort=latest"
        />

        <MovieCarousel
          title="Recommended For You"
          subtitle="Handpicked based on your taste"
          items={recommended}
          loading={loading}
          viewAllHref="/search"
        />

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-600/10 via-transparent to-cyan-500/10 p-8 text-center md:p-12">
          <div className="mx-auto flex max-w-lg flex-col items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/20 text-red-400">
              <Clapperboard size={28} aria-hidden />
            </span>
            <h2 className="text-2xl font-extrabold text-white">
              Have a movie night planned?
            </h2>
            <p className="text-sm text-zinc-400">
              Explore thousands of titles across movies, anime, drama, and
              series — all in one place.
            </p>
            <Link
              to="/search"
              className="mt-2 flex h-11 items-center gap-2 rounded-lg bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-500 glow-red"
            >
              <PlayCircle size={18} aria-hidden />
              Start Exploring
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
