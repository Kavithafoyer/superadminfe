'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Clock,
  Briefcase,
  AlertCircle,
  Eye,
  CheckSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  useGetTasksListQuery,
  useCreateTaskMutation,
  useGetProjectsListQuery,
  TaskRecord,
} from '@/service/api/superAdminService';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function TaskCalendarPage() {
  const { data: tasks = [], isLoading, refetch, isFetching } = useGetTasksListQuery();
  const { data: projects = [] } = useGetProjectsListQuery();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedTask, setSelectedTask] = useState<TaskRecord | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Strictly empty string initial state for inputs
  const [formData, setFormData] = useState({
    Task_Name: '',
    Description: '',
    Project: '',
    Priority: 'Medium',
    Status: 'Not Started',
    Assign_To: '',
    Start_Date: '',
    Due_Date: '',
    Estimated_Hours: '',
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: {
      date: Date;
      dateString: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }[] = [];

    const todayStr = new Date().toISOString().split('T')[0];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const d = new Date(year, month - 1, dayNum);
      const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      days.push({
        date: d,
        dateString,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: dateString === todayStr,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const d = new Date(year, month, i);
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        date: d,
        dateString,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: dateString === todayStr,
      });
    }

    // Next month padding to complete 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      days.push({
        date: d,
        dateString,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: dateString === todayStr,
      });
    }

    return days;
  }, [year, month]);

  // Map tasks to dates
  const tasksByDate = useMemo(() => {
    const map = new Map<string, TaskRecord[]>();
    tasks.forEach((task) => {
      const dStr = (task.Due_Date || task.Start_Date || '').split('T')[0];
      if (dStr) {
        if (!map.has(dStr)) {
          map.set(dStr, []);
        }
        map.get(dStr)!.push(task);
      }
    });
    return map;
  }, [tasks]);

  const handleOpenCreateForDate = (dateString: string) => {
    setFormData({
      Task_Name: '',
      Description: '',
      Project: '',
      Priority: 'Medium',
      Status: 'Not Started',
      Assign_To: '',
      Start_Date: dateString,
      Due_Date: dateString,
      Estimated_Hours: '',
    });
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Task_Name.trim()) {
      toast.error('Task Name is required');
      return;
    }

    try {
      await createTask({
        Task_Name: formData.Task_Name.trim(),
        Description: formData.Description.trim(),
        Project: formData.Project,
        Priority: formData.Priority,
        Status: formData.Status,
        Assign_To: formData.Assign_To.trim(),
        Start_Date: formData.Start_Date,
        Due_Date: formData.Due_Date,
        Estimated_Hours: formData.Estimated_Hours ? Number(formData.Estimated_Hours) : 0,
      }).unwrap();
      toast.success('Task created successfully');
      setIsCreateOpen(false);
      refetch();
    } catch {
      toast.error('Failed to create task');
    }
  };

  const getPriorityColor = (p?: string) => {
    switch (p?.toLowerCase()) {
      case 'urgent':
      case 'critical':
      case 'high':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'low':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusColor = (s?: string) => {
    switch (s?.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'in progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Task Calendar
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Visual month schedule and timeline of all organization tasks and deadlines
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
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            onClick={() => {
              setFormData({
                Task_Name: '',
                Description: '',
                Project: '',
                Priority: 'Medium',
                Status: 'Not Started',
                Assign_To: '',
                Start_Date: '',
                Due_Date: '',
                Estimated_Hours: '',
              });
              setIsCreateOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Calendar Controls & Navigation Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth} className="h-9 w-9 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday} className="h-9 px-3">
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth} className="h-9 w-9 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-bold text-foreground ml-2">
            {monthName} {year}
          </h2>
        </div>

        {/* View Links */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/task-management/tasks">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
              <CheckSquare className="h-3.5 w-3.5" />
              List
            </Button>
          </Link>
          <Link href="/task-management/status">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
              Status Board
            </Button>
          </Link>
          <Link href="/task-management/gantt">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
              Gantt Chart
            </Button>
          </Link>
          <Button variant="default" size="sm" className="gap-1.5 text-xs bg-blue-600 text-white hover:bg-blue-700">
            <CalendarIcon className="h-3.5 w-3.5" />
            Calendar
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center font-semibold text-xs text-muted-foreground py-2.5">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="tracking-wide">
              {day}
            </div>
          ))}
        </div>

        {/* Day Cells Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-border">
          {calendarDays.map((d, idx) => {
            const dayTasks = tasksByDate.get(d.dateString) || [];
            return (
              <div
                key={idx}
                className={`min-h-[120px] p-2 flex flex-col justify-between transition-colors ${
                  !d.isCurrentMonth
                    ? 'bg-muted/10 text-muted-foreground/60'
                    : 'bg-card text-foreground hover:bg-muted/20'
                } ${d.isToday ? 'ring-2 ring-purple-600 ring-inset bg-blue-500/5' : ''}`}
              >
                {/* Cell Header */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-semibold rounded-full h-6 w-6 flex items-center justify-center ${
                      d.isToday
                        ? 'bg-blue-600 text-white'
                        : d.isCurrentMonth
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {d.dayNumber}
                  </span>
                  <button
                    onClick={() => handleOpenCreateForDate(d.dateString)}
                    title={`Add task on ${d.dateString}`}
                    className="opacity-0 hover:opacity-100 group-hover:opacity-100 p-1 text-muted-foreground hover:text-blue-600 transition-opacity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Tasks List */}
                <div className="space-y-1 overflow-y-auto max-h-[90px] pr-0.5">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => {
                        setSelectedTask(task);
                        setIsViewOpen(true);
                      }}
                      className="group cursor-pointer text-left text-xs p-1.5 rounded border border-border/80 bg-background hover:border-blue-500 hover:shadow-xs transition-all"
                    >
                      <div className="font-medium truncate text-foreground group-hover:text-blue-600">
                        {task.Task_Name}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`text-[10px] px-1 py-0.2 rounded font-medium border ${getPriorityColor(
                            task.Priority
                          )}`}
                        >
                          {task.Priority}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate">
                          {task.Status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-muted-foreground text-right mt-1">
                  {dayTasks.length > 0 ? `${dayTasks.length} task${dayTasks.length > 1 ? 's' : ''}` : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View Task Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Task Details
            </DialogTitle>
            <DialogDescription>Full information for selected task</DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4 py-2">
              <div>
                <h3 className="text-base font-bold text-foreground">{selectedTask.Task_Name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ID: #{selectedTask.id} • Created: {selectedTask.Created_At || 'N/A'}
                </p>
              </div>

              {selectedTask.Description && (
                <div className="bg-muted/40 p-3 rounded-lg border border-border">
                  <span className="text-xs font-semibold text-muted-foreground uppercase block mb-1">
                    Description
                  </span>
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {selectedTask.Description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Project</span>
                  <span className="font-medium text-foreground">
                    {selectedTask.Project_Name || selectedTask.Project || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Assigned To</span>
                  <span className="font-medium text-foreground">
                    {selectedTask.Assign_To || 'Unassigned'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Priority</span>
                  <Badge variant="outline" className={`mt-0.5 ${getPriorityColor(selectedTask.Priority)}`}>
                    {selectedTask.Priority}
                  </Badge>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Status</span>
                  <Badge variant="outline" className={`mt-0.5 ${getStatusColor(selectedTask.Status)}`}>
                    {selectedTask.Status}
                  </Badge>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Start Date</span>
                  <span className="font-medium text-foreground">
                    {selectedTask.Start_Date || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Due Date</span>
                  <span className="font-medium text-foreground">
                    {selectedTask.Due_Date || '—'}
                  </span>
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

      {/* Add Task Dialog - Blank Initial Values */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Add New Task
            </DialogTitle>
            <DialogDescription>
              Create a new task with schedule and assignment details
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="Task_Name">
                Task Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="Task_Name"
                placeholder="Enter task title"
                value={formData.Task_Name}
                onChange={(e) => setFormData({ ...formData, Task_Name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="Description">Description</Label>
              <textarea
                id="Description"
                rows={3}
                placeholder="Task details and deliverables"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.Description}
                onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="Project">Project</Label>
                <select
                  id="Project"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.Project}
                  onChange={(e) => setFormData({ ...formData, Project: e.target.value })}
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="Assign_To">Assign To</Label>
                <Input
                  id="Assign_To"
                  placeholder="Assignee name or email"
                  value={formData.Assign_To}
                  onChange={(e) => setFormData({ ...formData, Assign_To: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="Priority">Priority</Label>
                <select
                  id="Priority"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.Priority}
                  onChange={(e) => setFormData({ ...formData, Priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="Status">Status</Label>
                <select
                  id="Status"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.Status}
                  onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="Start_Date">Start Date</Label>
                <Input
                  id="Start_Date"
                  type="date"
                  value={formData.Start_Date}
                  onChange={(e) => setFormData({ ...formData, Start_Date: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="Due_Date">Due Date</Label>
                <Input
                  id="Due_Date"
                  type="date"
                  value={formData.Due_Date}
                  onChange={(e) => setFormData({ ...formData, Due_Date: e.target.value })}
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="Estimated_Hours">Estimated Hours</Label>
                <Input
                  id="Estimated_Hours"
                  type="number"
                  placeholder="e.g. 8"
                  value={formData.Estimated_Hours}
                  onChange={(e) => setFormData({ ...formData, Estimated_Hours: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isCreating}
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
