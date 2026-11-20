'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Kanban,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FolderGit2,
  ArrowRight,
  ArrowLeft,
  Search,
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
  useUpdateTaskMutation,
  useGetProjectsListQuery,
  TaskRecord,
} from '@/service/api/superAdminService';

export default function TaskStatusPage() {
  const { data: tasks = [], isLoading, refetch, isFetching } = useGetTasksListQuery();
  const { data: projects = [] } = useGetProjectsListQuery();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const [searchTerm, setSearchTerm] = useState('');
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

  const handleOpenCreate = (defaultStatus?: string) => {
    setFormData({
      ...initialFormState,
      Completion: defaultStatus || 'Not Started',
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleStatusChange = async (task: TaskRecord, newStatus: 'Not Started' | 'In Progress' | 'Completed') => {
    try {
      const completion = newStatus === 'Completed' ? '100%' : newStatus === 'In Progress' ? '50%' : 'Not Started';
      await updateTask({
        id: task.id,
        Status: newStatus,
        Completion: completion,
      }).unwrap();
      toast.success(`Task moved to "${newStatus}"`);
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to update task status');
    }
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
      const derivedStatus =
        formData.Completion === '100%'
          ? 'Completed'
          : formData.Completion === 'Not Started'
          ? 'Not Started'
          : 'In Progress';

      const payload = {
        TaskName: formData.TaskName,
        Task_Name: formData.TaskName,
        Task_Id: `TSK-${Date.now().toString().slice(-4)}`,
        Task_Desc: formData.Task_Desc,
        Start_Date: formData.Start_Date,
        Due_Date: formData.Due_Date,
        Priority: formData.Priority,
        Completion: formData.Completion,
        Status: derivedStatus,
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

  // Filter tasks
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

  // Group into Kanban columns
  const columns = useMemo(() => {
    const notStarted = filteredTasks.filter(
      (t) => (t.Status?.toLowerCase() === 'not started' || t.Completion === 'Not Started' || t.Completion === '0%') && t.Status?.toLowerCase() !== 'completed' && t.Status?.toLowerCase() !== 'in progress'
    );
    const inProgress = filteredTasks.filter(
      (t) => t.Status?.toLowerCase() === 'in progress' || (t.Completion && t.Completion !== 'Not Started' && t.Completion !== '0%' && t.Completion !== '100%' && t.Status?.toLowerCase() !== 'completed')
    );
    const completed = filteredTasks.filter(
      (t) => t.Status?.toLowerCase() === 'completed' || t.Completion === '100%'
    );

    return {
      notStarted,
      inProgress,
      completed,
    };
  }, [filteredTasks]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Task Status Board
            </h1>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300">
              {filteredTasks.length} Total Tasks
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Visual Kanban workflow tracking task progression from backlog to completed milestones.
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
            onClick={() => handleOpenCreate('Not Started')}
            className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search tasks in status board..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Kanban Board Columns (3 Columns: Not Started, In Progress, Completed) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {/* Column 1: Not Started */}
        <div className="bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                Not Started
              </h3>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              {columns.notStarted.length}
            </Badge>
          </div>

          <div className="space-y-3 min-h-[400px]">
            {columns.notStarted.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2">
                    {task.TaskName || task.Task_Name}
                  </h4>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {task.Priority || 'Normal'}
                  </Badge>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {task.Task_Desc || task.Task_Description || 'No description provided.'}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {task.Due_Date ? task.Due_Date.split('T')[0] : '—'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStatusChange(task, 'In Progress')}
                    className="h-6 px-2 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                  >
                    Start <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}

            {columns.notStarted.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                No tasks awaiting start
              </div>
            )}
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="bg-blue-50/40 dark:bg-slate-900/60 rounded-xl border border-blue-200/60 dark:border-slate-800 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-blue-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                In Progress
              </h3>
            </div>
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-mono text-xs">
              {columns.inProgress.length}
            </Badge>
          </div>

          <div className="space-y-3 min-h-[400px]">
            {columns.inProgress.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2">
                    {task.TaskName || task.Task_Name}
                  </h4>
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 text-xs shrink-0">
                    {task.Priority || 'Normal'}
                  </Badge>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {task.Task_Desc || task.Task_Description || 'No description provided.'}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStatusChange(task, 'Not Started')}
                    className="h-6 px-1.5 text-xs text-slate-500 hover:text-slate-700"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" /> Back
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStatusChange(task, 'Completed')}
                    className="h-6 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  >
                    Complete <CheckCircle2 className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}

            {columns.inProgress.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-blue-200/50 dark:border-slate-800 rounded-lg">
                No active tasks in progress
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Completed */}
        <div className="bg-emerald-50/30 dark:bg-slate-900/60 rounded-xl border border-emerald-200/50 dark:border-slate-800 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200/50 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                Completed
              </h3>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-mono text-xs">
              {columns.completed.length}
            </Badge>
          </div>

          <div className="space-y-3 min-h-[400px]">
            {columns.completed.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow opacity-90"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-through decoration-slate-400 line-clamp-2">
                    {task.TaskName || task.Task_Name}
                  </h4>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 text-xs shrink-0">
                    Done
                  </Badge>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {task.Task_Desc || task.Task_Description || 'Milestone achieved.'}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 100% Done
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStatusChange(task, 'In Progress')}
                    className="h-6 px-1.5 text-xs text-slate-500 hover:text-slate-700"
                  >
                    Reopen
                  </Button>
                </div>
              </div>
            ))}

            {columns.completed.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-emerald-200/50 dark:border-slate-800 rounded-lg">
                No completed tasks logged
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Creation Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>New Task Item</DialogTitle>
            <DialogDescription>
              Assign deliverable targets and target deadlines directly onto the status board.
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

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="Task_Desc">Description</Label>
                <textarea
                  id="Task_Desc"
                  rows={3}
                  placeholder="Task scope details..."
                  value={formData.Task_Desc}
                  onChange={(e) => setFormData({ ...formData, Task_Desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
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
                {isCreating ? 'Creating...' : 'Create Task'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
