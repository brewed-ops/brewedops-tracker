// TaskManager.jsx - Task Manager with Pomodoro Timer
// Uses shadcn/ui components exclusively
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Plus, Play, Pause, ArrowCounterClockwise, Clock, CheckCircle, Circle, Timer, Trash, X,
  Calendar, Coffee, Target, Lightning, TrendUp, ListChecks, SpinnerGap, WarningCircle,
  RadioButton, Warning, Fire, FileText
} from '@phosphor-icons/react';
import { supabase } from '../lib/supabase';

// shadcn/ui components
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// BRAND CONFIGURATION
const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };

// Priority config with icons instead of emojis
const PRIORITY_CONFIG = {
  low: { color: '#22c55e', label: 'Low', icon: Circle },
  medium: { color: '#f59e0b', label: 'Medium', icon: RadioButton },
  high: { color: '#ef4444', label: 'High', icon: Fire },
};

// Status config
const STATUS_CONFIG = {
  todo: { label: 'To Do', icon: ListChecks },
  'in-progress': { label: 'In Progress', icon: TrendUp },
};

// Responsive hook
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  return matches;
};

// ============================================
// POMODORO TIMER COMPONENT
// ============================================
const PomodoroTimer = ({ activeTask, onSessionComplete, isMobile }) => {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef(null);

  const times = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
  const colors = { focus: BRAND.blue, short: BRAND.green, long: '#a855f7' };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === 'focus' && activeTask) {
        onSessionComplete(activeTask.id, 25);
        setSessionsCompleted((s) => s + 1);
        if (Notification.permission === 'granted') {
          new Notification('Pomodoro Complete!', { body: `Great job! Time for a ${sessionsCompleted % 4 === 3 ? 'long' : 'short'} break.` });
        }
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, mode, activeTask, sessionsCompleted, onSessionComplete]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(times[newMode]);
    setIsRunning(false);
  };

  const reset = () => {
    setTimeLeft(times[mode]);
    setIsRunning(false);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = ((times[mode] - timeLeft) / times[mode]) * 100;
  const timerSize = isMobile ? 160 : 200;
  const timerRadius = isMobile ? 70 : 90;

  return (
    <Card className="flex flex-col">
      <CardContent className="p-4 flex flex-col flex-1">
        {activeTask && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 mb-4">
            <div className="size-2 rounded-full bg-green-500 animate-pulse" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground">Working on:</p>
              <p className="text-sm font-medium truncate">{activeTask.title}</p>
            </div>
          </div>
        )}

        {/* Mode Tabs */}
        <Tabs value={mode} onValueChange={switchMode} className="mb-4">
          <TabsList className="w-full grid grid-cols-3 h-9">
            <TabsTrigger value="focus" className="text-xs gap-1">
              <Lightning className="size-3" />
              Focus
            </TabsTrigger>
            <TabsTrigger value="short" className="text-xs gap-1">
              <Coffee className="size-3" />
              Short
            </TabsTrigger>
            <TabsTrigger value="long" className="text-xs gap-1">
              <Timer className="size-3" />
              Long
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Timer Circle */}
        <div className="flex justify-center flex-1 items-center">
          <div className="relative" style={{ width: timerSize, height: timerSize }}>
            <svg className="w-full h-full -rotate-90">
              <circle cx={timerSize/2} cy={timerSize/2} r={timerRadius} fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
              <circle
                cx={timerSize/2} cy={timerSize/2} r={timerRadius} fill="none" stroke={colors[mode]} strokeWidth="6" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * timerRadius} strokeDashoffset={2 * Math.PI * timerRadius * (1 - progress / 100)}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("font-bold tabular-nums", isMobile ? "text-4xl" : "text-5xl")}>
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </span>
              <span className="text-xs mt-1" style={{ color: colors[mode] }}>
                {mode === 'focus' ? 'Focus Time' : mode === 'short' ? 'Short Break' : 'Long Break'}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mt-4">
          <Button
            size="lg"
            onClick={() => setIsRunning(!isRunning)}
            disabled={mode === 'focus' && !activeTask}
            className={cn("rounded-full", isMobile ? "size-14" : "size-16")}
            style={{ backgroundColor: colors[mode] }}
          >
            {isRunning ? <Pause className="size-6" /> : <Play className="size-6 ml-0.5" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={reset}
            className={cn("rounded-full self-center", isMobile ? "size-10" : "size-12")}
          >
            <ArrowCounterClockwise className="size-4" />
          </Button>
        </div>

        {/* Sessions Counter */}
        <div className="flex items-center justify-center gap-1 mt-4 pt-4 border-t">
          <Badge variant="secondary" className="text-xs">
            <Target className="size-3 mr-1" />
            {sessionsCompleted} sessions today
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// COMPACT TASK CARD
// ============================================
const TaskCard = ({ task, onUpdate, onDelete, onSelect, isSelected, isMobile, isUpdating }) => {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const PriorityIcon = priority.icon;
  
  const statusConfig = {
    todo: { label: 'To Do', color: '#71717a' },
    'in-progress': { label: 'In Progress', color: BRAND.blue },
    done: { label: 'Done', color: BRAND.green },
  };
  const status = statusConfig[task.status] || statusConfig.todo;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md mb-2",
        isSelected && "ring-2 ring-primary",
        isUpdating && "opacity-50"
      )}
      onClick={() => onSelect(task)}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          {/* Status Circle */}
          <div
            className="size-5 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              border: task.status !== 'done' ? `2px solid ${status.color}` : 'none',
              backgroundColor: task.status === 'done' ? BRAND.green : task.status === 'in-progress' ? BRAND.blue + '20' : 'transparent',
            }}
            onClick={(e) => {
              e.stopPropagation();
              const nextStatus = task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo';
              onUpdate({ ...task, status: nextStatus });
            }}
          >
            {task.status === 'done' && <CheckCircle className="size-5 text-white" />}
            {task.status === 'in-progress' && <div className="size-1.5 rounded-full" style={{ backgroundColor: BRAND.blue }} />}
          </div>

          {/* Title & Notes */}
          <div className="flex-1 min-w-0">
            <p className={cn(
              "font-medium text-sm truncate",
              task.status === 'done' && "line-through text-muted-foreground"
            )}>
              {task.title}
            </p>
            {task.notes && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {task.notes}
              </p>
            )}
          </div>

          {/* Right side: Status Badge, Priority, Due Date, Delete */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Status Badge */}
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 hidden sm:flex"
              style={{ color: status.color, borderColor: status.color + '50' }}
            >
              {status.label}
            </Badge>

            {/* Due Date */}
            {task.due_date && (
              <span className={cn(
                "text-[10px] flex items-center gap-1 hidden md:flex",
                new Date(task.due_date) < new Date() && task.status !== 'done' ? "text-destructive" : "text-muted-foreground"
              )}>
                <Calendar className="size-3" />
                {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}

            {/* Priority Badge */}
            <Badge
              variant="secondary"
              className="text-[10px] uppercase gap-0.5 px-1.5"
              style={{ color: priority.color, backgroundColor: priority.color + '15' }}
            >
              <PriorityIcon className="size-3" />
              {!isMobile && priority.label}
            </Badge>

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="icon"
              disabled={isUpdating}
              onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
              className="size-7 text-muted-foreground hover:text-destructive"
            >
              {isUpdating ? <SpinnerGap className="size-3 animate-spin" /> : <Trash className="size-3" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// ADD TASK DIALOG (with Notes)
// ============================================
const AddTaskDialog = ({ open, onOpenChange, onAdd }) => {
  const [newTask, setNewTask] = useState({
    title: '', notes: '', priority: 'medium', status: 'todo', due_date: '',
  });

  const handleAdd = () => {
    if (newTask.title.trim()) {
      onAdd(newTask);
      setNewTask({ title: '', notes: '', priority: 'medium', status: 'todo', due_date: '' });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>Create a new task to track your work.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="What needs to be done?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={newTask.notes}
              onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
              placeholder="Add any additional details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Circle className="size-3 text-green-500" />
                      <span>Low</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <RadioButton className="size-3 text-amber-500" />
                      <span>Medium</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Fire className="size-3 text-red-500" />
                      <span>High</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={newTask.status} onValueChange={(v) => setNewTask({ ...newTask, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">
                    <div className="flex items-center gap-2">
                      <ListChecks className="size-3 text-muted-foreground" />
                      <span>To Do</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="in-progress">
                    <div className="flex items-center gap-2">
                      <TrendUp className="size-3 text-blue-500" />
                      <span>In Progress</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input
              type="date"
              value={newTask.due_date}
              onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!newTask.title.trim()}>Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ============================================
// COMPLETED TASKS HISTORY
// ============================================
const CompletedTasksHistory = ({ tasks, onReopen, onDelete }) => {
  const completedTasks = tasks
    .filter(t => t.status === 'done')
    .sort((a, b) => new Date(b.completed_at || 0) - new Date(a.completed_at || 0));

  if (completedTasks.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 text-center">
          <CheckCircle className="size-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No completed tasks yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <CheckCircle className="size-4" style={{ color: BRAND.green }} />
          Completed Tasks
        </CardTitle>
        <CardDescription className="text-xs">
          {completedTasks.length} task{completedTasks.length !== 1 ? 's' : ''} completed
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-[200px]">
          <div className="px-4 pb-4 space-y-2">
            {completedTasks.map(task => (
              <div 
                key={task.id} 
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <CheckCircle className="size-4 flex-shrink-0 mt-0.5" style={{ color: BRAND.green }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground line-through truncate">
                        {task.title}
                      </p>
                      {task.notes && (
                        <p className="text-[10px] text-muted-foreground/70 truncate mt-0.5">
                          {task.notes}
                        </p>
                      )}
                      {task.completed_at && (
                        <p className="text-[10px] text-muted-foreground/50 mt-1">
                          {new Date(task.completed_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      title="Reopen task"
                      onClick={() => onReopen(task)}
                    >
                      <ArrowCounterClockwise className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 hover:text-destructive"
                      title="Delete task"
                      onClick={() => onDelete(task.id)}
                    >
                      <Trash className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// ============================================
// MAIN TASK MANAGER COMPONENT
// ============================================
const TaskManager = ({ user, isDark, clients = [] }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filter, setFilter] = useState('todo');
  const [activeTask, setActiveTask] = useState(null);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const isMobile = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 1280px)');

  const fetchTasks = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createTask = async (newTask) => {
    if (!user?.id) return;
    try {
      setError(null);
      const taskData = {
        user_id: user.id,
        title: newTask.title.trim(),
        notes: newTask.notes?.trim() || null,
        priority: newTask.priority,
        status: newTask.status,
        due_date: newTask.due_date || null,
        time_tracked: 0,
      };
      const { data, error: insertError } = await supabase.from('tasks').insert([taskData]).select().single();
      if (insertError) throw insertError;
      setTasks([data, ...tasks]);
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task.');
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      setUpdatingTaskId(updatedTask.id);
      setError(null);
      const updateData = { ...updatedTask };
      if (updatedTask.status === 'done' && tasks.find(t => t.id === updatedTask.id)?.status !== 'done') {
        updateData.completed_at = new Date().toISOString();
      } else if (updatedTask.status !== 'done') {
        updateData.completed_at = null;
      }
      const { data, error: updateError } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', updatedTask.id)
        .select()
        .single();
      if (updateError) throw updateError;
      setTasks(tasks.map(t => (t.id === data.id ? data : t)));
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task.');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      setUpdatingTaskId(taskId);
      setError(null);
      const { error: deleteError } = await supabase.from('tasks').delete().eq('id', taskId);
      if (deleteError) throw deleteError;
      setTasks(tasks.filter(t => t.id !== taskId));
      if (activeTask?.id === taskId) setActiveTask(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task.');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const reopenTask = async (task) => {
    await updateTask({ ...task, status: 'todo', completed_at: null });
  };

  const handlePomodoroComplete = async (taskId, minutes) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const newTime = (task.time_tracked || 0) + minutes;
    try {
      await supabase.from('tasks').update({ time_tracked: newTime }).eq('id', taskId);
      setTasks(tasks.map(t => (t.id === taskId ? { ...t, time_tracked: newTime } : t)));
    } catch (err) {
      console.error('Error updating time:', err);
    }
  };

  useEffect(() => { fetchTasks(); }, [fetchTasks]);
  useEffect(() => { if (Notification.permission === 'default') Notification.requestPermission(); }, []);

  const filteredTasks = tasks.filter(task => task.status === filter);
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    totalTime: tasks.reduce((a, t) => a + (t.time_tracked || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <SpinnerGap className="size-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-4 w-full", !isMobile && "p-6")}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={cn("font-bold mb-1", isMobile ? "text-2xl" : "text-3xl")}>Task Manager</h1>
        <p className="text-sm text-muted-foreground">Manage your tasks and track time with Pomodoro</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2 text-sm">
          <WarningCircle className="size-4" />
          {error}
        </div>
      )}

      {/* Stats */}
      <div className={cn("mb-6", isMobile ? "flex gap-3 overflow-x-auto pb-2 -mx-4 px-4" : "grid grid-cols-5 gap-4")}>
        {[
          { label: 'TOTAL', value: stats.total, icon: Target },
          { label: 'TO DO', value: stats.todo, icon: Circle },
          { label: 'PROGRESS', value: stats.inProgress, icon: TrendUp, color: BRAND.blue },
          { label: 'DONE', value: stats.done, icon: CheckCircle, color: BRAND.green },
          { label: 'TIME', value: `${Math.floor(stats.totalTime / 60)}h`, icon: Clock },
        ].map((stat, i) => (
          <Card key={i} className={cn("py-4", isMobile && "min-w-[120px] flex-shrink-0")}>
            <CardContent className="p-4 text-center">
              <p className="text-xs font-semibold text-muted-foreground flex items-center justify-center gap-1.5 tracking-wide">
                <stat.icon className="size-4" style={{ color: stat.color }} />
                {stat.label}
              </p>
              <p className="text-3xl font-bold mt-2" style={{ color: stat.color }}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className={cn("grid gap-6", !isTablet && "grid-cols-[1fr_320px]")}>
        {/* Left Column - Tasks */}
        <div className="space-y-4">
          {/* Mobile Timer */}
          {isTablet && <PomodoroTimer activeTask={activeTask} onSessionComplete={handlePomodoroComplete} isMobile={isMobile} />}
          
          {/* Filter & Add */}
          <Card>
            <CardContent className="px-4 py-2">
              <div className={cn("flex gap-3", isMobile ? "flex-col" : "items-center justify-between")}>
                <Tabs value={filter} onValueChange={setFilter} className={isMobile ? "w-full" : ""}>
                  <TabsList>
                    <TabsTrigger value="todo" className="text-sm px-4">
                      To Do {stats.todo > 0 && `(${stats.todo})`}
                    </TabsTrigger>
                    <TabsTrigger value="in-progress" className="text-sm px-4">
                      Progress {stats.inProgress > 0 && `(${stats.inProgress})`}
                    </TabsTrigger>
                    <TabsTrigger value="done" className="text-sm px-4">
                      Done {stats.done > 0 && `(${stats.done})`}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button onClick={() => setShowAddDialog(true)} className="gap-1.5">
                  <Plus className="size-4" /> Add Task
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Task List */}
          <Card>
            <CardContent className="p-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8">
                  <ListChecks className="size-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {filter === 'todo' ? 'No tasks to do. Add one to get started!' : 
                     filter === 'in-progress' ? 'No tasks in progress.' : 
                     'No completed tasks yet.'}
                  </p>
                </div>
              ) : (
                <ScrollArea className={cn(isMobile ? "max-h-[400px]" : "max-h-[500px]")}>
                  {filteredTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={updateTask}
                      onDelete={deleteTask}
                      onSelect={setActiveTask}
                      isSelected={activeTask?.id === task.id}
                      isMobile={isMobile}
                      isUpdating={updatingTaskId === task.id}
                    />
                  ))}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Desktop only */}
        {!isTablet && (
          <div className="flex flex-col">
            {/* Pomodoro Timer */}
            <PomodoroTimer activeTask={activeTask} onSessionComplete={handlePomodoroComplete} isMobile={isMobile} />

            {/* Tips */}
            <Card className="mt-4" style={{ backgroundColor: BRAND.blue + '08', borderColor: BRAND.blue + '20' }}>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-3" style={{ color: BRAND.blue }}>
                  <Lightning className="size-4" /> Pomodoro Tips
                </h3>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li>Select a task before starting</li>
                  <li>Work 25 min, break 5 min</li>
                  <li>Long break after 4 sessions</li>
                </ul>
              </CardContent>
            </Card>

            {/* Completed Tasks History */}
            <div className="mt-4">
              <CompletedTasksHistory 
                tasks={tasks} 
                onReopen={reopenTask} 
                onDelete={deleteTask} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Add Task Dialog */}
      <AddTaskDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={createTask} />
    </div>
  );
};

export default TaskManager;
