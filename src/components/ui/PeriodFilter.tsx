'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Input } from './input';

export type PeriodPreset =
  | 'Today'
  | 'Yesterday'
  | 'This Week'
  | 'Last Week'
  | 'This Month'
  | 'Last Month'
  | 'This Quarter'
  | 'Last Quarter'
  | 'This Year'
  | 'Last Year'
  | 'Custom';

export interface CustomPreset {
  label: string;
  getRange: () => string;
}

interface PeriodFilterProps {
  value: string;
  period: PeriodPreset | string;
  onChange: (dateRange: string, selectedPeriod: string) => void;
  className?: string;
  customPresets?: CustomPreset[];
  hideCustomDate?: boolean;
  dropdownOnly?: boolean;
  style?: React.CSSProperties;
}

const parseDateString = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.trim().split(' ');
  if (parts.length !== 3) return '';
  const day = parts[0].padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIdx = months.indexOf(parts[1]);
  if (monthIdx === -1) return '';
  const month = String(monthIdx + 1).padStart(2, '0');
  const year = parts[2];
  return `${year}-${month}-${day}`;
};

const formatDateString = (yyyyMmDd: string): string => {
  if (!yyyyMmDd) return '';
  const parts = yyyyMmDd.split('-');
  if (parts.length !== 3) return '';
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[monthIdx];
  const day = String(parseInt(parts[2], 10)).padStart(2, '0');
  return `${day} ${month} ${year}`;
};

