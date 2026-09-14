import { getInitials } from '../../utils/format.tsx';

interface AvatarProps {
  src?: string;
  name: string;
  size?: number;
  className?: string;
}

export const Avatar = ({ src, name, size = 40, className = '' }: AvatarProps) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        className={`rounded-full object-cover ring-2 ring-white/10 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-amber-600 font-semibold text-white ring-2 ring-white/10 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      role="img"
      aria-label={name}
    >
      {getInitials(name)}
    </span>
  );
};

export default Avatar;