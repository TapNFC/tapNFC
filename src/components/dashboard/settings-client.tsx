'use client';

import type { User as SupabaseUser } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Key, Loader2, Mail, Save, Send, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettingsQuery } from '@/hooks/useSettingsQuery';

type SettingsClientProps = {
  user: SupabaseUser;
};

export function SettingsClient({ user }: SettingsClientProps) {
  const {
    updateProfile,
    changePassword,
    isUpdatingProfile,
    isChangingPassword,
  } = useSettingsQuery();
  const [settings, setSettings] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  // const [isInviting, setIsInviting] = useState(false);

  const isChanged
    = settings.name !== (user?.user_metadata?.full_name || '');

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleInvite = async () => {
    // Function disabled - uncomment below to re-enable
    /*
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    setIsInviting(true);
    try {
      const locale = (user?.user_metadata?.locale as string) || 'en';
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, locale }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to send invite');
      }
      toast.success('Invitation sent');
      setInviteEmail('');
    } catch (e: any) {
      toast.error(e.message || 'Failed to send invite');
    } finally {
      setIsInviting(false);
    }
    */
  };

  const handleSave = async () => {
    updateProfile({
      name: settings.name,
      email: settings.email,
    });
  };

  const handleChangePassword = async () => {
    changePassword({
      newPassword,
      confirmPassword,
    });

    // Clear passwords on success (handled by mutation)
    if (newPassword === confirmPassword && newPassword.length >= 6) {
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="min-h-full space-y-8 p-8 py-2">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-80 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center space-x-3">
              <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-2 shadow-lg">
                <User className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Account
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage your account settings
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-6 border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Profile Information
                </h3>
                <Button
                  onClick={handleSave}
                  disabled={!isChanged || isUpdatingProfile}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:from-purple-600 hover:to-pink-700 hover:shadow-xl hover:shadow-purple-500/30"
                >
                  {isUpdatingProfile
                    ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      )
                    : (
                        <Save className="mr-2 size-4" />
                      )}
                  {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={settings.name}
                      onChange={e => handleSettingChange('name', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      disabled
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card className="mb-6 border-slate-200/60 bg-slate-100/80 opacity-60 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-700/80">
            <div className="p-6">
              <div className="mb-6 flex items-center space-x-2">
                <Mail className="size-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400">
                  Invite a User (Disabled)
                </h3>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  placeholder="email@example.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  disabled
                  className=" bg-slate-50 text-slate-400"
                />
                <Button onClick={handleInvite} disabled className="cursor-not-allowed bg-slate-300 text-slate-500 sm:w-40">
                  {/* {isInviting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />} */}
                  <Send className="mr-2 size-4" />
                  {/* {isInviting ? 'Sending...' : 'Send Invite'} */}
                  Send Invite
                </Button>
              </div>
            </div>
          </Card>
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80">
            <div className="p-6">
              <div className="mb-6 flex items-center space-x-2">
                <Key className="size-5 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Change Password
                </h3>
              </div>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="newPassword"
                        type={showPasswords ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="confirmPassword"
                        type={showPasswords ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPasswords(!showPasswords)}
                      >
                        {showPasswords
                          ? (
                              <EyeOff className="size-4" />
                            )
                          : (
                              <Eye className="size-4" />
                            )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleChangePassword}
                  disabled={
                    isChangingPassword
                    || !newPassword
                    || newPassword !== confirmPassword
                  }
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30"
                >
                  {isChangingPassword
                    ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      )
                    : (
                        <Key className="mr-2 size-4" />
                      )}
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
