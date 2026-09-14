import { useMemo, useState } from 'react';
import { Search, Shield, Trash2, UserCircle } from 'lucide-react';
import { mockUsers } from '../../data/index.tsx';
import type { User } from '../../types/user.tsx';
import { Avatar } from '../../components/ui/Avatar.tsx';
import { useToast } from '../../contexts/ToastContext.tsx';
import { useDebounce } from '../../hooks/useDebounce.tsx';

export const AdminUsers = () => {
  const { notify } = useToast();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 250);

  const filtered = useMemo(
    () => users.filter((u) => u.username.toLowerCase().includes(debounced.toLowerCase()) || u.email.toLowerCase().includes(debounced.toLowerCase())),
    [users, debounced]
  );

  const toggleRole = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: u.role === 'admin' ? 'user' as const : 'admin' as const } : u))
    );
    notify('User role updated', 'success');
  };

  const deleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user || user.email === 'admin@streamify.com') {
      notify('Cannot delete the primary admin', 'warning');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    notify(`Deleted user "${user.username}"`, 'info');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Users</h2>
          <p className="text-sm text-zinc-500">{filtered.length} registered user{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="relative">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            aria-label="Search users"
            className="h-10 w-56 rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-zinc-100 outline-none transition placeholder-zinc-600 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-zinc-500">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-white/5 transition hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={u.avatar} name={u.username} size={36} />
                    <span className="font-semibold text-zinc-100">{u.username}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-400">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase ${
                      u.role === 'admin'
                        ? 'bg-red-600/15 text-red-300'
                        : 'bg-white/10 text-zinc-400'
                    }`}
                  >
                    <Shield size={12} aria-hidden /> {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-zinc-400">{u.plan}</span>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      aria-label={`Toggle role for ${u.username}`}
                      onClick={() => toggleRole(u.id)}
                      className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                    >
                      <UserCircle size={15} aria-hidden />
                    </button>
                    {u.email !== 'admin@streamify.com' && (
                      <button
                        type="button"
                        aria-label={`Delete ${u.username}`}
                        onClick={() => deleteUser(u.id)}
                        className="rounded-lg p-2 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={15} aria-hidden />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;