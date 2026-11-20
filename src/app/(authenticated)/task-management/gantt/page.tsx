'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BarChart2,
  Calendar,
  Clock,
  Plus,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  FolderGit2,
  AlertCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  useGetTasksListQuery,
  useCreateTaskMutation,
  useGetProjectsListQuery,
  TaskRecord,
} from '@/service/api/superAdminService';

export default function TaskGanttChartPage() {
  const { data: tasks = [], isLoading, refetch, isFetching } = useGetTasksListQuery();
  const { data: projects = [] } = useGetProjectsListQuery();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [scaleType, setScaleType] = useState<'days' | 'weeks' | 'months'>('weeks');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State strictly starting with EMPTY values (no static dummy values)
  const initialFormState = {
    TaskName: '',
    Task_Desc: '',
    Start_Date: '',
    Due_Date: '',
    Priority: '',
    Completion: 'Not Started',
    Project: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleOpenCreate = () => {
    setFormData(initialFormState);
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.TaskName.trim()) errors.TaskName = 'Task name is required';
    if (!formData.Project.trim()) errors.Project = 'Project is required';
    if (!formData.Priority) errors.Priority = 'Priority is required';
    if (!formData.Start_Date) errors.Start_Date = 'Start date is required';
    if (!formData.Due_Date) errors.Due_Date = 'Due date is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        TaskName: formData.TaskName,
        Task_Name: formData.TaskName,
        Task_Id: `TSK-${Date.now().toString().slice(-4)}`,
        Task_Desc: formData.Task_Desc,
        Start_Date: formData.Start_Date,
        Due_Date: formData.Due_Date,
        Priority: formData.Priority,
        Completion: formData.Completion,
        Status: formData.Completion === '100%' ? 'Completed' : 'In Progress',
        Project: formData.Project,
        Project_Name: formData.Project,
      };

      await createTask(payload).unwrap();
      toast.success('Task created successfully');
      setIsFormOpen(false);
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || 'Failed to create task');
    }
  };

  // Timeline bounds calculation (finding earliest start and latest due dates)
  const timelineDates = useMemo(() => {
    const today = new Date();
    let minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    let maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);

    tasks.forEach((t) => {
      if (t.Start_Date) {
        const d = new Date(t.Start_Date);
        if (d < minDate) minDate = d;
      }
      if (t.Due_Date) {
        const d = new Date(t.Due_Date);
        if (d > maxDate) maxDate = d;
      }
    });

    const totalDays = Math.max(1, Math.round((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)));
    return { minDate, maxDate, totalDays };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const name = t.TaskName || t.Task_Name || '';
      const proj = t.Project_Name || (typeof t.Project === 'string' ? t.Project : t.Project?.name || '');
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proj.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [tasks, searchTerm]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Task Gantt Chart
            </h1>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300">
              Interactive Timeline
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Visual project scheduling chart plotting tasks across calendar milestones and duration spans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Timeline Task
          </Button>
        </div>
      </div>

      {/* Control Bar: Scale & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search tasks in Gantt chart..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium mr-1">Scale:</span>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {(['days', 'weeks', 'months'] as const).map((scale) => (
              <button
                key={scale}
                type="button"
                onClick={() => setScaleType(scale)}
                className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                  scaleType === scale
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {scale}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Gantt Chart Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Timeline Range:</span>
            <span>{timelineDates.minDate.toISOString().split('T')[0]}</span>
            <span>to</span>
            <span>{timelineDates.maxDate.toISOString().split('T')[0]}</span>
            <span className="text-slate-400">({timelineDates.totalDays} days span)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" /> High</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Normal</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-400" /> Low</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {isLoading ? (
            <div className="py-16 text-center text-slate-500">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-600" />
              Loading Gantt timeline...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <BarChart2 className="h-8 w-8 text-slate-400 mx-auto mb-2 opacity-50" />
              No tasks found for timeline display.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const startDate = task.Start_Date ? new Date(task.Start_Date) : timelineDates.minDate;
              const dueDate = task.Due_Date ? new Date(task.Due_Date) : new Date(startDate.getTime() + 7 * 86400000);

              const startOffsetDays = Math.max(0, (startDate.getTime() - timelineDates.minDate.getTime()) / (1000 * 60 * 60 * 24));
              const taskDurationDays = Math.max(1, (dueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

              const leftPercent = Math.min(95, Math.max(0, (startOffsetDays / timelineDates.totalDays) * 100));
              const widthPercent = Math.min(100 - leftPercent, Math.max(5, (taskDurationDays / timelineDates.totalDays) * 100));

              const priorityColor =
                task.Priority === 'High'
                  ? 'bg-rose-500'
                  : task.Priority === 'Normal'
                  ? 'bg-indigo-500'
                  : 'bg-slate-400';

              const completionPct = task.Completion || '0%';

              return (
                <div
                  key={task.id}
                  className="p-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center gap-4"
                >
                  {/* Task Metadata Column */}
                  <div className="w-full md:w-64 shrink-0">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {task.TaskName || task.Task_Name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <span className="font-mono">{task.Task_Id || `TSK-${task.id}`}</span>
                      <span>•</span>
                      <span>{task.Project_Name || (typeof task.Project === 'string' ? task.Project : 'General')}</span>
                    </div>
                  </div>

                  {/* Visual Gantt Bar Track */}
                  <div className="flex-1 relative h-8 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center">
                    <div
                      className={`absolute top-1 bottom-1 rounded-md shadow-xs transition-all flex items-center justify-between px-2 text-[11px] font-medium text-white ${priorityColor}`}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    >
                      <span className="truncate">{task.TaskName || task.Task_Name}</span>
                      <span className="shrink-0 font-mono ml-1 text-[10px] bg-black/20 px-1 rounded">
                        {completionPct}
                      </span>
                    </div>
                  </div>

                  {/* Date Bounds */}
                  <div className="w-full md:w-44 shrink-0 text-right text-xs font-mono text-slate-500 flex md:flex-col justify-between items-end">
                    <span>{startDate.toISOString().split('T')[0]}</span>
                    <span className="text-slate-400">→ {dueDate.toISOString().split('T')[0]}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Task Creation Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Timeline Task</DialogTitle>
            <DialogDescription>
              Plot a new task with start and due date bounds onto the Gantt schedule.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="TaskName">Task Name <span className="text-red-500">*</span></Label>
                <Input
                  id="TaskName"
                  placeholder="Task title..."
                  value={formData.TaskName}
                  onChange={(e) => setFormData({ ...formData, TaskName: e.target.value })}
                />
                {formErrors.TaskName && (
                  <p className="text-xs text-red-500">{formErrors.TaskName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="Project">Project <span className="text-red-500">*</span></Label>
                <select
                  id="Project"
                  value={formData.Project}
                  onChange={(e) => setFormData({ ...formData, Project: e.target.value })}
                  className="w-full h-9 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                  <option value="Infrastructure Scaling">Infrastructure Scaling</option>
                  <option value="Security & Compliance">Security & Compliance</option>
                  <option value="Sales Billing Module">Sales Billing Module</option>
                </select>
                {formErrors.Project && (
                  <p className="text-xs text-red-500">{formErrors.Project}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="Priority">Priority <span className="text-red-500">*</span></Label>
                <select
                  id="Priority"
                  value={formData.Priority}
                  onChange={(e) => setFormData({ ...formData, Priority: e.target.value })}
                  className="w-full h-9 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                </select>
                {formErrors.Priority && (
                  <p className="text-xs text-red-500">{formErrors.Priority}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="Start_Date">Start Date <span className="text-red-500">*</span></Label>
                <Input
                  id="Start_Date"
                  type="date"
                  value={formData.Start_Date}
                  onChange={(e) => setFormData({ ...formData, Start_Date: e.target.value })}
                />
                {formErrors.Start_Date && (
                  <p className="text-xs text-red-500">{formErrors.Start_Date}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="Due_Date">Due Date <span className="text-red-500">*</span></Label>
                <Input
                  id="Due_Date"
                  type="date"
                  value={formData.Due_Date}
                  onChange={(e) => setFormData({ ...formData, Due_Date: e.target.value })}
                />
                {formErrors.Due_Date && (
                  <p className="text-xs text-red-500">{formErrors.Due_Date}</p>
                )}
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isCreating ? 'Saving...' : 'Add to Timeline'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
