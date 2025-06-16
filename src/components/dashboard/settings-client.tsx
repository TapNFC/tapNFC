'use client';

import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Key,
  Save,
  User,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SettingsClient() {
  const [settings, setSettings] = useState({
    name: 'Alex Johnson',
    email: 'alex@company.com',
    timezone: 'UTC-5',
    language: 'English',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Simulate API call - settings saved successfully
    // TODO: Implement actual API call to save settings
  };

  return (
    <div className="min-h-full space-y-8 p-8 py-2">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-80 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 blur-3xl" />
      </div>

      {/* Header */}
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

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:from-purple-600 hover:to-pink-700 hover:shadow-xl hover:shadow-purple-500/30"
            >
              <Save className="mr-2 size-4" />
              Save Changes
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Settings Content */}
      <div className="relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Profile Settings Card */}
          <Card className="mb-6 border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80">
            <div className="p-6">
              <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
                Profile Information
              </h3>
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
                      onChange={e => handleSettingChange('email', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={settings.timezone}
                      onChange={e => handleSettingChange('timezone', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Input
                      id="language"
                      value={settings.language}
                      onChange={e => handleSettingChange('language', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Password Settings Card */}
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
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="currentPassword"
                        type={showPasswords ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPasswords(!showPasswords)}
                      >
                        {showPasswords ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
