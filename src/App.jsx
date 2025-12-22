import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import { Upload, FileText, Users, MessageSquare, AlertTriangle, Plus, LogOut, Eye, Trash2, X, Loader2, Download, Check, Search, ChevronDown, AlertCircle, Moon, Sun, Receipt, Menu, Banknote, TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight, Bell, Edit, Calendar, RefreshCw, Filter, ChevronRight, Sparkles, Target, Clock, CheckCircle2, XCircle, Info, MoreVertical } from 'lucide-react';
import { supabase } from './lib/supabase';

// Import shadcn components
import {
  getShadcnTheme,
  getThemeVars,
  CATEGORIES,
  CURRENCIES,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  StatCard,
  Input,
  Select,
  Textarea,
  Label,
  FormField,
  Badge,
  CategoryBadge,
  StatusBadge,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter,
  ConfirmDialog,
  Avatar,
  Separator,
  Spinner,
  EmptyState,
  Progress,
  Toast,
  Alert,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  NavTabs,
  PillTabs,
  ProfileDropdown,
  CategoryDropdown,
} from './components/ui';

// ============================================
// RESPONSIVE HOOK
// ============================================
const useWindowSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
};

// ============================================
// FORMAT HELPERS
// ============================================
const formatAmount = (amount) => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatShortDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// ============================================
// HOME PAGE
// ============================================
const HomePage = ({ onNavigate, isDark, setIsDark }) => {
  const theme = getShadcnTheme(isDark);
  const cssVars = getThemeVars(theme);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isSmall = width < 480;

  const features = [
    { Icon: Upload, title: 'Smart Receipt Scanning', desc: 'Upload receipts and let AI extract the details automatically' },
    { Icon: FileText, title: 'Smart Categories', desc: 'Organize expenses by utilities, food, shopping & more' },
    { Icon: Check, title: 'Cloud Sync', desc: 'Your data is securely stored and accessible anywhere' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.background, ...cssVars }}>
      {/* Navigation */}
      <nav style={{
        borderBottom: `1px solid ${theme.border}`,
        backgroundColor: theme.background,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isSmall ? '12px 16px' : '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: theme.shadowSm,
            }}>
              <img src="https://i.imgur.com/R52jwPv.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: '600', color: theme.foreground, letterSpacing: '-0.025em' }}>BrewedOps</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun style={{ width: '18px', height: '18px' }} /> : <Moon style={{ width: '18px', height: '18px' }} />}
            </Button>
            <Button onClick={() => onNavigate('login')}>
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: isSmall ? '60px 20px 80px' : '100px 24px 120px',
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.08)',
          border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'}`,
          borderRadius: '9999px',
          marginBottom: '28px',
        }}>
          <Sparkles style={{ width: '14px', height: '14px', color: '#3b82f6' }} />
          <span style={{ fontSize: '13px', color: '#3b82f6', fontWeight: '500' }}>Smart Expense Tracking</span>
        </div>
        
        <h1 style={{
          fontSize: isSmall ? '40px' : isMobile ? '52px' : '64px',
          fontWeight: '700',
          color: theme.foreground,
          margin: '0 0 20px',
          lineHeight: '1.1',
          letterSpacing: '-0.03em',
        }}>
          Track Every Peso,<br />
          <span style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Master Your Money</span>
        </h1>
        
        <p style={{
          fontSize: isSmall ? '17px' : '19px',
          color: theme.mutedForeground,
          maxWidth: '580px',
          margin: '0 auto 36px',
          lineHeight: '1.7',
        }}>
          Effortlessly manage your bills, receipts, and invoices. Upload documents, 
          track expenses by category, and gain insights into your spending.
        </p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button size="lg" onClick={() => onNavigate('signup')}>
            Get Started
            <ChevronRight style={{ width: '16px', height: '16px' }} />
          </Button>
          <Button variant="outline" size="lg" onClick={() => onNavigate('login')}>
            Sign In
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: isSmall ? '60px 20px' : '80px 24px',
        backgroundColor: theme.secondary,
        borderTop: `1px solid ${theme.border}`,
        borderBottom: `1px solid ${theme.border}`,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: isSmall ? '28px' : '36px',
              fontWeight: '600',
              color: theme.foreground,
              margin: '0 0 12px',
              letterSpacing: '-0.025em',
            }}>
              Features
            </h2>
            <p style={{
              fontSize: '16px',
              color: theme.mutedForeground,
              maxWidth: '420px',
              margin: '0 auto',
            }}>
              Everything you need to manage your expenses effectively.
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isSmall ? '1fr' : isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: '20px',
          }}>
            {features.map((feature, i) => (
              <Card key={i} style={{ textAlign: 'center' }}>
                <CardContent style={{ padding: '28px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    backgroundColor: theme.muted,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}>
                    <feature.Icon style={{ width: '24px', height: '24px', color: theme.mutedForeground }} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.foreground, margin: '0 0 10px' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: theme.mutedForeground, margin: 0, lineHeight: '1.6' }}>
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: isSmall ? '24px 20px' : '28px 24px',
        borderTop: `1px solid ${theme.border}`,
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '14px', color: theme.mutedForeground, margin: 0 }}>
          © 2025 BrewedOps Tracker by Kenneth V.
        </p>
      </footer>
    </div>
  );
};

