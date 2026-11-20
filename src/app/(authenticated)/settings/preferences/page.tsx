'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Save,
  RefreshCw,
  ShieldAlert,
  Calendar,
  Lock,
  EyeOff,
  Clock,
  KeyRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  useGetSystemPreferencesQuery,
  useSaveSystemPreferencesMutation,
  SystemPreferenceRecord,
} from '@/service/api/superAdminService';

const DATE_FORMATS = [
  { label: 'YYYY-MM-DD (2026-11-17)', value: 'yyyy-mm-dd' },
  { label: 'MM-DD-YYYY (11-17-2026)', value: 'mm-dd-yyyy' },
  { label: 'DD-MM-YYYY (17-11-2026)', value: 'dd-mm-yyyy' },
];

export default function SystemPreferencesPage() {
  const { data: initialPrefs, isLoading, refetch, isFetching } = useGetSystemPreferencesQuery();
  const [savePreferences, { isLoading: isSaving }] = useSaveSystemPreferencesMutation();

  const [formData, setFormData] = useState<SystemPreferenceRecord>({
    DateFormat: 'yyyy-mm-dd',
    Password: '',
    ResetPassword: false,
    ForcePasswordChange: false,
    PasswordExpiryDays: 90,
    LoginValidityType: 'DAYS',
    ValidFrom: '',
    ValidTo: '',
    LockAfterFailedAttempts: 5,
    hide_display_negative_sentiment: false,
    hide_display_inactive_leads: false,
    hide_display_inactive_users: false,
  });

  useEffect(() => {
    if (initialPrefs) {
      setFormData({
        ...initialPrefs,
        ValidFrom: initialPrefs.ValidFrom ? initialPrefs.ValidFrom.split('T')[0] : '',
        ValidTo: initialPrefs.ValidTo ? initialPrefs.ValidTo.split('T')[0] : '',
      });
    }
  }, [initialPrefs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await savePreferences(formData).unwrap();
      toast.success('System preferences and security policies saved successfully');
      refetch();
    } catch {
      toast.error('Failed to update system preferences');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Sliders className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              System Preference
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Global system policies: Date presentation, credential rotation, account lockout limits, and UI visibility filters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Regional & Formatting */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Calendar className="h-4 w-4 text-blue-600" />
            Regional & Date Presentation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="DateFormat">System Date Format</Label>
              <select
                id="DateFormat"
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.DateFormat || 'yyyy-mm-dd'}
                onChange={(e) => setFormData({ ...formData, DateFormat: e.target.value })}
              >
                {DATE_FORMATS.map((df) => (
                  <option key={df.value} value={df.value}>
                    {df.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Security & Authentication Policy */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Lock className="h-4 w-4 text-blue-600" />
            Security & Authentication Policy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="defaultPassword">Default New User Password</Label>
              <Input
                id="defaultPassword"
                type="text"
                placeholder="Default@123"
                value={formData.Password || ''}
                onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="LockAfterFailedAttempts">Failed Login Lockout Threshold</Label>
              <Input
                id="LockAfterFailedAttempts"
                type="number"
                min={1}
                max={20}
                placeholder="5"
                value={formData.LockAfterFailedAttempts ?? 5}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    LockAfterFailedAttempts: Number(e.target.value) || 0,
                  })
                }
              />
              <span className="text-xs text-muted-foreground">
                Locks account temporarily after consecutive failed login attempts
              </span>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="PasswordExpiryDays">Password Expiry (Days)</Label>
              <Input
                id="PasswordExpiryDays"
                type="number"
                min={0}
                placeholder="90"
                value={formData.PasswordExpiryDays ?? 90}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    PasswordExpiryDays: Number(e.target.value) || 0,
                  })
                }
              />
              <span className="text-xs text-muted-foreground">
                Set to 0 to disable automatic credential expiration
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.ForcePasswordChange}
                  onChange={(e) =>
                    setFormData({ ...formData, ForcePasswordChange: e.target.checked })
                  }
                  className="rounded border-input text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="font-medium text-foreground">
                  Force Password Change on First Sign-in
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.ResetPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, ResetPassword: e.target.checked })
                  }
                  className="rounded border-input text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="font-medium text-foreground">
                  Allow Users to Self-Reset Password via Email Link
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Login Validity & Access Period */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Clock className="h-4 w-4 text-blue-600" />
            Session Scope & Validity Period
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="LoginValidityType">Validity Calculation Mode</Label>
              <select
                id="LoginValidityType"
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.LoginValidityType || 'DAYS'}
                onChange={(e) =>
                  setFormData({ ...formData, LoginValidityType: e.target.value })
                }
              >
                <option value="DAYS">By Days (Rolling Duration)</option>
                <option value="DATE">By Explicit Date Range</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ValidFrom">Valid From</Label>
              <Input
                id="ValidFrom"
                type="date"
                value={formData.ValidFrom || ''}
                onChange={(e) => setFormData({ ...formData, ValidFrom: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ValidTo">Valid To</Label>
              <Input
                id="ValidTo"
                type="date"
                value={formData.ValidTo || ''}
                onChange={(e) => setFormData({ ...formData, ValidTo: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Display & Sentiment Visibility Filters */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
            <EyeOff className="h-4 w-4 text-blue-600" />
            UI Visibility & Sentiment Masking
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.hide_display_negative_sentiment}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hide_display_negative_sentiment: e.target.checked,
                  })
                }
                className="rounded border-input text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="font-medium text-foreground">
                Hide Negative Sentiment Indicators in Public Feedback Dashboards
              </span>
            </label>

            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.hide_display_inactive_leads}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hide_display_inactive_leads: e.target.checked,
                  })
                }
                className="rounded border-input text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="font-medium text-foreground">
                Hide Inactive and Disqualified Leads from Default Table Views
              </span>
            </label>

            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.hide_display_inactive_users}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hide_display_inactive_users: e.target.checked,
                  })
                }
                className="rounded border-input text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="font-medium text-foreground">
                Hide Inactive and Deactivated Users from CRM User Selectors
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </form>
    </div>
  );
}
