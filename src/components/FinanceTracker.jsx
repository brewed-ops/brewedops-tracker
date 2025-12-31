// FinanceTracker.jsx - Expense & Budget Tracker with shadcn/ui
// Extracted from App.jsx and converted to use shadcn/ui components
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Plus, Trash2, Edit, Eye, X, Loader2, Download, Upload, Search,
  ChevronDown, ChevronLeft, ChevronRight, Receipt, Banknote, TrendingUp,
  TrendingDown, DollarSign, CreditCard, Wallet, PiggyBank, ArrowUpRight,
  ArrowDownRight, Calendar, Filter, MoreVertical, FileText, Clock,
  CheckCircle2, AlertCircle, BarChart3, PieChart as PieChartIcon,
  Target, Repeat, Bell, Settings, ArrowRight, Minus
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import { supabase } from '@/lib/supabase';
import { getTheme } from '@/lib/theme';
import { useWindowSize } from '@/lib/hooks';
import { formatAmount, cn } from '@/lib/utils';
import {
  CATEGORIES,
  CURRENCIES,
  WALLET_TYPES,
  DEFAULT_WALLETS,
} from '@/lib/constants';

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

// Brand colors
const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };

// Category icons mapping
const CATEGORY_ICONS = {
  utilities: Banknote,
  subscription: Repeat,
  food: Receipt,
  shopping: CreditCard,
  healthcare: Target,
  entertainment: PieChartIcon,
  other: MoreVertical,
};

