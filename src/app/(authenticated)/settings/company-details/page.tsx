'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Save,
  RefreshCw,
  Landmark,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Search,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  useGetCompanyDetailsQuery,
  useUpdateCompanyDetailsMutation,
  CompanyDetailsRecord,
} from '@/service/api/superAdminService';

const MONTHS = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

const CURRENCIES = [
  { code: 'INR', label: 'INR (₹) - Indian Rupee' },
  { code: 'USD', label: 'USD ($) - US Dollar' },
  { code: 'EUR', label: 'EUR (€) - Euro' },
  { code: 'GBP', label: 'GBP (£) - British Pound' },
  { code: 'JPY', label: 'JPY (¥) - Japanese Yen' },
  { code: 'BRL', label: 'BRL (R$) - Brazilian Real' },
];

const DATE_FORMATS = [
  { label: 'YYYY-MM-DD (2026-11-17)', value: 'yyyy-MM-dd' },
  { label: 'DD-MM-YYYY (17-11-2026)', value: 'dd-MM-yyyy' },
  { label: 'MM-DD-YYYY (11-17-2026)', value: 'MM-dd-yyyy' },
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function EditCompanyDetailsPage() {
  const { data: initialDetails, isLoading, refetch, isFetching } = useGetCompanyDetailsQuery();
  const [updateCompanyDetails, { isLoading: isUpdating }] = useUpdateCompanyDetailsMutation();

  const [activeTab, setActiveTab] = useState<'general' | 'address' | 'bank' | 'hours'>('general');
  const [isSearchingIfsc, setIsSearchingIfsc] = useState(false);

  // Form State initialized from query or defaults
  const [formData, setFormData] = useState<CompanyDetailsRecord>({
    company_name: '',
    registration_no: '',
    email: '',
    phone_number: '',
    website: '',
    currency: 'INR',
    currency_format: 'Rupees - ₹',
    timezone: 'Asia/Kolkata (GMT+05:30)',
    fiscal_year_start: 4,
    date_format: 'yyyy-MM-dd',
    address: {
      building_door_no: '',
      street_name: '',
      area_name: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
    },
    bank_details: {
      ifsc_code: '',
      bank_name: '',
      account_number: '',
      account_type: 'Current Account',
      swift_code: '',
      branch: '',
      bank_address: '',
    },
    business_hours: {
      start_time: '09:00',
      end_time: '18:00',
      working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
  });

  useEffect(() => {
    if (initialDetails) {
      setFormData({
        ...initialDetails,
        address: {
          ...formData.address,
          ...initialDetails.address,
        },
        bank_details: {
          ...formData.bank_details,
          ...initialDetails.bank_details,
        },
        business_hours: {
          ...formData.business_hours,
          ...initialDetails.business_hours,
        },
      });
    }
  }, [initialDetails]);

  // Razorpay IFSC Auto-lookup feature from superadminfe
  const handleIfscLookup = async (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean.length !== 11) return;

    setIsSearchingIfsc(true);
    try {
      const res = await fetch(`https://ifsc.razorpay.com/${clean}`);
      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          bank_details: {
            ...prev.bank_details,
            ifsc_code: clean,
            bank_name: data.BANK || '',
            swift_code: data.BRANCH || '',
            branch: data.BRANCH || '',
            bank_address: data.ADDRESS || '',
          },
        }));
        toast.success(`Found bank: ${data.BANK} (${data.BRANCH})`);
      } else {
        toast.error('Invalid IFSC Code. Please verify');
      }
    } catch {
      toast.error('Could not verify IFSC online');
    } finally {
      setIsSearchingIfsc(false);
    }
  };

  const toggleWorkingDay = (day: string) => {
    setFormData((prev) => {
      const current = prev.business_hours?.working_days || [];
      const updated = current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day];
      return {
        ...prev,
        business_hours: {
          ...prev.business_hours,
          working_days: updated,
        },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company_name.trim()) {
      toast.error('Company Name is required');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Official Email is required');
      return;
    }

    try {
      await updateCompanyDetails(formData).unwrap();
      toast.success('Company details and profile updated successfully');
      refetch();
    } catch {
      toast.error('Failed to update company details');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Company Details
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Maintain legal organization profile, financial settings, registered addresses, and corporate banking details
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
            disabled={isUpdating}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Save className="h-4 w-4" />
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto">
        <Button
          variant={activeTab === 'general' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('general')}
          className={`gap-2 text-xs font-semibold ${
            activeTab === 'general' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          General Profile
        </Button>
        <Button
          variant={activeTab === 'address' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('address')}
          className={`gap-2 text-xs font-semibold ${
            activeTab === 'address' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''
          }`}
        >
          <MapPin className="h-3.5 w-3.5" />
          Registered Address
        </Button>
        <Button
          variant={activeTab === 'bank' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('bank')}
          className={`gap-2 text-xs font-semibold ${
            activeTab === 'bank' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''
          }`}
        >
          <Landmark className="h-3.5 w-3.5" />
          Banking Details
        </Button>
        <Button
          variant={activeTab === 'hours' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('hours')}
          className={`gap-2 text-xs font-semibold ${
            activeTab === 'hours' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          Business Hours
        </Button>
      </div>

      {/* Main Tab Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab 1: General Profile */}
        {activeTab === 'general' && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="text-base font-semibold text-foreground border-b border-border pb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              Corporate Profile & Financial Identity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="company_name">
                  Company Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="company_name"
                  placeholder="Enter corporate entity name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="registration_no">Registration Number / CIN</Label>
                <Input
                  id="registration_no"
                  placeholder="e.g. U72900TN2022PTC150000"
                  value={formData.registration_no || ''}
                  onChange={(e) => setFormData({ ...formData, registration_no: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">
                  Official Email <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone_number">
                  Phone Number <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="phone_number"
                  placeholder="+91 98400 12345"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  placeholder="https://company.com"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="currency">Default Base Currency</Label>
                <select
                  id="currency"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="fiscal_year_start">Fiscal Year Start Month</Label>
                <select
                  id="fiscal_year_start"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={Number(formData.fiscal_year_start) || 4}
                  onChange={(e) => setFormData({ ...formData, fiscal_year_start: Number(e.target.value) })}
                >
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="date_format">Date Format</Label>
                <select
                  id="date_format"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.date_format || 'yyyy-MM-dd'}
                  onChange={(e) => setFormData({ ...formData, date_format: e.target.value })}
                >
                  {DATE_FORMATS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="timezone">System Timezone</Label>
                <Input
                  id="timezone"
                  value={formData.timezone || 'Asia/Kolkata (GMT+05:30)'}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Registered Address */}
        {activeTab === 'address' && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="text-base font-semibold text-foreground border-b border-border pb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              Corporate Headquarters & Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="building_door_no">Building / Door No</Label>
                <Input
                  id="building_door_no"
                  placeholder="e.g. Tower 4, 6th Floor"
                  value={formData.address?.building_door_no || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, building_door_no: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="street_name">Street / Road Name</Label>
                <Input
                  id="street_name"
                  placeholder="e.g. OMR Cyber Corridor"
                  value={formData.address?.street_name || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, street_name: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="area_name">Area / Locality</Label>
                <Input
                  id="area_name"
                  placeholder="e.g. Thoraipakkam"
                  value={formData.address?.area_name || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, area_name: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="e.g. Chennai"
                  value={formData.address?.city || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="state">State / Province</Label>
                <Input
                  id="state"
                  placeholder="e.g. Tamil Nadu"
                  value={formData.address?.state || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="e.g. India"
                  value={formData.address?.country || 'India'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, country: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pincode">Pincode / ZIP Code</Label>
                <Input
                  id="pincode"
                  placeholder="e.g. 600097"
                  value={formData.address?.pincode || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, pincode: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Banking Details */}
        {activeTab === 'bank' && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Landmark className="h-4 w-4 text-blue-600" />
                Corporate Bank Account & Razorpay Verification
              </h3>
              <Badge variant="outline" className="text-xs text-blue-600 border-blue-500/20">
                Live IFSC Verification
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ifsc_code">IFSC Code (11 alphanumeric characters)</Label>
                <div className="relative">
                  <Input
                    id="ifsc_code"
                    placeholder="e.g. HDFC0001234"
                    value={formData.bank_details?.ifsc_code || ''}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setFormData({
                        ...formData,
                        bank_details: { ...formData.bank_details, ifsc_code: val },
                      });
                      if (val.length === 11) {
                        handleIfscLookup(val);
                      }
                    }}
                    className="font-mono uppercase pr-10"
                  />
                  {isSearchingIfsc && (
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-600 absolute right-3 top-3" />
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bank_name">Beneficiary Bank Name</Label>
                <Input
                  id="bank_name"
                  placeholder="Auto-populated or enter bank name"
                  value={formData.bank_details?.bank_name || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bank_details: { ...formData.bank_details, bank_name: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="account_number">Account Number</Label>
                <Input
                  id="account_number"
                  placeholder="Corporate account number"
                  value={formData.bank_details?.account_number || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bank_details: { ...formData.bank_details, account_number: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="account_type">Account Type</Label>
                <select
                  id="account_type"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.bank_details?.account_type || 'Current Account'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bank_details: { ...formData.bank_details, account_type: e.target.value },
                    })
                  }
                >
                  <option value="Current Account">Current Account</option>
                  <option value="Savings Account">Savings Account</option>
                  <option value="Escrow Account">Escrow Account</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="swift_code">Swift / Branch Identifier</Label>
                <Input
                  id="swift_code"
                  placeholder="Branch / Swift code"
                  value={formData.bank_details?.swift_code || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bank_details: { ...formData.bank_details, swift_code: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="branch">Branch Name</Label>
                <Input
                  id="branch"
                  placeholder="Branch locality"
                  value={formData.bank_details?.branch || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bank_details: { ...formData.bank_details, branch: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="bank_address">Bank Full Address</Label>
                <Input
                  id="bank_address"
                  placeholder="Full branch postal address"
                  value={formData.bank_details?.bank_address || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bank_details: { ...formData.bank_details, bank_address: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Business Hours */}
        {activeTab === 'hours' && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="text-base font-semibold text-foreground border-b border-border pb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Standard Working Hours & Operating Days
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="start_time">Shift Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.business_hours?.start_time || '09:00'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      business_hours: { ...formData.business_hours, start_time: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="end_time">Shift End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.business_hours?.end_time || '18:00'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      business_hours: { ...formData.business_hours, end_time: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2 pt-2">
                <Label className="block font-semibold">Active Working Days</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = (formData.business_hours?.working_days || []).includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleWorkingDay(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted/70'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isUpdating}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6"
          >
            <Save className="h-4 w-4" />
            {isUpdating ? 'Saving...' : 'Save Company Details'}
          </Button>
        </div>
      </form>
    </div>
  );
}
