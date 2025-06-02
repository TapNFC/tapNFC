'use client';

import { motion } from 'framer-motion';
import {
  Bell,
  CreditCard,
  Database,
  Key,
  Monitor,
  Moon,
  Palette,
  Save,
  Settings,
  Shield,
  Sun,
  Trash2,
  User,
  Webhook,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

type SettingsSection = 'general' | 'appearance' | 'notifications' | 'security' | 'integrations' | 'billing';

const settingsSections = [
  { id: 'general', label: 'General', icon: <User className="size-4" /> },
  { id: 'appearance', label: 'Appearance', icon: <Palette className="size-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="size-4" /> },
  { id: 'security', label: 'Security', icon: <Shield className="size-4" /> },
  { id: 'integrations', label: 'Integrations', icon: <Webhook className="size-4" /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard className="size-4" /> },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [settings, setSettings] = useState({
    // General
    companyName: 'QR Studio',
    email: 'admin@qrstudio.com',
    timezone: 'UTC-5',
    language: 'English',

    // Appearance
    theme: 'system',
    primaryColor: '#1A9CFF',

    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    securityAlerts: true,

    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,

    // Integrations
    webhookUrl: '',
    apiKey: 'sk_live_...',

    // Billing
    plan: 'Pro',
    billingEmail: 'billing@qrstudio.com',
  });

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
                <Settings className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Settings
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage your application preferences and configuration
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

      {/* Settings Layout */}
      <div className="relative z-10 grid gap-8 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80">
            <div className="p-6">
              <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
                Settings
              </h3>
              <nav className="space-y-1">
                {settingsSections.map(section => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id as SettingsSection)}
                    className={cn(
                      'flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50',
                    )}
                  >
                    {section.icon}
                    <span>{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </Card>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="space-y-6">
            {/* General Settings */}
            {activeSection === 'general' && (
              <Card className="border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80">
                <div className="p-6">
                  <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
                    General Settings
                  </h3>
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={settings.companyName}
                          onChange={e => handleSettingChange('companyName', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={settings.email}
                          onChange={e => handleSettingChange('email', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input
                          id="timezone"
                          value={settings.timezone}
                          onChange={e => handleSettingChange('timezone', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Input
                          id="language"
                          value={settings.language}
                          onChange={e => handleSettingChange('language', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Appearance Settings */}
            {activeSection === 'appearance' && (
              <Card className="border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80">
                <div className="p-6">
                  <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
                    Appearance Settings
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <Label>Theme</Label>
                      <div className="mt-2 flex space-x-3">
                        {[
                          { id: 'light', label: 'Light', icon: <Sun className="size-4" /> },
                          { id: 'dark', label: 'Dark', icon: <Moon className="size-4" /> },
                          { id: 'system', label: 'System', icon: <Monitor className="size-4" /> },
                        ].map(theme => (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => handleSettingChange('theme', theme.id)}
                            className={cn(
                              'flex items-center space-x-2 rounded-lg border px-4 py-2 transition-colors',
                              settings.theme === theme.id
                                ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600',
                            )}
                          >
                            {theme.icon}
                            <span>{theme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="mt-2 flex items-center space-x-3">
                        <Input
                          id="primaryColor"
                          value={settings.primaryColor}
                          onChange={e => handleSettingChange('primaryColor', e.target.value)}
                          className="font-mono"
                        />
                        <div
                          className="size-10 rounded-lg border-2 border-slate-200 dark:border-slate-700"
                          style={{ backgroundColor: settings.primaryColor }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <Card className="border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80">
                <div className="p-6">
                  <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
                    Notification Settings
                  </h3>
                  <div className="space-y-6">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                      { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications in browser' },
                      { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive marketing and promotional emails' },
                      { key: 'securityAlerts', label: 'Security Alerts', description: 'Receive security-related notifications' },
                    ].map(notification => (
                      <div key={notification.key} className="flex items-center justify-between">
                        <div>
                          <Label>{notification.label}</Label>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {notification.description}
                          </p>
                        </div>
                        <Switch
                          checked={settings[notification.key as keyof typeof settings] as boolean}
                          onCheckedChange={checked => handleSettingChange(notification.key, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <Card className="border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80">
                <div className="p-6">
                  <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
                    Security Settings
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        checked={settings.twoFactorAuth}
                        onCheckedChange={checked => handleSettingChange('twoFactorAuth', checked)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={e => handleSettingChange('sessionTimeout', Number.parseInt(e.target.value))}
                        className="mt-2"
                      />
                    </div>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full">
                        <Key className="mr-2 size-4" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                        <Trash2 className="mr-2 size-4" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Integration Settings */}
            {activeSection === 'integrations' && (
              <Card className="border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80">
                <div className="p-6">
                  <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
                    Integration Settings
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="webhookUrl">Webhook URL</Label>
                      <Input
                        id="webhookUrl"
                        placeholder="https://your-app.com/webhook"
                        value={settings.webhookUrl}
                        onChange={e => handleSettingChange('webhookUrl', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="apiKey">API Key</Label>
                      <div className="mt-2 flex space-x-2">
                        <Input
                          id="apiKey"
                          type="password"
                          value={settings.apiKey}
                          onChange={e => handleSettingChange('apiKey', e.target.value)}
                          className="font-mono"
                        />
                        <Button variant="outline">
                          Regenerate
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                      <div className="flex items-center space-x-2">
                        <Database className="size-5 text-blue-600" />
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">
                          API Documentation
                        </h4>
                      </div>
                      <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                        Learn how to integrate with our API and webhooks
                      </p>
                      <Button variant="outline" size="sm" className="mt-3">
                        View Docs
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Billing Settings */}
            {activeSection === 'billing' && (
              <Card className="border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80">
                <div className="p-6">
                  <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
                    Billing Settings
                  </h3>
                  <div className="space-y-6">
                    <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold">Current Plan</h4>
                          <p className="text-purple-100">
                            {settings.plan}
                            {' '}
                            Plan - $29/month
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          Active
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="billingEmail">Billing Email</Label>
                      <Input
                        id="billingEmail"
                        type="email"
                        value={settings.billingEmail}
                        onChange={e => handleSettingChange('billingEmail', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full">
                        <CreditCard className="mr-2 size-4" />
                        Update Payment Method
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Zap className="mr-2 size-4" />
                        Upgrade Plan
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