// ============================================
// LOGIN PAGE
// ============================================
const LoginPage = ({ onLogin, onBack, isDark, setIsDark, initialMode = 'login' }) => {
  const [isSignup, setIsSignup] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const theme = getShadcnTheme(isDark);
  const cssVars = getThemeVars(theme);
  const { width } = useWindowSize();
  const isMobile = width < 480;

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const validatePassword = (password) => {
    const issues = [];
    if (password.length < 8) issues.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) issues.push('One uppercase letter');
    if (!/[a-z]/.test(password)) issues.push('One lowercase letter');
    if (!/[0-9]/.test(password)) issues.push('One number');
    return issues;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (isSignup && !nickname.trim()) {
      newErrors.nickname = 'Nickname is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (isSignup) {
      const passwordIssues = validatePassword(password);
      if (passwordIssues.length > 0) {
        newErrors.password = `Password needs: ${passwordIssues.join(', ')}`;
      }
    }

    if (isSignup) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { nickname: nickname.trim() } }
        });
        
        if (error) throw error;
        
        if (data.user && !data.session) {
          setSuccessMessage('Please check your email for a confirmation link to complete your registration.');
          setLoading(false);
        } else if (data.user) {
          setSuccessMessage('Account created successfully!');
          onLogin(data.user);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        const { data: adminData } = await supabase
          .from('admins')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (adminData) {
          onLogin({ ...data.user, isAdmin: true });
        } else {
          onLogin(data.user);
        }
      }
    } catch (e) {
      setErrors({ general: e.message || 'Something went wrong. Please try again.' });
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrors({ email: 'Please enter your email first' });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      setSuccessMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignup(!isSignup);
    setErrors({});
    setSuccessMessage('');
    setPassword('');
    setConfirmPassword('');
    setNickname('');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      ...cssVars,
    }}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsDark(!isDark)}
        style={{ position: 'absolute', top: '16px', right: '16px' }}
      >
        {isDark ? <Sun style={{ width: '18px', height: '18px' }} /> : <Moon style={{ width: '18px', height: '18px' }} />}
      </Button>

      {onBack && (
        <Button
          variant="outline"
          onClick={onBack}
          style={{ position: 'absolute', top: '16px', left: '16px' }}
        >
          ← Back
        </Button>
      )}

      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <CardContent style={{ padding: isMobile ? '28px 24px' : '36px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              overflow: 'hidden',
              margin: '0 auto 16px',
              boxShadow: theme.shadowSm,
            }}>
              <img src="https://i.imgur.com/R52jwPv.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '600', color: theme.foreground, margin: '0 0 8px', letterSpacing: '-0.025em' }}>
              {isSignup ? 'Create an account' : 'Welcome back'}
            </h1>
            <p style={{ fontSize: '14px', color: theme.mutedForeground, margin: 0 }}>
              {isSignup ? 'Start tracking your expenses today' : 'Sign in to your account'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {errors.general && (<Alert variant="destructive">{errors.general}</Alert>)}
            {successMessage && (<Alert variant="success">{successMessage}</Alert>)}

            <FormField label="Email" error={errors.email}>
              <Input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                error={!!errors.email}
              />
            </FormField>

            {isSignup && (
              <FormField label="Nickname" error={errors.nickname}>
                <Input
                  type="text"
                  value={nickname}
                  onChange={(e) => { setNickname(e.target.value); setErrors({ ...errors, nickname: '' }); }}
                  error={!!errors.nickname}
                />
              </FormField>
            )}

            <FormField label="Password" error={errors.password}>
              <Input
                type="password"
                placeholder={isSignup ? 'ex. Sample12!@' : ''}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); }}
                onKeyDown={(e) => e.key === 'Enter' && !isSignup && handleSubmit()}
                error={!!errors.password}
              />
            </FormField>

            {isSignup && (
              <FormField label="Confirm Password" error={errors.confirmPassword}>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors({ ...errors, confirmPassword: '' }); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  error={!!errors.confirmPassword}
                />
              </FormField>
            )}

            <Button onClick={handleSubmit} disabled={loading} loading={loading} style={{ width: '100%', marginTop: '8px' }}>
              {isSignup ? 'Create Account' : 'Sign In'}
            </Button>

            {!isSignup && (
              <Button variant="link" onClick={handleForgotPassword} disabled={loading} style={{ alignSelf: 'center' }}>
                Forgot password?
              </Button>
            )}

            <Separator style={{ margin: '8px 0' }} />

            <p style={{ textAlign: 'center', fontSize: '14px', color: theme.mutedForeground, margin: 0 }}>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Button variant="link" onClick={switchMode} style={{ padding: 0 }}>
                {isSignup ? 'Sign in' : 'Sign up'}
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// ADMIN DASHBOARD
// ============================================
const AdminDashboard = ({ onLogout, isDark, setIsDark }) => {
  const theme = getShadcnTheme(isDark);
  const cssVars = getThemeVars(theme);
  const [users, setUsers] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { width } = useWindowSize();
  const isMobile = width < 768;

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const { data: expensesData } = await supabase.from('expenses').select('*').order('created_at', { ascending: false });
      const { data: feedbackData } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });

      if (expensesData) {
        setAllExpenses(expensesData);
        const uniqueUsers = [...new Map(expensesData.map(e => [e.user_id, { id: e.user_id, email: e.user_email, nickname: e.user_nickname }])).values()];
        setUsers(uniqueUsers);
      }
      if (feedbackData) setFeedbacks(feedbackData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.background, display: 'flex', alignItems: 'center', justifyContent: 'center', ...cssVars }}>
        <Spinner size="lg" />
      </div>
    );
  }

  const totalExpenses = allExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.background, ...cssVars }}>
      <header style={{ backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, padding: '14px 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="https://i.imgur.com/R52jwPv.png" alt="Logo" style={{ width: '36px', height: '36px', borderRadius: '10px' }} />
            <div>
              <h1 style={{ fontSize: '17px', fontWeight: '600', color: theme.foreground, margin: 0 }}>Admin Dashboard</h1>
              <p style={{ fontSize: '12px', color: theme.mutedForeground, margin: 0 }}>BrewedOps Tracker</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun style={{ width: '18px', height: '18px' }} /> : <Moon style={{ width: '18px', height: '18px' }} />}
            </Button>
            <Button variant="outline" onClick={onLogout}><LogOut style={{ width: '16px', height: '16px' }} />Logout</Button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <StatCard title="Total Users" value={users.length} icon={Users} gradient="blue" />
          <StatCard title="Total Expenses" value={allExpenses.length} icon={Receipt} gradient="green" />
          <StatCard title="Total Amount" value={`₱${formatAmount(totalExpenses)}`} icon={DollarSign} gradient="purple" />
          <StatCard title="Feedback" value={feedbacks.length} icon={MessageSquare} gradient="orange" />
        </div>

        <NavTabs
          tabs={[
            { value: 'overview', label: 'Overview' },
            { value: 'users', label: 'Users', badge: users.length },
            { value: 'expenses', label: 'All Expenses', badge: allExpenses.length },
            { value: 'feedback', label: 'Feedback', badge: feedbacks.length },
          ]}
          value={activeTab}
          onValueChange={setActiveTab}
          style={{ marginBottom: '24px' }}
        />

        {activeTab === 'overview' && (
          <Card><CardHeader><CardTitle>System Overview</CardTitle></CardHeader><CardContent><p style={{ color: theme.mutedForeground }}>Welcome to the admin dashboard.</p></CardContent></Card>
        )}

        {activeTab === 'users' && (
          <Card>
            <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
            <CardContent style={{ padding: 0 }}>
              <Table>
                <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Email</TableHead><TableHead align="right">Expenses</TableHead></TableRow></TableHeader>
                <TableBody>
                  {users.map(u => (
                    <TableRow key={u.id}>
                      <TableCell><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Avatar size="sm">{u.nickname?.charAt(0) || 'U'}</Avatar>{u.nickname || 'User'}</div></TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell align="right">{allExpenses.filter(e => e.user_id === u.id).length}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'expenses' && (
          <Card>
            <CardHeader><CardTitle>All Expenses</CardTitle></CardHeader>
            <CardContent style={{ padding: 0 }}>
              <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>User</TableHead><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead align="right">Amount</TableHead></TableRow></TableHeader>
                <TableBody>
                  {allExpenses.slice(0, 50).map(expense => (
                    <TableRow key={expense.id}>
                      <TableCell>{formatShortDate(expense.date)}</TableCell>
                      <TableCell>{expense.user_nickname}</TableCell>
                      <TableCell>{expense.name}</TableCell>
                      <TableCell><Badge variant="secondary">{expense.category}</Badge></TableCell>
                      <TableCell align="right">₱{formatAmount(parseFloat(expense.amount))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'feedback' && (
          <Card>
            <CardHeader><CardTitle>User Feedback</CardTitle></CardHeader>
            <CardContent>
              {feedbacks.length === 0 ? (
                <EmptyState icon={MessageSquare} title="No feedback yet" description="User feedback will appear here" />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {feedbacks.map(fb => (
                    <Card key={fb.id} style={{ backgroundColor: theme.muted }}>
                      <CardContent style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <Avatar size="sm">{fb.nickname?.charAt(0) || 'U'}</Avatar>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '500', color: theme.foreground, margin: 0 }}>{fb.nickname}</p>
                            <p style={{ fontSize: '12px', color: theme.mutedForeground, margin: 0 }}>{fb.user_email}</p>
                          </div>
                        </div>
                        <p style={{ fontSize: '14px', color: theme.foreground, margin: 0 }}>{fb.message}</p>
                        <p style={{ fontSize: '12px', color: theme.mutedForeground, margin: '8px 0 0' }}>{formatDate(fb.created_at)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

// ============================================
// MAIN EXPENSE TRACKER APP
// ============================================
const ExpenseTrackerApp = ({ user, onLogout, isDark, setIsDark }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || '₱');
  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const saved = localStorage.getItem('monthlyBudget');
    return saved ? parseFloat(saved) : 0;
  });
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  const theme = getShadcnTheme(isDark);
  const cssVars = getThemeVars(theme);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isSmall = width < 480;
  
  // Form states
  const [uploadMode, setUploadMode] = useState('manual');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [manualForm, setManualForm] = useState({ name: '', amount: '', date: '', dueDate: '', notes: '', recurring: '' });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [pendingUpload, setPendingUpload] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // Tab states - MAIN TABS: dashboard, entries
  const [activeTab, setActiveTab] = useState('dashboard');
  // SUB TABS for dashboard: add-entry, analytics, bills
  const [dashboardSubTab, setDashboardSubTab] = useState('add-entry');
  
  // Filter states
  const [historyFilter, setHistoryFilter] = useState('All');
  const [historySearch, setHistorySearch] = useState('');
  const [dashboardView, setDashboardView] = useState('Month');
  
  // Modal states
  const [previewFile, setPreviewFile] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [editNickname, setEditNickname] = useState(user.user_metadata?.nickname || '');
  const [deletingEntry, setDeletingEntry] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(null), 3000); return () => clearTimeout(timer); } }, [toast]);
  useEffect(() => { localStorage.setItem('currency', currency); }, [currency]);
  useEffect(() => { localStorage.setItem('monthlyBudget', monthlyBudget.toString()); }, [monthlyBudget]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  // Load entries
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const { data, error } = await supabase.from('expenses').select('*').eq('user_id', user.id).order('date', { ascending: false });
        if (error) throw error;
        const transformedData = data.map(expense => ({
          id: expense.id, name: expense.name, type: expense.category, amount: parseFloat(expense.amount),
          date: expense.date, dueDate: expense.due_date, notes: expense.notes || '', recurring: expense.recurring || null,
          file: expense.file_name ? { name: expense.file_name, type: expense.file_type, data: expense.file_data } : null
        }));
        setEntries(transformedData);
      } catch (e) { console.error('Failed to load entries:', e); }
      setLoading(false);
    };
    loadEntries();
  }, [user]);

  // Save entry
  const saveEntry = async (newEntry) => {
    try {
      const { data, error } = await supabase.from('expenses').insert([{
        user_id: user.id, user_email: user.email, user_nickname: user.user_metadata?.nickname || 'User',
        name: newEntry.name, amount: newEntry.amount, category: newEntry.type, date: newEntry.date,
        due_date: newEntry.dueDate || null, notes: newEntry.notes || null, recurring: newEntry.recurring || null,
        file_name: newEntry.file?.name || null, file_type: newEntry.file?.type || null, file_data: newEntry.file?.data || null
      }]).select().single();
      if (error) throw error;
      const savedEntry = { id: data.id, name: data.name, type: data.category, amount: parseFloat(data.amount), date: data.date, dueDate: data.due_date, notes: data.notes || '', recurring: data.recurring || null, file: newEntry.file };
      setEntries(prev => [savedEntry, ...prev]);
      return savedEntry;
    } catch (e) { console.error('Failed to save:', e); throw e; }
  };

  // Delete entry
  const deleteEntry = async (id) => {
    try { const { error } = await supabase.from('expenses').delete().eq('id', id); if (error) throw error; setEntries(prev => prev.filter(e => e.id !== id)); } catch (e) { console.error('Failed to delete:', e); }
  };

  // File handling
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setUploadError('File too large. Maximum size is 5MB.'); e.target.value = ''; return; }
    if (!selectedCategory) { setUploadError('Please select a category first'); e.target.value = ''; return; }
    const mediaType = file.type || 'image/jpeg';
    if (!mediaType.startsWith('image/') && mediaType !== 'application/pdf') { setUploadError('Please upload an image or PDF file'); e.target.value = ''; return; }
    setUploadError('');
    setUploadedFile({ file, name: file.name, type: mediaType, size: file.size, preview: mediaType.startsWith('image/') ? URL.createObjectURL(file) : null });
  };

  const clearAttachedFile = () => { if (uploadedFile?.preview) URL.revokeObjectURL(uploadedFile.preview); setUploadedFile(null); setUploadError(''); };

  const processAttachedFile = async () => {
    if (!uploadedFile || !selectedCategory) return;
    setIsProcessing(true);
    try {
      const base64Data = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(',')[1]); reader.onerror = () => reject(new Error('Failed to read file')); reader.readAsDataURL(uploadedFile.file); });
      const mediaType = uploadedFile.type;
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-receipt`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` }, body: JSON.stringify({ base64Data, mediaType }) });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to extract data'); }
      const extracted = await response.json();
      setPendingUpload({ id: Date.now().toString(), type: selectedCategory, name: extracted.name || 'Unknown', amount: parseFloat(extracted.amount) || 0, date: extracted.date || new Date().toISOString().split('T')[0], dueDate: extracted.dueDate || '', createdAt: new Date().toISOString(), file: { data: base64Data, type: mediaType, name: uploadedFile.name } });
      clearAttachedFile();
    } catch (error) { console.error('Extraction failed:', error); showToast(`Failed to extract data: ${error.message}`, 'error'); } finally { setIsProcessing(false); }
  };

  const confirmPendingUpload = async () => { if (pendingUpload) { try { await saveEntry(pendingUpload); setPendingUpload(null); setSelectedCategory(''); showToast('Entry saved successfully', 'success'); } catch (e) { showToast('Failed to save entry', 'error'); } } };
  const cancelPendingUpload = () => { setPendingUpload(null); clearAttachedFile(); setSelectedCategory(''); };

  const handleManualSubmit = async () => {
    if (!selectedCategory || !manualForm.name || !manualForm.amount) { showToast('Please fill required fields', 'error'); return; }
    setIsSaving(true);
    const newEntry = { type: selectedCategory, name: manualForm.name, amount: parseFloat(manualForm.amount) || 0, date: manualForm.date || new Date().toISOString().split('T')[0], dueDate: manualForm.dueDate || '', notes: manualForm.notes || '', recurring: manualForm.recurring || null };
    try { await saveEntry(newEntry); setSelectedCategory(''); setManualForm({ name: '', amount: '', date: '', dueDate: '', notes: '', recurring: '' }); showToast('Entry added successfully', 'success'); } catch (e) { showToast('Failed to save entry', 'error'); } finally { setIsSaving(false); }
  };

  // Budget helpers
  const getBudgetStatus = () => {
    if (monthlyBudget <= 0) return null;
    const now = new Date();
    const monthSpent = entries.filter(e => { const d = new Date(e.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).reduce((sum, e) => sum + e.amount, 0);
    const percentage = (monthSpent / monthlyBudget) * 100;
    const remaining = monthlyBudget - monthSpent;
    let color = '#22c55e';
    if (percentage >= 100) color = '#ef4444';
    else if (percentage >= 80) color = '#f59e0b';
    return { spent: monthSpent, percentage: Math.min(percentage, 100), remaining, color };
  };

  // Recurring expense helpers
  const getRecurringEntries = () => entries.filter(e => e.recurring);

  const getNextDueDate = (entry) => {
    if (!entry.recurring) return null;
    const lastDate = new Date(entry.dueDate || entry.date);
    const today = new Date();
    let nextDate = new Date(lastDate);
    while (nextDate <= today) {
      if (entry.recurring === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
      else if (entry.recurring === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
      else if (entry.recurring === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);
    }
    return nextDate;
  };

  const getDaysUntilDue = (entry) => {
    const nextDue = getNextDueDate(entry);
    if (!nextDue) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0); nextDue.setHours(0, 0, 0, 0);
    return Math.ceil((nextDue - today) / (1000 * 60 * 60 * 24));
  };

  const getUpcomingBills = () => getRecurringEntries().map(entry => ({ ...entry, nextDueDate: getNextDueDate(entry), daysUntil: getDaysUntilDue(entry) })).sort((a, b) => a.daysUntil - b.daysUntil);
  const getMonthlyRecurringCost = () => getRecurringEntries().reduce((total, entry) => { if (entry.recurring === 'weekly') return total + (entry.amount * 4.33); if (entry.recurring === 'monthly') return total + entry.amount; if (entry.recurring === 'yearly') return total + (entry.amount / 12); return total; }, 0);
  const getYearlyRecurringCost = () => getRecurringEntries().reduce((total, entry) => { if (entry.recurring === 'weekly') return total + (entry.amount * 52); if (entry.recurring === 'monthly') return total + (entry.amount * 12); if (entry.recurring === 'yearly') return total + entry.amount; return total; }, 0);

  // Feedback
  const handleSubmitFeedback = async () => {
    if (!feedbackMessage.trim()) return;
    try { const { error } = await supabase.from('feedbacks').insert([{ user_id: user.id, user_email: user.email, nickname: user.user_metadata?.nickname || 'User', message: feedbackMessage.trim() }]); if (error) throw error; setFeedbackSent(true); setTimeout(() => { setShowFeedback(false); setFeedbackMessage(''); setFeedbackSent(false); }, 2000); } catch (e) { showToast('Failed to send feedback', 'error'); }
  };

  // Entry handlers
  const handleDeleteEntry = async () => { if (!deletingEntry) return; setIsSaving(true); try { await deleteEntry(deletingEntry.id); setDeletingEntry(null); showToast('Entry deleted successfully', 'success'); } catch (e) { showToast('Failed to delete entry', 'error'); } finally { setIsSaving(false); } };

  const handleUpdateEntry = async () => {
    if (!editingEntry) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('expenses').update({ name: editingEntry.name, amount: parseFloat(editingEntry.amount), category: editingEntry.type, date: editingEntry.date, due_date: editingEntry.dueDate || null, notes: editingEntry.notes || null, recurring: editingEntry.recurring || null }).eq('id', editingEntry.id);
      if (error) throw error;
      setEntries(prev => prev.map(e => e.id === editingEntry.id ? { ...e, name: editingEntry.name, amount: parseFloat(editingEntry.amount), type: editingEntry.type, date: editingEntry.date, dueDate: editingEntry.dueDate, notes: editingEntry.notes, recurring: editingEntry.recurring } : e));
      setEditingEntry(null);
      showToast('Entry updated successfully', 'success');
    } catch (e) { console.error('Failed to update:', e); showToast('Failed to update entry', 'error'); } finally { setIsSaving(false); }
  };

  const handleDownloadFile = (entry) => { if (!entry.file) return; const link = document.createElement('a'); link.href = `data:${entry.file.type};base64,${entry.file.data}`; link.download = entry.file.name || `${entry.name}.${entry.file.type.split('/')[1]}`; document.body.appendChild(link); link.click(); document.body.removeChild(link); };

  // Export CSV
  const exportToCSV = () => {
    const dataToExport = getFilteredEntries();
    const headers = ['Date', 'Category', 'Name', 'Amount', 'Due Date', 'Recurring'];
    const rows = dataToExport.map(e => [e.date, CATEGORIES.find(c => c.value === e.type)?.label || e.type, `"${e.name.replace(/"/g, '""')}"`, e.amount.toFixed(2), e.dueDate || '', e.recurring || '']);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = `brewedops-expenses-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
  };

  // Filters & Stats
  const getFilteredEntries = () => {
    let filtered = entries;
    const now = new Date();
    if (historySearch.trim()) { const search = historySearch.toLowerCase(); filtered = filtered.filter(e => e.name.toLowerCase().includes(search) || e.amount.toString().includes(search)); }
    if (historyFilter === 'Today') filtered = filtered.filter(e => new Date(e.date).toDateString() === now.toDateString());
    else if (historyFilter === 'Week') { const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); filtered = filtered.filter(e => new Date(e.date) >= weekAgo); }
    else if (historyFilter === 'Month') filtered = filtered.filter(e => { const d = new Date(e.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
    else if (historyFilter === 'Year') filtered = filtered.filter(e => new Date(e.date).getFullYear() === now.getFullYear());
    return filtered;
  };

  const getStats = () => {
    const now = new Date();
    return {
      today: entries.filter(e => new Date(e.date).toDateString() === now.toDateString()).reduce((s, e) => s + e.amount, 0),
      month: entries.filter(e => { const d = new Date(e.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).reduce((s, e) => s + e.amount, 0),
      year: entries.filter(e => new Date(e.date).getFullYear() === now.getFullYear()).reduce((s, e) => s + e.amount, 0),
      total: entries.reduce((s, e) => s + e.amount, 0)
    };
  };

  const getMonthlyData = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEntries = entries.filter(e => { const d = new Date(e.date); return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear(); });
      months.push({ name: date.toLocaleDateString('en-US', { month: 'short' }), amount: monthEntries.reduce((s, e) => s + e.amount, 0) });
    }
    return months;
  };

  const getCategoryData = () => {
    const now = new Date();
    let filtered = entries;
    if (dashboardView === 'Day') filtered = filtered.filter(e => new Date(e.date).toDateString() === now.toDateString());
    else if (dashboardView === 'Month') filtered = filtered.filter(e => { const d = new Date(e.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
    else if (dashboardView === 'Year') filtered = filtered.filter(e => new Date(e.date).getFullYear() === now.getFullYear());
    const totals = {};
    filtered.forEach(e => { totals[e.type] = (totals[e.type] || 0) + e.amount; });
    return CATEGORIES.map(c => ({ name: c.label, value: totals[c.value] || 0, color: c.color })).filter(c => c.value > 0);
  };

  const stats = getStats();
  const filteredEntries = getFilteredEntries();
  const budgetStatus = getBudgetStatus();
  const upcomingBills = getUpcomingBills();
  const recurringCount = getRecurringEntries().length;
  const monthlyData = getMonthlyData();
  const categoryData = getCategoryData();

  if (loading) {
    return (<div style={{ minHeight: '100vh', backgroundColor: theme.background, display: 'flex', alignItems: 'center', justifyContent: 'center', ...cssVars }}><Spinner size="lg" /></div>);
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.background, ...cssVars }}>
      {/* Header */}
      <header style={{ backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, padding: isSmall ? '12px 16px' : '14px 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="https://i.imgur.com/R52jwPv.png" alt="Logo" style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover', boxShadow: theme.shadowSm }} />
            <h1 style={{ fontSize: '17px', fontWeight: '600', color: theme.foreground, margin: 0, letterSpacing: '-0.025em' }}>BrewedOps</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!isSmall && entries.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', backgroundColor: theme.secondary, borderRadius: '8px', marginRight: '8px' }}>
                <span style={{ fontSize: '13px', color: theme.mutedForeground }}>Today:</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: stats.today > 0 ? '#22c55e' : theme.mutedForeground }}>{currency}{formatAmount(stats.today)}</span>
              </div>
            )}
            <Select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: '100px', height: '36px' }}>
              {CURRENCIES.map(c => <option key={c.symbol} value={c.symbol}>{c.label}</option>)}
            </Select>
            {!isMobile && (<Button variant="outline" onClick={() => setShowFeedback(true)}><MessageSquare style={{ width: '16px', height: '16px' }} />Feedback</Button>)}
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>{isDark ? <Sun style={{ width: '18px', height: '18px' }} /> : <Moon style={{ width: '18px', height: '18px' }} />}</Button>
            <ProfileDropdown user={user} onEditProfile={() => setShowEditProfile(true)} onFeedback={() => setShowFeedback(true)} onLogout={onLogout} showFeedback={isMobile} />
          </div>
        </div>
      </header>

      {/* MAIN TABS: Dashboard & All Entries */}
      <NavTabs
        tabs={[
          { value: 'dashboard', label: 'Dashboard' },
          { value: 'entries', label: 'All Entries', badge: entries.length },
        ]}
        value={activeTab}
        onValueChange={setActiveTab}
        style={{ backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, padding: '0 16px' }}
      />

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: isSmall ? '16px' : '24px' }}>
        
        {/* ===================== DASHBOARD TAB ===================== */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: isSmall ? 'repeat(2, 1fr)' : isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <StatCard title="Today" value={`${currency}${formatAmount(stats.today)}`} icon={Calendar} gradient="blue" />
              <StatCard title="This Month" value={`${currency}${formatAmount(stats.month)}`} icon={TrendingUp} gradient="green" />
              <StatCard title="This Year" value={`${currency}${formatAmount(stats.year)}`} icon={DollarSign} gradient="purple" />
              <StatCard title="Total" value={`${currency}${formatAmount(stats.total)}`} icon={Wallet} gradient="orange" />
            </div>

            {/* Budget Progress */}
            {budgetStatus && (
              <Card style={{ marginBottom: '24px' }}>
                <CardContent style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: theme.foreground }}>Monthly Budget</span>
                    <Button variant="ghost" size="sm" onClick={() => setShowBudgetModal(true)}><Edit style={{ width: '14px', height: '14px' }} />Edit</Button>
                  </div>
                  <Progress value={budgetStatus.percentage} color={budgetStatus.color} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                    <span style={{ fontSize: '13px', color: theme.mutedForeground }}>{currency}{formatAmount(budgetStatus.spent)} spent</span>
                    <span style={{ fontSize: '13px', color: budgetStatus.color, fontWeight: '500' }}>{budgetStatus.remaining >= 0 ? `${currency}${formatAmount(budgetStatus.remaining)} left` : `${currency}${formatAmount(Math.abs(budgetStatus.remaining))} over`}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* SUB-TABS for Dashboard */}
            <PillTabs
              options={[
                { value: 'add-entry', label: 'Add Entry' },
                { value: 'analytics', label: 'Analytics' },
                { value: 'bills', label: `Bills${recurringCount > 0 ? ` (${recurringCount})` : ''}` },
              ]}
              value={dashboardSubTab}
              onValueChange={setDashboardSubTab}
              style={{ marginBottom: '24px' }}
            />

            {/* ===== SUB-TAB: ADD ENTRY ===== */}
            {dashboardSubTab === 'add-entry' && (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
                {/* Add Entry Card */}
                <Card>
                  <CardHeader><CardTitle>Add New Entry</CardTitle></CardHeader>
                  <CardContent>
                    <PillTabs options={[{ value: 'manual', label: 'Manual' }, { value: 'file', label: 'Upload' }]} value={uploadMode} onValueChange={setUploadMode} style={{ marginBottom: '16px' }} />
                    <FormField label="Category" required style={{ marginBottom: '16px' }}>
                      <CategoryDropdown categories={CATEGORIES} value={selectedCategory} onChange={setSelectedCategory} placeholder="Select category" />
                    </FormField>

                    {uploadMode === 'manual' ? (
                      <>
                        <FormField label="Name" required><Input value={manualForm.name} onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })} placeholder="e.g., Electric Bill" /></FormField>
                        <FormField label="Amount" required><Input type="number" value={manualForm.amount} onChange={(e) => setManualForm({ ...manualForm, amount: e.target.value })} placeholder="0.00" /></FormField>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <FormField label="Date"><Input type="date" value={manualForm.date} onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })} /></FormField>
                          <FormField label="Due Date"><Input type="date" value={manualForm.dueDate} onChange={(e) => setManualForm({ ...manualForm, dueDate: e.target.value })} /></FormField>
                        </div>
                        <FormField label="Recurring"><Select value={manualForm.recurring} onChange={(e) => setManualForm({ ...manualForm, recurring: e.target.value })}><option value="">None</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></Select></FormField>
                        <FormField label="Notes"><Textarea value={manualForm.notes} onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })} placeholder="Optional notes..." style={{ minHeight: '60px' }} /></FormField>
                        <Button onClick={handleManualSubmit} disabled={isSaving || !selectedCategory || !manualForm.name || !manualForm.amount} loading={isSaving} style={{ width: '100%', marginTop: '8px' }}><Plus style={{ width: '16px', height: '16px' }} />Add Entry</Button>
                      </>
                    ) : (
                      <>
                        {uploadError && (<Alert variant="destructive" style={{ marginBottom: '16px' }}>{uploadError}</Alert>)}
                        {!uploadedFile && !pendingUpload && (
                          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', border: `2px dashed ${theme.border}`, borderRadius: '12px', cursor: selectedCategory ? 'pointer' : 'not-allowed', opacity: selectedCategory ? 1 : 0.5 }}>
                            <Upload style={{ width: '32px', height: '32px', color: theme.mutedForeground, marginBottom: '12px' }} />
                            <span style={{ fontSize: '14px', color: theme.foreground, fontWeight: '500' }}>{selectedCategory ? 'Click to upload' : 'Select category first'}</span>
                            <span style={{ fontSize: '12px', color: theme.mutedForeground, marginTop: '4px' }}>PNG, JPG or PDF (max 5MB)</span>
                            <input type="file" accept="image/*,.pdf" onChange={handleFileSelect} disabled={!selectedCategory} style={{ display: 'none' }} />
                          </label>
                        )}
                        {uploadedFile && (
                          <Card style={{ backgroundColor: theme.muted }}>
                            <CardContent style={{ padding: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <FileText style={{ width: '24px', height: '24px', color: theme.mutedForeground }} />
                                <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontSize: '14px', fontWeight: '500', color: theme.foreground, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{uploadedFile.name}</p><p style={{ fontSize: '12px', color: theme.mutedForeground, margin: 0 }}>{(uploadedFile.size / 1024).toFixed(1)} KB</p></div>
                                <Button variant="ghost" size="icon-sm" onClick={clearAttachedFile}><X style={{ width: '16px', height: '16px' }} /></Button>
                              </div>
                              <Button onClick={processAttachedFile} disabled={isProcessing} loading={isProcessing} style={{ width: '100%' }}>{isProcessing ? 'Extracting...' : 'Extract Data'}</Button>
                            </CardContent>
                          </Card>
                        )}
                        {pendingUpload && (
                          <Card style={{ backgroundColor: theme.muted }}>
                            <CardContent style={{ padding: '16px' }}>
                              <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.foreground, margin: '0 0 12px' }}>Extracted Data</h4>
                              <FormField label="Name"><Input value={pendingUpload.name} onChange={(e) => setPendingUpload({ ...pendingUpload, name: e.target.value })} /></FormField>
                              <FormField label="Amount"><Input type="number" value={pendingUpload.amount} onChange={(e) => setPendingUpload({ ...pendingUpload, amount: parseFloat(e.target.value) || 0 })} /></FormField>
                              <FormField label="Date"><Input type="date" value={pendingUpload.date} onChange={(e) => setPendingUpload({ ...pendingUpload, date: e.target.value })} /></FormField>
                              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}><Button variant="outline" onClick={cancelPendingUpload} style={{ flex: 1 }}>Cancel</Button><Button onClick={confirmPendingUpload} style={{ flex: 1 }}>Save</Button></div>
                            </CardContent>
                          </Card>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Entries */}
                <Card>
                  <CardHeader><CardTitle>Recent Entries</CardTitle></CardHeader>
                  <CardContent style={{ padding: 0 }}>
                    {entries.length === 0 ? (<EmptyState icon={Receipt} title="No entries yet" description="Add your first expense to get started" />) : (
                      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {entries.slice(0, 10).map(entry => {
                          const category = CATEGORIES.find(c => c.value === entry.type);
                          return (
                            <div key={entry.id} onClick={() => setEditingEntry(entry)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', borderBottom: `1px solid ${theme.border}`, cursor: 'pointer' }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: `${category?.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{category?.emoji || '📦'}</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: '14px', fontWeight: '500', color: theme.foreground, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.name}</p>
                                <p style={{ fontSize: '12px', color: theme.mutedForeground, margin: 0 }}>{formatShortDate(entry.date)}{entry.recurring && (<Badge variant="info" size="sm" style={{ marginLeft: '6px' }}>{entry.recurring}</Badge>)}</p>
                              </div>
                              <span style={{ fontSize: '14px', fontWeight: '600', color: theme.foreground }}>{currency}{formatAmount(entry.amount)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ===== SUB-TAB: ANALYTICS ===== */}
            {dashboardSubTab === 'analytics' && (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
                {/* Monthly Trend Bar Chart */}
                <Card>
                  <CardHeader><CardTitle>Monthly Trend</CardTitle></CardHeader>
                  <CardContent>
                    {monthlyData.some(m => m.amount > 0) ? (
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={monthlyData}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${currency}${v}`} />
                          <Tooltip formatter={(value) => `${currency}${formatAmount(value)}`} />
                          <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (<EmptyState icon={BarChart} title="No data" description="Add entries to see monthly trend" />)}
                  </CardContent>
                </Card>

                {/* Category Breakdown */}
                <Card>
                  <CardHeader>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <CardTitle>By Category</CardTitle>
                      <PillTabs options={[{ value: 'Day', label: 'D' }, { value: 'Month', label: 'M' }, { value: 'Year', label: 'Y' }]} value={dashboardView} onValueChange={setDashboardView} size="sm" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {categoryData.length > 0 ? (
                      <div>
                        {categoryData.map((cat, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < categoryData.length - 1 ? `1px solid ${theme.border}` : 'none' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: cat.color }} />
                            <span style={{ flex: 1, fontSize: '14px', color: theme.foreground }}>{cat.name}</span>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: theme.foreground }}>{currency}{formatAmount(cat.value)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (<EmptyState icon={TrendingUp} title="No data" description="Add entries to see breakdown" />)}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ===== SUB-TAB: BILLS ===== */}
            {dashboardSubTab === 'bills' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: isSmall ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                  <StatCard title="Active Bills" value={recurringCount} icon={CreditCard} gradient="purple" />
                  <StatCard title="Monthly Cost" value={`${currency}${formatAmount(getMonthlyRecurringCost())}`} icon={Calendar} gradient="blue" />
                  <StatCard title="Yearly Cost" value={`${currency}${formatAmount(getYearlyRecurringCost())}`} icon={DollarSign} gradient="green" />
                  <StatCard title="Due This Week" value={upcomingBills.filter(b => b.daysUntil <= 7).length} icon={Bell} gradient="red" />
                </div>

                <Card>
                  <CardHeader><CardTitle>Upcoming Bills</CardTitle><CardDescription>Bills sorted by next due date</CardDescription></CardHeader>
                  <CardContent style={{ padding: 0 }}>
                    {upcomingBills.length === 0 ? (
                      <EmptyState icon={CreditCard} title="No recurring bills" description="Add expenses with recurring option to track bills" action={<Button onClick={() => setDashboardSubTab('add-entry')}><Plus style={{ width: '16px', height: '16px' }} />Add Bill</Button>} />
                    ) : (
                      <div>
                        {upcomingBills.map(bill => {
                          const category = CATEGORIES.find(c => c.value === bill.type);
                          const isUrgent = bill.daysUntil <= 3;
                          const isSoon = bill.daysUntil <= 7;
                          return (
                            <div key={bill.id} onClick={() => setEditingEntry(bill)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', borderBottom: `1px solid ${theme.border}`, borderLeft: `4px solid ${isUrgent ? '#ef4444' : isSoon ? '#f59e0b' : category?.color}`, cursor: 'pointer', backgroundColor: isUrgent ? 'rgba(239, 68, 68, 0.05)' : isSoon ? 'rgba(245, 158, 11, 0.05)' : 'transparent' }}>
                              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${category?.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{category?.emoji}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}><span style={{ fontSize: '15px', fontWeight: '600', color: theme.foreground }}>{bill.name}</span><StatusBadge status={bill.recurring} /></div>
                                <span style={{ fontSize: '13px', color: theme.mutedForeground }}>{bill.daysUntil === 0 ? 'Due today!' : bill.daysUntil === 1 ? 'Due tomorrow' : `Due in ${bill.daysUntil} days`} • {formatShortDate(bill.nextDueDate)}</span>
                              </div>
                              <span style={{ fontSize: '16px', fontWeight: '700', color: theme.foreground }}>{currency}{formatAmount(bill.amount)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}

        {/* ===================== ALL ENTRIES TAB ===================== */}
        {activeTab === 'entries' && (
          <Card>
            <CardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <CardTitle>All Entries ({filteredEntries.length})</CardTitle>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Input icon={Search} placeholder="Search..." value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} style={{ width: '200px' }} />
                  <PillTabs options={[{ value: 'All', label: 'All' }, { value: 'Today', label: 'Today' }, { value: 'Week', label: 'Week' }, { value: 'Month', label: 'Month' }]} value={historyFilter} onValueChange={setHistoryFilter} size="sm" />
                  <Button variant="outline" onClick={exportToCSV}><Download style={{ width: '16px', height: '16px' }} />Export</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent style={{ padding: 0 }}>
              {filteredEntries.length === 0 ? (<EmptyState icon={Receipt} title="No entries found" description="Try adjusting your filters" />) : (
                <Table>
                  <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Category</TableHead><TableHead>Name</TableHead><TableHead>Recurring</TableHead><TableHead align="right">Amount</TableHead><TableHead align="center">Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {filteredEntries.map(entry => {
                      const category = CATEGORIES.find(c => c.value === entry.type);
                      return (
                        <TableRow key={entry.id}>
                          <TableCell>{formatShortDate(entry.date)}</TableCell>
                          <TableCell><Badge style={{ backgroundColor: `${category?.color}20`, color: category?.color }}>{category?.emoji} {category?.label}</Badge></TableCell>
                          <TableCell>{entry.name}</TableCell>
                          <TableCell>{entry.recurring && (<StatusBadge status={entry.recurring} />)}</TableCell>
                          <TableCell align="right" style={{ fontWeight: '600' }}>{currency}{formatAmount(entry.amount)}</TableCell>
                          <TableCell align="center">
                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                              <Button variant="ghost" size="icon-sm" onClick={() => setEditingEntry(entry)}><Edit style={{ width: '14px', height: '14px' }} /></Button>
                              <Button variant="ghost" size="icon-sm" onClick={() => setDeletingEntry(entry)}><Trash2 style={{ width: '14px', height: '14px', color: '#ef4444' }} /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* MODALS */}
      <Modal isOpen={!!editingEntry} onClose={() => setEditingEntry(null)}>
        <ModalHeader><ModalTitle>Edit Entry</ModalTitle></ModalHeader>
        <ModalContent>
          {editingEntry && (
            <>
              <FormField label="Category"><CategoryDropdown categories={CATEGORIES} value={editingEntry.type} onChange={(v) => setEditingEntry({ ...editingEntry, type: v })} /></FormField>
              <FormField label="Name"><Input value={editingEntry.name} onChange={(e) => setEditingEntry({ ...editingEntry, name: e.target.value })} /></FormField>
              <FormField label="Amount"><Input type="number" value={editingEntry.amount} onChange={(e) => setEditingEntry({ ...editingEntry, amount: e.target.value })} /></FormField>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <FormField label="Date"><Input type="date" value={editingEntry.date} onChange={(e) => setEditingEntry({ ...editingEntry, date: e.target.value })} /></FormField>
                <FormField label="Due Date"><Input type="date" value={editingEntry.dueDate || ''} onChange={(e) => setEditingEntry({ ...editingEntry, dueDate: e.target.value })} /></FormField>
              </div>
              <FormField label="Recurring"><Select value={editingEntry.recurring || ''} onChange={(e) => setEditingEntry({ ...editingEntry, recurring: e.target.value || null })}><option value="">None</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></Select></FormField>
              <FormField label="Notes"><Textarea value={editingEntry.notes || ''} onChange={(e) => setEditingEntry({ ...editingEntry, notes: e.target.value })} style={{ minHeight: '60px' }} /></FormField>
            </>
          )}
        </ModalContent>
        <ModalFooter><Button variant="outline" onClick={() => setEditingEntry(null)}>Cancel</Button><Button onClick={handleUpdateEntry} loading={isSaving}>Save Changes</Button></ModalFooter>
      </Modal>

      <ConfirmDialog isOpen={!!deletingEntry} onClose={() => setDeletingEntry(null)} onConfirm={handleDeleteEntry} title="Delete Entry?" description={`Are you sure you want to delete "${deletingEntry?.name}"? This action cannot be undone.`} confirmText="Delete" variant="destructive" icon={Trash2} loading={isSaving} />

      <Modal isOpen={showBudgetModal} onClose={() => setShowBudgetModal(false)} size="sm">
        <ModalHeader><ModalTitle>Set Monthly Budget</ModalTitle></ModalHeader>
        <ModalContent><FormField label="Monthly Budget"><Input type="number" value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)} placeholder={monthlyBudget > 0 ? monthlyBudget.toString() : '0.00'} /></FormField></ModalContent>
        <ModalFooter><Button variant="outline" onClick={() => setShowBudgetModal(false)}>Cancel</Button><Button onClick={() => { setMonthlyBudget(parseFloat(budgetInput) || 0); setBudgetInput(''); setShowBudgetModal(false); showToast('Budget updated', 'success'); }}>Save Budget</Button></ModalFooter>
      </Modal>

      <Modal isOpen={showFeedback} onClose={() => { setShowFeedback(false); setFeedbackMessage(''); setFeedbackSent(false); }}>
        <ModalHeader><ModalTitle>Send Feedback</ModalTitle></ModalHeader>
        <ModalContent>{feedbackSent ? (<Alert variant="success" title="Thank you!">Your feedback has been sent.</Alert>) : (<Textarea value={feedbackMessage} onChange={(e) => setFeedbackMessage(e.target.value)} placeholder="Share your thoughts..." style={{ minHeight: '120px' }} />)}</ModalContent>
        {!feedbackSent && (<ModalFooter><Button variant="outline" onClick={() => setShowFeedback(false)}>Cancel</Button><Button onClick={handleSubmitFeedback} disabled={!feedbackMessage.trim()}>Send</Button></ModalFooter>)}
      </Modal>

      <Modal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} size="sm">
        <ModalHeader><ModalTitle>Edit Profile</ModalTitle></ModalHeader>
        <ModalContent><FormField label="Nickname"><Input value={editNickname} onChange={(e) => setEditNickname(e.target.value)} /></FormField><FormField label="Email"><Input value={user.email} disabled /></FormField></ModalContent>
        <ModalFooter><Button variant="outline" onClick={() => setShowEditProfile(false)}>Cancel</Button><Button onClick={async () => { try { await supabase.auth.updateUser({ data: { nickname: editNickname } }); showToast('Profile updated', 'success'); setShowEditProfile(false); } catch (e) { showToast('Failed to update', 'error'); } }}>Save</Button></ModalFooter>
      </Modal>

      <Modal isOpen={!!previewFile} onClose={() => setPreviewFile(null)} size="lg">
        <ModalHeader><ModalTitle>{previewFile?.name}</ModalTitle></ModalHeader>
        <ModalContent>{previewFile?.file && (previewFile.file.type.startsWith('image/') ? (<img src={`data:${previewFile.file.type};base64,${previewFile.file.data}`} alt={previewFile.name} style={{ width: '100%', borderRadius: '8px' }} />) : (<div style={{ textAlign: 'center', padding: '32px' }}><FileText style={{ width: '48px', height: '48px', color: theme.mutedForeground }} /><p style={{ color: theme.mutedForeground }}>PDF Preview not available</p></div>))}</ModalContent>
        <ModalFooter><Button variant="outline" onClick={() => setPreviewFile(null)}>Close</Button><Button onClick={() => handleDownloadFile(previewFile)}><Download style={{ width: '16px', height: '16px' }} />Download</Button></ModalFooter>
      </Modal>

      {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />)}
    </div>
  );
};

// ============================================
// MAIN APP WRAPPER
// ============================================
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) { const isAdmin = localStorage.getItem('isAdmin') === 'true'; setUser(isAdmin ? { ...session.user, isAdmin: true } : session.user); }
      } catch (error) { console.error('Session check failed:', error); }
      setLoading(false);
    };
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { const isAdmin = localStorage.getItem('isAdmin') === 'true'; setUser(isAdmin ? { ...session.user, isAdmin: true } : session.user); } else { setUser(null); }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { localStorage.setItem('theme', isDark ? 'dark' : 'light'); }, [isDark]);
  
  const handleLogin = (userData) => { if (userData.isAdmin) localStorage.setItem('isAdmin', 'true'); else localStorage.removeItem('isAdmin'); setUser(userData); };
  const handleLogout = async () => { localStorage.removeItem('isAdmin'); if (user?.isAdmin) { setUser(null); setCurrentPage('home'); return; } await supabase.auth.signOut(); setUser(null); setCurrentPage('home'); };

  if (loading) { const theme = getShadcnTheme(isDark); return (<div style={{ minHeight: '100vh', backgroundColor: theme.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner size="lg" /></div>); }
  if (user?.isAdmin) return <AdminDashboard onLogout={handleLogout} isDark={isDark} setIsDark={setIsDark} />;
  if (user) return <ExpenseTrackerApp user={user} onLogout={handleLogout} isDark={isDark} setIsDark={setIsDark} />;
  if (currentPage === 'login' || currentPage === 'signup') return <LoginPage onLogin={handleLogin} onBack={() => setCurrentPage('home')} isDark={isDark} setIsDark={setIsDark} initialMode={currentPage} />;
  return <HomePage onNavigate={setCurrentPage} isDark={isDark} setIsDark={setIsDark} />;
}