export const getPeriodRange = (selectedPeriod: PeriodPreset): string => {
  const today = new Date();

  const formatDate = (d: Date) => {
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  switch (selectedPeriod) {
    case 'Today': {
      return `${formatDate(today)} - ${formatDate(today)}`;
    }
    case 'Yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return `${formatDate(yesterday)} - ${formatDate(yesterday)}`;
    }
    case 'This Week': {
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // start on Monday
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
    case 'Last Week': {
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1) - 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
    case 'This Month': {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
    case 'Last Month': {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
    case 'This Quarter': {
      const quarter = Math.floor(today.getMonth() / 3);
      const start = new Date(today.getFullYear(), quarter * 3, 1);
      const end = new Date(today.getFullYear(), (quarter + 1) * 3, 0);
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
    case 'Last Quarter': {
      let quarter = Math.floor(today.getMonth() / 3) - 1;
      let year = today.getFullYear();
      if (quarter < 0) {
        quarter = 3;
        year -= 1;
      }
      const start = new Date(year, quarter * 3, 1);
      const end = new Date(year, (quarter + 1) * 3, 0);
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
    case 'This Year': {
      const start = new Date(today.getFullYear(), 0, 1);
      const end = new Date(today.getFullYear(), 11, 31);
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
    case 'Last Year': {
      const start = new Date(today.getFullYear() - 1, 0, 1);
      const end = new Date(today.getFullYear() - 1, 11, 31);
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
    default:
      return '';
  }
};

const presets: PeriodPreset[] = [
  'Today',
  'Yesterday',
  'This Week',
  'Last Week',
  'This Month',
  'Last Month',
  'This Quarter',
  'Last Quarter',
  'This Year',
  'Last Year',
  'Custom',
];

export function PeriodFilter({
  value,
  period,
  onChange,
  className = '',
  customPresets = [],
  hideCustomDate = false,
  dropdownOnly = false,
  style
}: PeriodFilterProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePresetChange = (presetLabel: string) => {
    if (presetLabel === 'Custom') {
      onChange(value, 'Custom');
      setShowDropdown(false);
      return;
    }

    const custom = customPresets.find(p => p.label === presetLabel);
    if (custom) {
      onChange(custom.getRange(), presetLabel);
      setShowDropdown(false);
      return;
    }

    const calculatedRange = getPeriodRange(presetLabel as PeriodPreset);
    onChange(calculatedRange, presetLabel);
    setShowDropdown(false);
  };

  const [startPart = '', endPart = ''] = value.split(' - ');
  const startDateVal = parseDateString(startPart);
  const endDateVal = parseDateString(endPart);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const formatted = formatDateString(val) || 'Start Date';
    onChange(`${formatted} - ${endPart || 'End Date'}`, 'Custom');
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const formatted = formatDateString(val) || 'End Date';
    onChange(`${startPart || 'Start Date'} - ${formatted}`, 'Custom');
  };

  return (
    <div
      ref={containerRef}
      className={`flex items-center gap-2 bg-white dark:bg-slate-900 border dark:border-slate-800 p-1.5 shadow-xs relative ${className}`}
      style={{ borderRadius: '5%', ...style }}
    >
      <div className="h-7 w-7 bg-slate-50 dark:bg-slate-850 flex items-center justify-center shrink-0" style={{ borderRadius: '5%' }}>
        <Calendar className="h-4 w-4 text-slate-500" />
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="text-xs font-bold px-2 pr-6 text-slate-755 dark:text-slate-200 bg-transparent border-0 p-0 focus:outline-none w-[100px] text-left cursor-pointer flex items-center justify-between"
        >
          <span className="truncate">{period}</span>
          <ChevronDown className="h-3 w-3 absolute right-1.5 top-1/2 -translate-y-1/2 opacity-70" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-3 w-40 rounded-2xl bg-white dark:bg-slate-955 border dark:border-slate-850 shadow-lg py-1.5 z-40 text-left text-xs font-bold text-slate-755 dark:text-slate-200 max-h-60 overflow-y-auto">
            {customPresets.length > 0 ? (
              customPresets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handlePresetChange(p.label)}
                  className={`w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-left transition-colors cursor-pointer block ${period === p.label ? 'text-blue-600 dark:text-blue-400 font-extrabold' : ''
                    }`}
                >
                  {p.label}
                </button>
              ))
            ) : (
              presets.filter(p => !(hideCustomDate && p === 'Custom')).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePresetChange(p)}
                  className={`w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-left transition-colors cursor-pointer block ${period === p ? 'text-blue-600 dark:text-blue-400 font-extrabold' : ''
                    }`}
                >
                  {p}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {!dropdownOnly && (
        <>
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />

          {period === 'Custom' ? (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDateVal}
                onChange={handleStartDateChange}
                className="text-xs font-bold text-slate-750 dark:text-slate-200 bg-transparent border-0 p-0 focus:outline-none w-[110px] cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-bold">to</span>
              <input
                type="date"
                value={endDateVal}
                onChange={handleEndDateChange}
                className="text-xs font-bold text-slate-750 dark:text-slate-200 bg-transparent border-0 p-0 focus:outline-none w-[110px] cursor-pointer"
              />
            </div>
          ) : (
            <input
              type="text"
              value={value}
              disabled
              className="text-xs font-bold px-2 text-slate-750 dark:text-slate-200 bg-transparent border-0 p-0 focus:outline-none w-[170px] opacity-80 cursor-not-allowed"
            />
          )}
        </>
      )}
    </div>
  );
}

interface ReportPeriodFilterProps {
  selectedPeriod: string;
  setSelectedPeriod: (val: string) => void;
  options: string[];
  applyPeriod: (val: string) => void;
  customDate: boolean;
  fromDate: string | null;
  toDate: string | null;
  setFromDate: (val: string) => void;
  setToDate: (val: string) => void;
}

export default function ReportPeriodFilter({
  selectedPeriod,
  setSelectedPeriod,
  options,
  applyPeriod,
  customDate,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}: ReportPeriodFilterProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-bold text-slate-800 dark:text-slate-300">
          Choose a Period <span className="text-red-500">*</span>
        </Label>
        <Select
          value={selectedPeriod}
          onValueChange={(val) => {
            setSelectedPeriod(val || '');
            applyPeriod(val || '');
          }}
        >
          <SelectTrigger className="h-9 text-xs font-semibold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent className="z-50">
            {options.map((option) => (
              <SelectItem key={option} value={option} className="text-xs">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {customDate && (
        <div className="grid grid-cols-2 gap-3 mt-1.5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-bold text-slate-800 dark:text-slate-300">From</Label>
            <Input
              type="date"
              value={fromDate || ""}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-9 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-bold text-slate-800 dark:text-slate-300">To</Label>
            <Input
              type="date"
              value={toDate || ""}
              onChange={(e) => setToDate(e.target.value)}
              className="h-9 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

