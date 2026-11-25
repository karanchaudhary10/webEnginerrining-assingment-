import { useQuery } from '@tanstack/react-query';
import { fetchUsers, fetchUser } from '../api/user.js';

export const useUsers = () => useQuery({ queryKey: ['users'], queryFn: fetchUsers });
export const useUser = (id) => useQuery({ queryKey: ['users', id], queryFn: () => fetchUser(id), enabled: !!id });