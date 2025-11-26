import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export type UserData = {
  name: string;
  email: string;
  avatar?: string;
};

const fetchUserData = async (): Promise<UserData> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  return {
    name: user.user_metadata?.full_name
      || user.user_metadata?.name
      || user.email?.split('@')[0]
      || 'User',
    email: user.email!,
    avatar: user.user_metadata?.avatar_url,
  };
};

export const useUserData = () => {
  return useQuery({
    queryKey: ['user', 'data'],
    queryFn: fetchUserData,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