// ============================================
// STAT CARD COMPONENT
// ============================================
const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, isMobile }) => (
  <Card className={cn("overflow-hidden", isMobile && "min-w-[140px] flex-shrink-0")}>
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase font-semibold tracking-wide text-muted-foreground">{title}</span>
        <div 
          className="size-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: (color || BRAND.blue) + '15' }}
        >
          <Icon className="size-4" style={{ color: color || BRAND.blue }} />
        </div>
      </div>
      <p className="text-2xl font-bold" style={color ? { color } : undefined}>
        {value}
      </p>
      {trend && (
        <div className={cn("flex items-center gap-1 mt-1 text-xs", trend === 'up' ? 'text-green-500' : 'text-red-500')}>
          {trend === 'up' ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          <span>{trendValue}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

// ============================================
// EXPENSE ENTRY ROW COMPONENT
// ============================================
const ExpenseRow = ({ entry, category, onEdit, onDelete, onView, isSelected, onSelect, isMobile }) => {
  const CategoryIcon = CATEGORY_ICONS[entry.type] || CATEGORY_ICONS.other;
  const categoryData = CATEGORIES?.find(c => c.value === entry.type) || { label: entry.type, color: '#71717a' };

  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
        "hover:bg-muted/50",
        isSelected && "bg-primary/5 border-primary/30"
      )}
      onClick={() => onSelect?.(entry.id)}
    >
      {/* Checkbox for selection */}
      <div 
        className={cn(
          "size-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
          isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
        )}
        onClick={(e) => { e.stopPropagation(); onSelect?.(entry.id); }}
      >
        {isSelected && <CheckCircle2 className="size-3 text-primary-foreground" />}
      </div>

      {/* Category Icon */}
      <div 
        className="size-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: categoryData.color + '15' }}
      >
        <CategoryIcon className="size-5" style={{ color: categoryData.color }} />
      </div>

      {/* Entry Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{entry.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0" style={{ color: categoryData.color }}>
            {categoryData.label}
          </Badge>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Calendar className="size-2.5" />
            {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          {entry.recurring && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-0.5">
              <Repeat className="size-2.5" />
              {entry.recurring}
            </Badge>
          )}
        </div>
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0">
        <p className="font-semibold text-sm text-destructive">
          -₱{entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Actions */}
      {!isMobile && (
        <div className="flex items-center gap-1 flex-shrink-0">
          {entry.file && (
            <Button variant="ghost" size="icon" className="size-8" onClick={(e) => { e.stopPropagation(); onView?.(entry); }}>
              <Eye className="size-3.5" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="size-8" onClick={(e) => { e.stopPropagation(); onEdit?.(entry); }}>
            <Edit className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8 hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDelete?.(entry); }}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
};

// ============================================
// WALLET CARD COMPONENT
// ============================================
const WalletCard = ({ wallet, onAddFunds, onWithdraw, onEdit, isFeatured, isMobile }) => {
  const walletType = WALLET_TYPES?.find(t => t.id === wallet.type);
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md cursor-pointer",
      isFeatured && "ring-2 ring-primary"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{wallet.icon || walletType?.icon || '💰'}</span>
            <div>
              <p className="font-semibold text-sm">{wallet.name}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{wallet.type}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="size-8" onClick={() => onEdit?.(wallet)}>
            <Settings className="size-3.5" />
          </Button>
        </div>

        <p className="text-2xl font-bold mb-3" style={{ color: wallet.color || BRAND.green }}>
          ₱{(wallet.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 text-xs gap-1"
            onClick={() => onAddFunds?.(wallet)}
          >
            <Plus className="size-3" /> Add
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 text-xs gap-1"
            onClick={() => onWithdraw?.(wallet)}
          >
            <Minus className="size-3" /> Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// ADD EXPENSE DIALOG
// ============================================
const AddExpenseDialog = ({ open, onOpenChange, onAdd, wallets, categories }) => {
  const [form, setForm] = useState({
    name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: '',
    dueDate: '',
    notes: '',
    recurring: '',
    walletId: '',
  });

  const handleSubmit = () => {
    if (!form.name.trim() || !form.amount || !form.type) return;
    onAdd({
      ...form,
      amount: parseFloat(form.amount),
    });
    setForm({
      name: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      type: '',
      dueDate: '',
      notes: '',
      recurring: '',
      walletId: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>Record a new expense entry.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="expense-name">Expense Name *</Label>
            <Input
              id="expense-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Electricity Bill"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₱</span>
                <Input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                  className="pl-7"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {(categories || CATEGORIES || []).map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span>{cat.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Recurring</Label>
              <Select value={form.recurring} onValueChange={(v) => setForm({ ...form, recurring: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pay from Wallet</Label>
              <Select value={form.walletId} onValueChange={(v) => setForm({ ...form, walletId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select wallet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {(wallets || []).map(w => (
                    <SelectItem key={w.id} value={w.id}>
                      <div className="flex items-center gap-2">
                        <span>{w.icon || '💰'}</span>
                        <span>{w.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.recurring && (
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Notes</Label>
            <Input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Optional notes..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!form.name.trim() || !form.amount || !form.type}>
            Add Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ============================================
// BUDGET PROGRESS COMPONENT
// ============================================
const BudgetProgress = ({ spent, budget, isDark }) => {
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const remaining = budget - spent;
  const isOver = spent > budget;
  const isWarning = percentage >= 80 && !isOver;

  const getColor = () => {
    if (isOver) return '#ef4444';
    if (isWarning) return '#f59e0b';
    return BRAND.green;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Monthly Budget</span>
          <Badge 
            variant={isOver ? "destructive" : isWarning ? "secondary" : "outline"}
            className="text-xs"
          >
            {isOver ? 'Over Budget!' : isWarning ? 'Almost There' : 'On Track'}
          </Badge>
        </div>

        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-2xl font-bold" style={{ color: getColor() }}>
              ₱{spent.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </span>
            <span className="text-sm text-muted-foreground"> / ₱{budget.toLocaleString()}</span>
          </div>
          <span className="text-sm font-semibold" style={{ color: getColor() }}>
            {percentage.toFixed(0)}%
          </span>
        </div>

        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: getColor()
            }}
          />
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          {isOver 
            ? `₱${Math.abs(remaining).toLocaleString()} over budget`
            : `₱${remaining.toLocaleString()} remaining`
          }
        </p>
      </CardContent>
    </Card>
  );
};

// ============================================
// UPCOMING BILLS COMPONENT
// ============================================
const UpcomingBills = ({ bills, onPayBill }) => {
  if (!bills || bills.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bell className="size-4 text-amber-500" />
            Upcoming Bills
          </CardTitle>
          <Badge variant="secondary">{bills.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {bills.slice(0, 5).map(bill => (
              <div 
                key={bill.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 gap-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div 
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center text-xs font-bold",
                      bill.daysUntil <= 3 ? "bg-red-500/20 text-red-500" :
                      bill.daysUntil <= 7 ? "bg-amber-500/20 text-amber-500" :
                      "bg-muted text-muted-foreground"
                    )}
                  >
                    {bill.daysUntil}d
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{bill.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Due: {bill.nextDueDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold">₱{bill.amount.toLocaleString()}</p>
                  <Badge variant="outline" className="text-[10px] capitalize">{bill.recurring}</Badge>
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
// CATEGORY BREAKDOWN CHART
// ============================================
const CategoryBreakdown = ({ data, isDark }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-sm text-muted-foreground">No data yet</p>
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="w-[120px] h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={2}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1.5">
            {data.slice(0, 4).map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium">{((item.value / total) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// MONTHLY TREND CHART
// ============================================
const MonthlyTrend = ({ data, isDark }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Monthly Trend</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-sm text-muted-foreground">No data yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Monthly Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BRAND.blue} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={BRAND.blue} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 11, fill: isDark ? '#a1a1aa' : '#71717a' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 11, fill: isDark ? '#a1a1aa' : '#71717a' }}
                tickFormatter={(v) => `₱${(v/1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDark ? '#18181b' : '#fff',
                  border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value) => [`₱${value.toLocaleString()}`, 'Spent']}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke={BRAND.blue} 
                strokeWidth={2}
                fill="url(#colorAmount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// MAIN FINANCE TRACKER COMPONENT
// ============================================
const FinanceTracker = ({ user, isDark }) => {
  const theme = getTheme(isDark);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width < 1024;

  // Data state
  const [entries, setEntries] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [filterCategory, setFilterCategory] = useState('all');

  // Budget state
  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const saved = localStorage.getItem('monthlyBudget');
    return saved ? parseFloat(saved) : 0;
  });
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  // Edit/Delete state
  const [editingEntry, setEditingEntry] = useState(null);
  const [deletingEntry, setDeletingEntry] = useState(null);

  // ============================================
  // DATA FETCHING
  // ============================================
  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);

      // Fetch expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (expensesError) throw expensesError;

      const transformedExpenses = (expensesData || []).map(expense => ({
        id: expense.id,
        name: expense.name,
        type: expense.category,
        amount: parseFloat(expense.amount),
        date: expense.date,
        dueDate: expense.due_date,
        notes: expense.notes || '',
        recurring: expense.recurring || null,
        walletId: expense.wallet_id || null,
        file: expense.file_name ? {
          name: expense.file_name,
          type: expense.file_type,
          data: expense.file_data
        } : null
      }));

      setEntries(transformedExpenses);

      // Fetch wallets
      const { data: walletsData, error: walletsError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('wallet_id');

      if (!walletsError && walletsData) {
        setWallets(walletsData.map(w => ({
          id: w.wallet_id,
          name: w.name,
          type: w.type,
          balance: parseFloat(w.balance || 0),
          icon: w.icon,
          color: w.color
        })));
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ============================================
  // CRUD OPERATIONS
  // ============================================
  const saveEntry = async (newEntry) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          user_id: user.id,
          user_email: user.email,
          name: newEntry.name,
          amount: newEntry.amount,
          category: newEntry.type,
          date: newEntry.date,
          due_date: newEntry.dueDate || null,
          notes: newEntry.notes || null,
          recurring: newEntry.recurring || null,
          wallet_id: newEntry.walletId || null,
        }])
        .select()
        .single();

      if (error) throw error;

      const savedEntry = {
        id: data.id,
        name: data.name,
        type: data.category,
        amount: parseFloat(data.amount),
        date: data.date,
        dueDate: data.due_date,
        notes: data.notes || '',
        recurring: data.recurring || null,
        walletId: data.wallet_id || null,
      };

      setEntries(prev => [savedEntry, ...prev]);

      // Deduct from wallet if specified
      if (newEntry.walletId) {
        await updateWalletBalance(newEntry.walletId, -newEntry.amount);
      }

      return savedEntry;
    } catch (err) {
      console.error('Error saving entry:', err);
      throw err;
    }
  };

  const deleteEntry = async (id) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error deleting entry:', err);
      throw err;
    }
  };

  const updateWalletBalance = async (walletId, amount) => {
    const wallet = wallets.find(w => w.id === walletId);
    if (!wallet) return;

    const newBalance = wallet.balance + amount;
    
    try {
      await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('wallet_id', walletId)
        .eq('user_id', user.id);

      setWallets(prev => prev.map(w => 
        w.id === walletId ? { ...w, balance: newBalance } : w
      ));
    } catch (err) {
      console.error('Error updating wallet:', err);
    }
  };

  // ============================================
  // COMPUTED VALUES
  // ============================================
  const filteredEntries = useMemo(() => {
    let filtered = entries;
    const now = new Date();

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(query) || 
        e.amount.toString().includes(query)
      );
    }

    // Period filter
    if (filterPeriod === 'today') {
      filtered = filtered.filter(e => new Date(e.date).toDateString() === now.toDateString());
    } else if (filterPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(e => new Date(e.date) >= weekAgo);
    } else if (filterPeriod === 'month') {
      filtered = filtered.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    } else if (filterPeriod === 'year') {
      filtered = filtered.filter(e => new Date(e.date).getFullYear() === now.getFullYear());
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(e => e.type === filterCategory);
    }

    return filtered;
  }, [entries, searchQuery, filterPeriod, filterCategory]);

  const stats = useMemo(() => {
    const now = new Date();
    const todayEntries = entries.filter(e => new Date(e.date).toDateString() === now.toDateString());
    const monthEntries = entries.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    return {
      today: todayEntries.reduce((sum, e) => sum + e.amount, 0),
      month: monthEntries.reduce((sum, e) => sum + e.amount, 0),
      total: entries.reduce((sum, e) => sum + e.amount, 0),
      count: entries.length,
      avgPerDay: monthEntries.length > 0 
        ? monthEntries.reduce((sum, e) => sum + e.amount, 0) / new Date().getDate()
        : 0,
    };
  }, [entries]);

  const categoryData = useMemo(() => {
    const totals = {};
    filteredEntries.forEach(e => {
      totals[e.type] = (totals[e.type] || 0) + e.amount;
    });
    return (CATEGORIES || []).map(c => ({
      name: c.label,
      value: totals[c.value] || 0,
      color: c.color
    })).filter(c => c.value > 0);
  }, [filteredEntries]);

  const monthlyData = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEntries = entries.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
      });
      months.push({
        name: date.toLocaleDateString('en-US', { month: 'short' }),
        amount: monthEntries.reduce((sum, e) => sum + e.amount, 0)
      });
    }
    return months;
  }, [entries]);

  const upcomingBills = useMemo(() => {
    const recurring = entries.filter(e => e.recurring);
    return recurring.map(entry => {
      let nextDate = new Date(entry.dueDate || entry.date);
      const today = new Date();
      
      while (nextDate <= today) {
        if (entry.recurring === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
        else if (entry.recurring === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
        else if (entry.recurring === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);
      }
      
      const daysUntil = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
      
      return { ...entry, nextDueDate: nextDate, daysUntil };
    }).sort((a, b) => a.daysUntil - b.daysUntil);
  }, [entries]);

  const totalWalletBalance = useMemo(() => {
    return wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
  }, [wallets]);

  // ============================================
  // HANDLERS
  // ============================================
  const handleAddExpense = async (expense) => {
    try {
      await saveEntry(expense);
    } catch (err) {
      setError('Failed to add expense');
    }
  };

  const handleDeleteEntry = async () => {
    if (!deletingEntry) return;
    try {
      await deleteEntry(deletingEntry.id);
      setDeletingEntry(null);
    } catch (err) {
      setError('Failed to delete entry');
    }
  };

  const toggleEntrySelection = (id) => {
    setSelectedEntries(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSetBudget = () => {
    const budget = parseFloat(budgetInput);
    if (!isNaN(budget) && budget >= 0) {
      setMonthlyBudget(budget);
      localStorage.setItem('monthlyBudget', budget.toString());
      setShowBudgetModal(false);
      setBudgetInput('');
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your finances...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className={cn("p-4 max-w-7xl mx-auto", !isMobile && "p-6")}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={cn("font-bold mb-1", isMobile ? "text-2xl" : "text-3xl")}>Finance Tracker</h1>
          <p className="text-sm text-muted-foreground">Track your expenses and manage your budget</p>
        </div>
        <Button onClick={() => setShowAddExpense(true)} className="gap-2">
          <Plus className="size-4" /> Add Expense
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="mb-4 border-destructive bg-destructive/10">
          <CardContent className="p-3 flex items-center gap-2">
            <AlertCircle className="size-4 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive flex-1">{error}</p>
            <Button variant="ghost" size="icon" onClick={() => setError(null)} className="size-8">
              <X className="size-3" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Row */}
      <div className={cn("mb-6", isMobile ? "flex gap-3 overflow-x-auto pb-2 -mx-4 px-4" : "grid grid-cols-5 gap-4")}>
        <StatCard title="Today" value={`₱${stats.today.toLocaleString()}`} icon={Calendar} color={BRAND.blue} isMobile={isMobile} />
        <StatCard title="This Month" value={`₱${stats.month.toLocaleString()}`} icon={TrendingUp} color={BRAND.green} isMobile={isMobile} />
        <StatCard title="Wallet Balance" value={`₱${totalWalletBalance.toLocaleString()}`} icon={Wallet} color="#8b5cf6" isMobile={isMobile} />
        <StatCard title="Avg/Day" value={`₱${stats.avgPerDay.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon={BarChart3} isMobile={isMobile} />
        <StatCard title="Total Entries" value={stats.count} icon={Receipt} isMobile={isMobile} />
      </div>

      {/* Budget Progress */}
      {monthlyBudget > 0 && (
        <div className="mb-6">
          <BudgetProgress spent={stats.month} budget={monthlyBudget} isDark={isDark} />
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className={cn("grid", isMobile ? "grid-cols-4" : "grid-cols-4 w-fit")}>
          <TabsTrigger value="dashboard" className="gap-1.5">
            <BarChart3 className="size-4" />
            {!isMobile && "Dashboard"}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <Receipt className="size-4" />
            {!isMobile && "History"}
          </TabsTrigger>
          <TabsTrigger value="wallets" className="gap-1.5">
            <Wallet className="size-4" />
            {!isMobile && "Wallets"}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1.5">
            <PieChartIcon className="size-4" />
            {!isMobile && "Analytics"}
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className={cn("grid gap-4", !isTablet && "grid-cols-2")}>
            <CategoryBreakdown data={categoryData} isDark={isDark} />
            <MonthlyTrend data={monthlyData} isDark={isDark} />
          </div>
          
          {upcomingBills.length > 0 && (
            <UpcomingBills bills={upcomingBills} />
          )}

          {/* Recent Expenses */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Recent Expenses</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('history')} className="gap-1 text-xs">
                  View All <ArrowRight className="size-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredEntries.slice(0, 5).map(entry => (
                  <ExpenseRow
                    key={entry.id}
                    entry={entry}
                    onEdit={setEditingEntry}
                    onDelete={setDeletingEntry}
                    isSelected={selectedEntries.includes(entry.id)}
                    onSelect={toggleEntrySelection}
                    isMobile={isMobile}
                  />
                ))}
                {filteredEntries.length === 0 && (
                  <div className="text-center py-8">
                    <Receipt className="size-12 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">No expenses yet</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowAddExpense(true)}>
                      Add your first expense
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className={cn("flex gap-3", isMobile ? "flex-col" : "items-center")}>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search expenses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {(CATEGORIES || []).map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Entries List */}
          <Card>
            <CardContent className="p-4">
              <ScrollArea className={isMobile ? "h-[400px]" : "h-[500px]"}>
                <div className="space-y-2">
                  {filteredEntries.map(entry => (
                    <ExpenseRow
                      key={entry.id}
                      entry={entry}
                      onEdit={setEditingEntry}
                      onDelete={setDeletingEntry}
                      isSelected={selectedEntries.includes(entry.id)}
                      onSelect={toggleEntrySelection}
                      isMobile={isMobile}
                    />
                  ))}
                  {filteredEntries.length === 0 && (
                    <div className="text-center py-12">
                      <Receipt className="size-12 mx-auto text-muted-foreground/40 mb-3" />
                      <p className="text-muted-foreground">No expenses found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallets Tab */}
        <TabsContent value="wallets" className="space-y-4">
          <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-3")}>
            {wallets.map(wallet => (
              <WalletCard
                key={wallet.id}
                wallet={wallet}
                onAddFunds={(w) => console.log('Add funds to', w)}
                onWithdraw={(w) => console.log('Withdraw from', w)}
                onEdit={(w) => console.log('Edit wallet', w)}
              />
            ))}
            {wallets.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="p-8 text-center">
                  <Wallet className="size-12 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground mb-3">No wallets yet</p>
                  <Button variant="outline" size="sm">Add Wallet</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className={cn("grid gap-4", !isTablet && "grid-cols-2")}>
            <CategoryBreakdown data={categoryData} isDark={isDark} />
            <MonthlyTrend data={monthlyData} isDark={isDark} />
          </div>

          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">₱{stats.month.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">This Month</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">₱{stats.avgPerDay.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs text-muted-foreground">Daily Average</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{filteredEntries.length}</p>
                  <p className="text-xs text-muted-foreground">Transactions</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{categoryData.length}</p>
                  <p className="text-xs text-muted-foreground">Categories Used</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Expense Dialog */}
      <AddExpenseDialog
        open={showAddExpense}
        onOpenChange={setShowAddExpense}
        onAdd={handleAddExpense}
        wallets={wallets}
        categories={CATEGORIES}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingEntry} onOpenChange={() => setDeletingEntry(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Expense?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingEntry?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingEntry(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteEntry}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Budget Modal */}
      <Dialog open={showBudgetModal} onOpenChange={setShowBudgetModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Set Monthly Budget</DialogTitle>
            <DialogDescription>
              Set a monthly spending limit to track your budget.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Budget Amount</Label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₱</span>
              <Input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="e.g., 50000"
                className="pl-7"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBudgetModal(false)}>Cancel</Button>
            <Button onClick={handleSetBudget}>Save Budget</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinanceTracker;
