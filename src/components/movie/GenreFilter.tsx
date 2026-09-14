interface GenreFilterProps {
  genres: string[];
  value: string;
  onChange: (genre: string) => void;
}

export const GenreFilter = ({ genres, value, onChange }: GenreFilterProps) => (
  <div className="flex flex-wrap gap-2">
    {['All', ...genres].map((genre) => (
      <button
        key={genre}
        type="button"
        aria-pressed={value === genre}
        onClick={() => onChange(genre)}
        className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${
          value === genre
            ? 'border-red-500/60 bg-red-600/20 text-red-300'
            : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/25 hover:text-white'
        }`}
      >
        {genre}
      </button>
    ))}
  </div>
);

export default GenreFilter;