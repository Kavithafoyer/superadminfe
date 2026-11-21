'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  AlertCircle,
  FolderGit2,
  ArrowLeft,
  Save,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { toast } from 'sonner';
import {
  useGetTasksListQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetProjectsListQuery,
  TaskRecord,
} from '@/service/api/superAdminService';

const AVAILABLE_TAGS = ['Urgent', 'High Priority', 'Infrastructure', 'Backend', 'Frontend', 'Security', 'QA Verified', 'Documentation'];

export default function TaskListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const basePath = pathname?.startsWith('/task-management/tasks') ? '/task-management/tasks' : '/task-management';
  const isCreateRoute = pathname?.endsWith('/create') || searchParams.get('mode') === 'create' || searchParams.get('action') === 'create';
  const isEditRoute = pathname?.includes('/edit') || searchParams.get('mode') === 'edit' || searchParams.get('action') === 'edit';
  const routeEditId = (params?.id as string) || (pathname?.includes('/edit/') ? pathname.split('/edit/')[1]?.split('/')[0]?.split('?')[0] : undefined);

  const { data: tasks = [], isLoading, refetch, isFetching } = useGetTasksListQuery();
  const { data: projects = [] } = useGetProjectsListQuery();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  // Full-page view mode: 'list' | 'create' | 'edit' (Route-driven to preserve on refresh)
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const viewMode: 'list' | 'create' | 'edit' = isCreateRoute ? 'create' : (isEditRoute ? 'edit' : internalViewMode);

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // View / Delete Dialogs
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskRecord | null>(null);

  // Form State strictly starting with EMPTY values (no static dummy values)
  const initialFormState = {
    Task_Id: '',
    TaskName: '',
    Task_Desc: '',
    Start_Date: '',
    Due_Date: '',
    Priority: '',
    Completion: '',
    Project: '',
    Assigned_By: '',
    selectedTags: [] as string[],
    internalNotes: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Auto-populate formData when directly visiting or refreshing on an edit page
  useEffect(() => {
    if (isEditRoute && routeEditId && tasks.length > 0) {
      const task = tasks.find((t: any) => String(t.id) === String(routeEditId) || String(t.Task_Id) === String(routeEditId));
      if (task && (!selectedTask || String(selectedTask.id) !== String(task.id))) {
        setSelectedTask(task);
        setFormData({
          Task_Id: task.Task_Id || '',
          TaskName: task.TaskName || task.Task_Name || '',
          Task_Desc: task.Task_Desc || task.Task_Description || '',
          Start_Date: task.Start_Date ? task.Start_Date.split('T')[0] : '',
          Due_Date: task.Due_Date ? task.Due_Date.split('T')[0] : '',
          Priority: task.Priority || '',
          Completion: task.Completion || '',
          Project: task.Project_Name || (typeof task.Project === 'string' ? task.Project : task.Project?.name || ''),
          Assigned_By: typeof task.Assigned_By === 'string' ? task.Assigned_By : task.Assigned_By?.name || '',
          selectedTags: [],
          internalNotes: '',
        });
      }
    }
  }, [isEditRoute, routeEditId, tasks, selectedTask]);

  const handleOpenCreate = () => {
    setSelectedTask(null);
    setFormData(initialFormState);
    setFormErrors({});
    setInternalViewMode('create');
    router.push(`${basePath}/create`);
  };

  const handleOpenEdit = (task: TaskRecord) => {
    setSelectedTask(task);
    setFormData({
      Task_Id: task.Task_Id || '',
      TaskName: task.TaskName || task.Task_Name || '',
      Task_Desc: task.Task_Desc || task.Task_Description || '',
      Start_Date: task.Start_Date ? task.Start_Date.split('T')[0] : '',
      Due_Date: task.Due_Date ? task.Due_Date.split('T')[0] : '',
      Priority: task.Priority || '',
      Completion: task.Completion || '',
      Project: task.Project_Name || (typeof task.Project === 'string' ? task.Project : task.Project?.name || ''),
      Assigned_By: typeof task.Assigned_By === 'string' ? task.Assigned_By : task.Assigned_By?.name || '',
      selectedTags: [],
      internalNotes: '',
    });
    setFormErrors({});
    setInternalViewMode('edit');
    router.push(`${basePath}/edit/${task.id}`);
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    router.push(basePath);
  };

  const handleOpenView = (task: TaskRecord) => {
    setSelectedTask(task);
    setIsViewOpen(true);
  };

  const handleOpenDelete = (task: TaskRecord) => {
    setSelectedTask(task);
    setIsDeleteOpen(true);
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.TaskName.trim()) errors.TaskName = 'Task name is required';
    if (!formData.Project.trim()) errors.Project = 'Project assignment is required';
    if (!formData.Start_Date) errors.Start_Date = 'Start date is required';
    if (!formData.Due_Date) errors.Due_Date = 'Due date is required';
    if (!formData.Priority) errors.Priority = 'Priority is required';
    if (!formData.Completion) errors.Completion = 'Completion status is required';
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
        Task_Id: formData.Task_Id || `TSK-${Date.now().toString().slice(-4)}`,
        Task_Desc: formData.Task_Desc,
        Task_Description: formData.Task_Desc,
        Start_Date: formData.Start_Date,
        Due_Date: formData.Due_Date,
        Priority: formData.Priority,
        Completion: formData.Completion,
        Status: derivedStatus,
        Project: formData.Project,
        Project_Name: formData.Project,
        Assigned_By: formData.Assigned_By,
      };

      if (viewMode === 'edit' && selectedTask) {
        await updateTask({ id: selectedTask.id, ...payload }).unwrap();
        toast.success('Task updated successfully');
      } else {
        await createTask(payload).unwrap();
        toast.success('Task created successfully');
      }

      handleBackToList();
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || 'Failed to save task');
    }
  };

  const handleDeleteRecord = async () => {
    if (!selectedTask) return;
    try {
      await deleteTask({ id: selectedTask.id }).unwrap();
      toast.success('Task deleted successfully');
      setIsDeleteOpen(false);
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to delete task');
    }
  };

  // Filter and search records
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const name = t.TaskName || t.Task_Name || '';
      const taskId = t.Task_Id || '';
      const proj = t.Project_Name || (typeof t.Project === 'string' ? t.Project : t.Project?.name || '');
      const assigned = typeof t.Assigned_By === 'string' ? t.Assigned_By : t.Assigned_By?.name || '';

      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        taskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proj.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assigned.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority =
        priorityFilter === 'all' ? true : t.Priority?.toLowerCase() === priorityFilter.toLowerCase();

      const status = (t.Status || (t.Completion === '100%' ? 'Completed' : 'In Progress')).toLowerCase();
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'completed'
          ? status.includes('completed')
          : statusFilter === 'in_progress'
          ? status.includes('progress')
          : status.includes('not started');

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, searchTerm, priorityFilter, statusFilter]);

  // Pagination calculation
  const totalRecords = filteredTasks.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTasks.slice(start, start + itemsPerPage);
  }, [filteredTasks, currentPage, itemsPerPage]);

  // ----------------------------------------------------------------------
  // FULL-PAGE CREATE / EDIT VIEW (CBS PEGATTO FORMAT, NO POPUPS)
  // ----------------------------------------------------------------------
  if (viewMode === 'create' || viewMode === 'edit') {
    const isEdit = viewMode === 'edit';
    return (
      <form onSubmit={handleSubmitForm} className="space-y-6">
        {/* Top Header Bar matching CBS Pegatto */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleBackToList}
              className="h-9 w-9 rounded-full border border-border bg-background hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <span className="hover:underline cursor-pointer" onClick={handleBackToList}>
                  Task Management
                </span>
                <span>/</span>
                <span className="text-foreground">
                  {isEdit ? 'Edit Task' : 'Create New Task'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                {isEdit ? `Edit Task: ${formData.TaskName || selectedTask?.TaskName || 'Selected Task'}` : 'Create New Task'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToList}
              disabled={isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-[#1574fe] hover:bg-[#0d62e0] text-white gap-2 px-5"
            >
              <Save className="h-4 w-4" />
              {isCreating || isUpdating ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Task'}
            </Button>
          </div>
        </div>

        {/* Two-Column CBS Pegatto Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: TASK INFORMATION */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  TASK INFORMATION
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="TaskName" className="text-xs font-semibold uppercase tracking-wider">
                      TASK NAME <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="TaskName"
                      placeholder="Enter task name..."
                      value={formData.TaskName}
                      onChange={(e) => setFormData({ ...formData, TaskName: e.target.value })}
                      className={formErrors.TaskName ? 'border-red-500' : ''}
                    />
                    {formErrors.TaskName && (
                      <p className="text-xs text-red-500">{formErrors.TaskName}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Project" className="text-xs font-semibold uppercase tracking-wider">
                      PROJECT <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="Project"
                      value={formData.Project}
                      onChange={(e) => setFormData({ ...formData, Project: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
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
                    <Label htmlFor="Priority" className="text-xs font-semibold uppercase tracking-wider">
                      PRIORITY <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="Priority"
                      value={formData.Priority}
                      onChange={(e) => setFormData({ ...formData, Priority: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Priority</option>
                      <option value="Low">Low</option>
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                    {formErrors.Priority && (
                      <p className="text-xs text-red-500">{formErrors.Priority}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Start_Date" className="text-xs font-semibold uppercase tracking-wider">
                      START DATE <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="Start_Date"
                      type="date"
                      value={formData.Start_Date}
                      onChange={(e) => setFormData({ ...formData, Start_Date: e.target.value })}
                      className={formErrors.Start_Date ? 'border-red-500' : ''}
                    />
                    {formErrors.Start_Date && (
                      <p className="text-xs text-red-500">{formErrors.Start_Date}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Due_Date" className="text-xs font-semibold uppercase tracking-wider">
                      DUE DATE <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="Due_Date"
                      type="date"
                      value={formData.Due_Date}
                      onChange={(e) => setFormData({ ...formData, Due_Date: e.target.value })}
                      className={formErrors.Due_Date ? 'border-red-500' : ''}
                    />
                    {formErrors.Due_Date && (
                      <p className="text-xs text-red-500">{formErrors.Due_Date}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: TASK DESCRIPTION */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  TASK DESCRIPTION & INSTRUCTIONS
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  id="Task_Desc"
                  rows={4}
                  placeholder="Enter detailed task instructions, deliverables, requirements..."
                  value={formData.Task_Desc}
                  onChange={(e) => setFormData({ ...formData, Task_Desc: e.target.value })}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: ASSIGNMENT & STATUS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  ASSIGNMENT & PROGRESS
                </h3>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="Assigned_By" className="text-xs font-semibold uppercase tracking-wider">
                    ASSIGNED BY / LEAD
                  </Label>
                  <Input
                    id="Assigned_By"
                    placeholder="Enter assigned lead..."
                    value={formData.Assigned_By}
                    onChange={(e) => setFormData({ ...formData, Assigned_By: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="Completion" className="text-xs font-semibold uppercase tracking-wider">
                    COMPLETION PROGRESS <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="Completion"
                    value={formData.Completion}
                    onChange={(e) => setFormData({ ...formData, Completion: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Completion %</option>
                    <option value="Not Started">Not Started</option>
                    <option value="10%">10%</option>
                    <option value="25%">25%</option>
                    <option value="50%">50%</option>
                    <option value="70%">70%</option>
                    <option value="90%">90%</option>
                    <option value="100%">100% (Completed)</option>
                  </select>
                  {formErrors.Completion && (
                    <p className="text-xs text-red-500">{formErrors.Completion}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Card 2: TAGS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  TAGS SELECTOR
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map((tag) => {
                    const active = formData.selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ${
                          active
                            ? 'bg-[#1574fe] border-[#1574fe] text-white'
                            : 'bg-background border-border text-foreground hover:bg-muted'
                        }`}
                      >
                        {active && '✓ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Card 3: INTERNAL NOTES */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  INTERNAL NOTES
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <Textarea
                  placeholder="Enter internal execution notes or blocker context..."
                  rows={3}
                  value={formData.internalNotes}
                  onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    );
  }

  // ----------------------------------------------------------------------
  // DEFAULT TABLE LIST VIEW
  // ----------------------------------------------------------------------
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Task Management
            </h1>
            <Badge variant="outline" className="bg-blue-50 text-indigo-700 border-indigo-200 dark:bg-blue-950/40 dark:text-indigo-300">
              {totalRecords} Tasks
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Organize operational task assignments, project deliverables, and team execution deadlines.
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
            className="h-9 gap-1.5 bg-[#1574fe] hover:bg-[#0d62e0] text-white font-medium"
          >
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        </div>
      </div>

      {/* Navigation sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-sm font-medium">
        <Link
          href="/task-management/tasks"
          className="px-3 py-1.5 rounded-md bg-blue-50 text-[#1574fe] dark:bg-blue-950/50 dark:text-indigo-400"
        >
          List Tasks
        </Link>
        <Link
          href="/task-management/status"
          className="px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          Task Status
        </Link>
        <Link
          href="/task-management/gantt"
          className="px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          Gantt Chart
        </Link>
        <Link
          href="/task-management/calendar"
          className="px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          Task Calendar
        </Link>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by task name, project, ID, or lead..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="not_started">Not Started</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-xs">
              <tr>
                <th className="py-3 px-4">TASK DETAILS</th>
                <th className="py-3 px-4">PROJECT</th>
                <th className="py-3 px-4">PRIORITY</th>
                <th className="py-3 px-4">PROGRESS</th>
                <th className="py-3 px-4">SCHEDULE</th>
                <th className="py-3 px-4">ASSIGNED BY</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-[#1574fe]" />
                      Loading tasks...
                    </div>
                  </td>
                </tr>
              ) : paginatedTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <p className="font-medium text-slate-600 dark:text-slate-300">No tasks found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or create a new task.</p>
                  </td>
                </tr>
              ) : (
                paginatedTasks.map((task) => {
                  const taskName = task.TaskName || task.Task_Name || 'Untitled Task';
                  const taskId = task.Task_Id || `TSK-${task.id}`;
                  const projectName = task.Project_Name || (typeof task.Project === 'string' ? task.Project : task.Project?.name || 'Unassigned');
                  const assignedBy = typeof task.Assigned_By === 'string' ? task.Assigned_By : task.Assigned_By?.name || 'Unassigned';
                  const priority = task.Priority || 'Normal';
                  const completion = task.Completion || '0%';
                  const isDone = completion === '100%';

                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <CheckSquare className="h-4 w-4 text-indigo-500 shrink-0" />
                          <span>{taskName}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {taskId}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <FolderGit2 className="h-3 w-3 text-slate-400" />
                          {projectName}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className={
                            priority.toLowerCase() === 'high' || priority.toLowerCase() === 'urgent'
                              ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300'
                              : priority.toLowerCase() === 'low'
                              ? 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                              : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                          }
                        >
                          {priority}
                        </Badge>
                      </td>

                      <td className="py-3 px-4">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className={isDone ? 'text-emerald-600 font-semibold' : 'text-slate-600'}>
                              {completion}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isDone ? 'bg-emerald-500' : 'bg-[#1574fe]'}`}
                              style={{ width: completion.includes('%') ? completion : `${completion}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{task.Start_Date ? task.Start_Date.split('T')[0] : '—'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 mt-0.5">
                          <Clock className="h-3 w-3" />
                          <span>Due: {task.Due_Date ? task.Due_Date.split('T')[0] : '—'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-300">
                        {assignedBy}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenView(task)}
                            className="h-8 w-8 text-slate-500 hover:text-[#1574fe]"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(task)}
                            className="h-8 w-8 text-slate-500 hover:text-[#1574fe]"
                            title="Edit Task"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDelete(task)}
                            className="h-8 w-8 text-slate-500 hover:text-rose-600"
                            title="Delete Task"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination strictly without rows-per-page */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-medium text-slate-700 dark:text-slate-300">{totalRecords > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {Math.min(currentPage * itemsPerPage, totalRecords)}
            </span>{' '}
            of <span className="font-medium text-slate-700 dark:text-slate-300">{totalRecords}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 px-2.5 gap-1 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </Button>
            <span className="font-medium text-slate-700 dark:text-slate-300 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 px-2.5 gap-1 text-xs"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
            <DialogDescription>
              Comprehensive information and scheduling bounds for this task item.
            </DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4 pt-2 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="col-span-2">
                  <span className="text-xs text-slate-500">Task Title</span>
                  <p className="font-semibold text-slate-900 dark:text-white text-base">
                    {selectedTask.TaskName || selectedTask.Task_Name || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Task ID</span>
                  <p className="font-medium font-mono text-slate-900 dark:text-white">
                    {selectedTask.Task_Id || `TSK-${selectedTask.id}`}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Project</span>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {selectedTask.Project_Name || (typeof selectedTask.Project === 'string' ? selectedTask.Project : selectedTask.Project?.name || '—')}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Priority</span>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {selectedTask.Priority || 'Normal'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Completion</span>
                  <p className="font-medium text-[#1574fe]">
                    {selectedTask.Completion || '0%'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Start Date</span>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {selectedTask.Start_Date ? selectedTask.Start_Date.split('T')[0] : '—'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Due Date</span>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {selectedTask.Due_Date ? selectedTask.Due_Date.split('T')[0] : '—'}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-slate-500">Description</span>
                  <p className="font-medium text-slate-900 dark:text-white mt-1 p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                    {selectedTask.Task_Desc || selectedTask.Task_Description || 'No description provided.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteRecord}
        loading={isDeleting}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
}
