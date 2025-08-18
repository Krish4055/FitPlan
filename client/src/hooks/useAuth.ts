import { useQuery } from '@tanstack/react-query';
import type { User } from '@shared/schema';

// Keep minimal hook for components that might read user info, but do not block UI
export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return { user, isLoading, error, isAuthenticated: !!user && !error };
}