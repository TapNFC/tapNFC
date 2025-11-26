import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';

export type UserSettings = {
  name: string;
  email: string;
};

export type PasswordChangeData = {
  newPassword: string;
  confirmPassword: string;
};

export const useSettingsQuery = () => {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Mutation for updating user profile
  const updateProfileMutation = useMutation({
    mutationFn: async (settings: UserSettings) => {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: settings.name },
      });

      if (error) {
        throw error;
      }

      return settings;
    },
    onSuccess: () => {
      // Invalidate user data queries to refresh user information
      queryClient.invalidateQueries({ queryKey: ['user', 'data'] });
      toast.success('Settings saved!');
    },
    onError: () => {
      toast.error('Failed to update settings. Please try again.');
    },
  });

  // Mutation for changing password
  const changePasswordMutation = useMutation({
    mutationFn: async (passwordData: PasswordChangeData) => {
      if (passwordData.newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) {
        throw error;
      }

      return passwordData;
    },
    onSuccess: () => {
      toast.success('Password changed successfully.');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to change password. Please try again.');
    },
  });

  return {
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
  };
};
