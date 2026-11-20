'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  Sparkles,
  Edit3,
  Save,
  X,
  Lock,
  Globe,
  Compass,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function UserProfilePage() {
  const { user, updateUserProfile, selectedAcademicYear } = useStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    location: '',
    bio: '',
    jobTitle: '',
  });

  // Sync state with user data
  useEffect(() => {
    if (user) {
      setFormState({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        jobTitle: user.jobTitle || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }
    updateUserProfile(formState);
    setIsEditing(false);
    toast.success('Profile details updated successfully!');
  };

  const handleCancel = () => {
    if (user) {
      setFormState({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        jobTitle: user.jobTitle || '',
      });
    }
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 text-left p-4 md:p-6 pb-12">
      {/* Back to Dashboard bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 gap-1.5 cursor-pointer text-xs font-bold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
        <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          User Settings
        </span>
      </div>

      {/* Banner + Avatar Section */}
      <div className="relative bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        {/* Cover Graphic Banner */}
        <div className="h-32 md:h-44 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />

        {/* Avatar, Info and Edit Trigger */}
        <div className="p-6 md:p-8 pt-0 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-10 md:-mt-14 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <Avatar className="h-24 w-24 md:h-28 md:w-28 border-4 border-white dark:border-slate-900 shadow-md">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-2xl">
                {user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1.5 pb-2">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">
                {user.name}
              </h1>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                <Briefcase className="h-3.5 w-3.5" /> {user.jobTitle || '-'}
              </p>
            </div>
          </div>

          <div className="pb-2">
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="gap-2 cursor-pointer font-bold text-xs px-4 h-9.5 text-white"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <Edit3 className="h-4 w-4" /> Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-slate-100 dark:border-slate-800 shadow-xs rounded-2xl bg-white dark:bg-slate-900/50">
            <CardHeader className="border-b dark:border-slate-800 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" /> Account Information
              </CardTitle>
              <CardDescription className="text-xs">Manage your personal credentials and location contacts.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-bold text-slate-700 dark:text-slate-300">Display Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleInputChange}
                        className="h-10 text-xs border-slate-200"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle" className="text-xs font-bold text-slate-700 dark:text-slate-300">Job Title</Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        value={formState.jobTitle}
                        onChange={handleInputChange}
                        className="h-10 text-xs border-slate-200"
                        placeholder="e.g. Administrator"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleInputChange}
                        className="h-10 text-xs border-slate-200"
                        placeholder="e.g. +91 99999 88888"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-xs font-bold text-slate-700 dark:text-slate-300">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formState.location}
                        onChange={handleInputChange}
                        className="h-10 text-xs border-slate-200"
                        placeholder="e.g. Bangalore, India"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-xs font-bold text-slate-700 dark:text-slate-300">Personal Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formState.bio}
                      onChange={handleInputChange}
                      className="text-xs min-h-[90px] border-slate-200"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-2 border-t dark:border-slate-800">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="h-9 text-xs font-bold px-4 cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="h-9 text-xs font-bold gap-1.5 px-5 text-white cursor-pointer"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      <Save className="h-3.5 w-3.5" /> Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Meta items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100/40 dark:border-slate-850">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</p>
                        <p className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-0.5">{user.email || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100/40 dark:border-slate-850">
                      <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Phone Number</p>
                        <p className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-0.5">{user.phone || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100/40 dark:border-slate-850">
                      <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Location</p>
                        <p className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-0.5">{user.location || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100/40 dark:border-slate-850">
                      <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Default Language</p>
                        <p className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-0.5">English (US)</p>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5 p-4 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/20">
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Personal Bio</p>
                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                      {user.bio || '-'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Workspace metadata */}
        <div className="space-y-6">
          <Card className="border border-slate-100 dark:border-slate-800 shadow-xs rounded-2xl bg-white dark:bg-slate-900/50">
            <CardHeader className="border-b dark:border-slate-800 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Building2 className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" /> Organization Workspace
              </CardTitle>
              <CardDescription className="text-xs">Your current workspace metadata scope.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Organization / School</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 block">{user.workspace || '-'}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Workspace Role</span>
                  <span className="text-xs font-bold text-slate-855 dark:text-slate-300 mt-1 block">{user.workspaceRole || '-'}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Active Academic Session</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-450 mt-1 block">{selectedAcademicYear || '-'}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">System Access Clearance</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 block capitalize flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {user.role || '-'} Level Access
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-100 dark:border-slate-800 shadow-xs rounded-2xl bg-white dark:bg-slate-900/50">
            <CardHeader className="border-b dark:border-slate-800 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Lock className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" /> Security & Session
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <p>Your session is encrypted and authenticated through token key validations.</p>
              <div className="pt-2 border-t dark:border-slate-800 flex justify-between text-[10px] font-extrabold text-slate-400 uppercase">
                <span>Account Status</span>
                <span className="text-emerald-500">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
