import type { User } from '../types/user.tsx';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'Admin',
    email: 'admin@streamify.com',
    avatar: 'https://picsum.photos/seed/admin/200/200',
    role: 'admin',
    plan: 'VIP',
    createdAt: '2024-01-01',
    favorites: ['movie-inception', 'anime-demon', 'drama-extraordinary'],
  },
  {
    id: 'user-2',
    username: 'Cinephile',
    email: 'cinephile@example.com',
    avatar: 'https://picsum.photos/seed/cinephile/200/200',
    role: 'user',
    plan: 'Premium',
    createdAt: '2024-05-20',
    favorites: ['movie-interstellar', 'movie-dune', 'anime-jjk'],
  },
  {
    id: 'user-3',
    username: 'AnimeLover',
    email: 'animelover@example.com',
    avatar: 'https://picsum.photos/seed/animelover/200/200',
    role: 'user',
    plan: 'Free',
    createdAt: '2024-08-11',
    favorites: ['anime-op', 'anime-frieren'],
  },
  {
    id: 'user-4',
    username: 'DramaQueen',
    email: 'dramaqueen@example.com',
    avatar: 'https://picsum.photos/seed/dramaqueen/200/200',
    role: 'user',
    plan: 'Premium',
    createdAt: '2024-09-03',
    favorites: ['drama-crash', 'drama-glory', 'drama-jp-nodame'],
  },
];

export default mockUsers;