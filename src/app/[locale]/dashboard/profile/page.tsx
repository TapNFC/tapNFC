'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  Camera,
  Edit,
  Globe,
  Key,
  Save,
  Shield,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
  joinDate: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  qrCodesCreated: number;
  totalScans: number;
  templatesUsed: number;
};

const mockUser: UserProfile = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@company.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  bio: 'Digital marketing professional passionate about QR code innovation and customer engagement.',
  avatar: '',
  joinDate: '2023-06-15',
  plan: 'Pro',
  qrCodesCreated: 247,
  totalScans: 15420,
  templatesUsed: 12,
};

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(mockUser);

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-full space-y-8 p-8">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-80 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-3xl" />
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
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-2 shadow-lg">
                <User className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Profile
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {!isEditing
              ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl hover:shadow-blue-500/30"
                  >
                    <Edit className="mr-2 size-5" />
                    Edit Profile
                  </Button>
                )
              : (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="mr-2 size-4" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700">
                      <Save className="mr-2 size-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
          </motion.div>
        </div>
      </motion.div>

      <div className="relative z-10 grid gap-8">
        {/* Left Column - Profile Info */}
        <div className="space-y-6 ">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-slate-200/60 bg-white/80 p-6 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80">
              <div className="mb-6 flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="size-24">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-semibold text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="icon"
                      className="absolute -bottom-2 -right-2 size-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Camera className="size-4" />
                    </Button>
                  )}
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-3">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {user.name}
                    </h2>

                  </div>
                  <p className="mb-3 text-slate-600 dark:text-slate-400">
                    {user.email}
                  </p>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="mr-1 size-4" />
                    Joined
                    {' '}
                    {new Date(user.joinDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">
                      Full Name
                    </Label>
                    {isEditing
                      ? (
                          <Input
                            id="name"
                            value={editedUser.name}
                            onChange={e => setEditedUser({ ...editedUser, name: e.target.value })}
                            className="mt-1"
                          />
                        )
                      : (
                          <p className="mt-1 text-slate-900 dark:text-white">{user.name}</p>
                        )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                      Email Address
                    </Label>
                    {isEditing
                      ? (
                          <Input
                            id="email"
                            type="email"
                            value={editedUser.email}
                            onChange={e => setEditedUser({ ...editedUser, email: e.target.value })}
                            className="mt-1"
                          />
                        )
                      : (
                          <p className="mt-1 text-slate-900 dark:text-white">{user.email}</p>
                        )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300">
                      Phone Number
                    </Label>
                    {isEditing
                      ? (
                          <Input
                            id="phone"
                            value={editedUser.phone}
                            onChange={e => setEditedUser({ ...editedUser, phone: e.target.value })}
                            className="mt-1"
                          />
                        )
                      : (
                          <p className="mt-1 text-slate-900 dark:text-white">{user.phone}</p>
                        )}
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-slate-700 dark:text-slate-300">
                      Location
                    </Label>
                    {isEditing
                      ? (
                          <Input
                            id="location"
                            value={editedUser.location}
                            onChange={e => setEditedUser({ ...editedUser, location: e.target.value })}
                            className="mt-1"
                          />
                        )
                      : (
                          <p className="mt-1 text-slate-900 dark:text-white">{user.location}</p>
                        )}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="bio" className="text-slate-700 dark:text-slate-300">
                  Bio
                </Label>
                {isEditing
                  ? (
                      <Textarea
                        id="bio"
                        value={editedUser.bio}
                        onChange={e => setEditedUser({ ...editedUser, bio: e.target.value })}
                        className="mt-1"
                        rows={3}
                      />
                    )
                  : (
                      <p className="mt-1 text-slate-900 dark:text-white">{user.bio}</p>
                    )}
              </div>
            </Card>
          </motion.div>

          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-slate-200/60 bg-white/80 p-6 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80">
              <div className="mb-6 flex items-center space-x-3">
                <div className="rounded-lg bg-gradient-to-br from-red-500/10 to-orange-500/10 p-2">
                  <Shield className="size-5 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Security & Privacy
                </h3>
              </div>

              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Key className="mr-3 size-4" />
                  Change Password
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Globe className="mr-3 size-4" />
                  Two-Factor Authentication
                </Button>

                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  <Trash2 className="mr-3 size-4" />
                  Delete Account
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
