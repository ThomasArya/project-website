import type { MovieItem } from '../../types/movie.tsx';
import { useWatchlist } from '../../contexts/WatchlistContext.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext.tsx';
import { Button } from '../ui/Button.tsx';
import { Check, Plus } from 'lucide-react';

interface WatchlistButtonProps {
  item: MovieItem;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const WatchlistButton = ({ item, size = 'md', className = '' }: WatchlistButtonProps) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { isAuthenticated } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const inWatchlist = isInWatchlist(item.id);

  const handleClick = () => {
    if (!isAuthenticated) {
      notify('Please login to manage your watchlist', 'warning');
      navigate('/login');
      return;
    }
    if (inWatchlist) {
      removeFromWatchlist(item.id);
      notify(`Removed "${item.title}" from watchlist`, 'info');
    } else {
      addToWatchlist(item);
      notify(`Added "${item.title}" to watchlist`, 'success');
    }
  };

  return (
    <Button
      variant={inWatchlist ? 'danger' : 'outline'}
      size={size}
      onClick={handleClick}
      className={className}
      aria-pressed={inWatchlist}
    >
      {inWatchlist ? <Check size={16} aria-hidden /> : <Plus size={16} aria-hidden />}
      {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
    </Button>
  );
};

export default WatchlistButton;