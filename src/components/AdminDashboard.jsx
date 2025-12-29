// AdminDashboard.jsx - Admin Dashboard for BrewedOps
import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, FileText, Trash2, X, Loader2, Search, 
  AlertTriangle, Plus, LogOut, Moon, Sun, Eye, Edit, Check,
  ChevronDown, ChevronRight, RefreshCw, Mail, Lock, User,
  Briefcase, Receipt, Target, DollarSign, Award, Settings,
  Database, Shield, Download, Upload, BarChart3, Calendar
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getTheme } from '../lib/theme';
import { useWindowSize } from '../lib/hooks';
import { formatAmount, getInitial } from '../lib/utils';
import { ACHIEVEMENTS } from '../lib/constants';

const AdminDashboard = ({ onLogout, isDark, setIsDark }) => {
  const theme = getTheme(isDark);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isSmall = width < 480;

  // Main states
  const [adminTab, setAdminTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  
  // User detail/management states
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailTab, setUserDetailTab] = useState('overview');
  const [userProfileData, setUserProfileData] = useState(null);
  const [userExpenses, setUserExpenses] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [userWallets, setUserWallets] = useState([]);
  const [userVAKitaData, setUserVAKitaData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  
  // Modal states
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(null);
  const [confirmText, setConfirmText] = useState('');
  
  // Form states
  const [editUserForm, setEditUserForm] = useState({ nickname: '', email: '', password: '' });
  const [createUserForm, setCreateUserForm] = useState({ email: '', password: '', nickname: '' });
  const [savingUser, setSavingUser] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);

  // Feedback states
  const [viewingFeedback, setViewingFeedback] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExpenses: 0,
    totalClients: 0,
    totalInvoices: 0,
    totalIncome: 0,
    activeUsers: 0
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), fetchFeedbacks()]);
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) console.error('Profiles error:', profilesError);

      // Get user_profiles for additional data
      const { data: userProfiles, error: upError } = await supabase
        .from('user_profiles')
        .select('*');

      if (upError) console.error('User profiles error:', upError);

      // Get all expenses
      const { data: expenses, error: expError } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (expError) console.error('Expenses error:', expError);

      // Build user map
      const userMap = {};
      let totalClients = 0;
      let totalInvoices = 0;
      let totalIncome = 0;
      let totalExpenseAmount = 0;

      // Add users from profiles
      if (profiles) {
        profiles.forEach(profile => {
          userMap[profile.id] = {
            id: profile.id,
            email: profile.email || profile.id,
            nickname: profile.nickname || profile.full_name || profile.username || 'User',
            avatar_url: profile.avatar_url,
            created_at: profile.created_at,
            expenses: [],
            totalSpent: 0,
            level: 1,
            xp: 0,
            clientCount: 0,
            invoiceCount: 0,
            incomeTotal: 0
          };
        });
      }

      // Add user_profiles data (VAKita, level, etc.)
      if (userProfiles) {
        userProfiles.forEach(up => {
          if (userMap[up.user_id]) {
            userMap[up.user_id].xp = up.xp || 0;
            userMap[up.user_id].level = calculateLevelFromXP(up.xp || 0);
            userMap[up.user_id].streak = up.streak || 0;
            
            // Count VAKita data
            const clients = up.vakita_clients ? JSON.parse(up.vakita_clients) : [];
            const invoices = up.vakita_invoices ? JSON.parse(up.vakita_invoices) : [];
            const income = up.vakita_income ? JSON.parse(up.vakita_income) : [];
            
            userMap[up.user_id].clientCount = clients.length;
            userMap[up.user_id].invoiceCount = invoices.length;
            userMap[up.user_id].incomeTotal = income.reduce((sum, i) => sum + (parseFloat(i.amountPHP) || 0), 0);
            
            totalClients += clients.length;
            totalInvoices += invoices.length;
            totalIncome += userMap[up.user_id].incomeTotal;
          }
        });
      }

      // Add expenses data
      if (expenses) {
        expenses.forEach(expense => {
          const userId = expense.user_id;
          if (userMap[userId]) {
            userMap[userId].expenses.push(expense);
            userMap[userId].totalSpent += parseFloat(expense.amount) || 0;
            totalExpenseAmount += parseFloat(expense.amount) || 0;
          }
        });
      }

      const userList = Object.values(userMap);
      setUsers(userList);
      
      // Calculate active users (users who logged in last 30 days or have recent activity)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeUsers = userList.filter(u => 
        new Date(u.created_at) > thirtyDaysAgo || u.expenses.length > 0
      ).length;

      setStats({
        totalUsers: userList.length,
        totalExpenses: expenses?.length || 0,
        totalClients,
        totalInvoices,
        totalIncome,
        activeUsers
      });

    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  // Load detailed user data
  const loadUserDetails = async (user) => {
    setSelectedUser(user);
    setUserDetailTab('overview');
    setLoadingUserData(true);

    try {
      // Get user profile data
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setUserProfileData(profileData || { xp: 0, streak: 0 });

      // Parse VAKita data
      if (profileData) {
        setUserVAKitaData({
          clients: profileData.vakita_clients ? JSON.parse(profileData.vakita_clients) : [],
          income: profileData.vakita_income ? JSON.parse(profileData.vakita_income) : [],
          invoices: profileData.vakita_invoices ? JSON.parse(profileData.vakita_invoices) : [],
          prospects: profileData.vakita_prospects ? JSON.parse(profileData.vakita_prospects) : [],
          taxSettings: profileData.vakita_tax_settings ? JSON.parse(profileData.vakita_tax_settings) : {},
          profile: profileData.vakita_profile ? JSON.parse(profileData.vakita_profile) : {}
        });
      } else {
        setUserVAKitaData({ clients: [], income: [], invoices: [], prospects: [], taxSettings: {}, profile: {} });
      }

      // Get achievements
      const { data: achievements } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      setUserAchievements(achievements || []);

      // Get wallets
      const { data: wallets } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id);

      setUserWallets(wallets || []);

      // Get expenses
      const { data: expenses } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setUserExpenses(expenses || []);

    } catch (error) {
      console.error('Error loading user details:', error);
    } finally {
      setLoadingUserData(false);
    }
  };

  // Helper functions
  const calculateLevelFromXP = (xp) => {
    const thresholds = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5500, 7500, 10000, 13000, 17000, 22000, 28000, 35000, 45000, 60000];
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (xp >= thresholds[i]) return i + 1;
    }
    return 1;
  };

  const getXPForLevel = (level) => {
    const thresholds = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5500, 7500, 10000, 13000, 17000, 22000, 28000, 35000, 45000, 60000];
    return level <= thresholds.length ? thresholds[level - 1] : thresholds[thresholds.length - 1];
  };

  // Edit user
  const handleEditUser = () => {
    if (!selectedUser) return;
    setEditUserForm({
      nickname: selectedUser.nickname || '',
      email: selectedUser.email || '',
      password: ''
    });
    setShowEditUserModal(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    setSavingUser(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch(
        `${supabase.supabaseUrl}/functions/v1/admin-update-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            userId: selectedUser.id,
            email: editUserForm.email !== selectedUser.email ? editUserForm.email : undefined,
            password: editUserForm.password || undefined,
            nickname: editUserForm.nickname
          })
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to update user');

      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id 
          ? { ...u, nickname: editUserForm.nickname, email: editUserForm.email }
          : u
      ));
      setSelectedUser(prev => ({ ...prev, nickname: editUserForm.nickname, email: editUserForm.email }));
      setShowEditUserModal(false);
      alert(`User updated successfully!`);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user: ' + error.message);
    } finally {
      setSavingUser(false);
    }
  };

  // Create user
  const handleCreateUser = async () => {
    if (!createUserForm.email || !createUserForm.password) {
      alert('Email and password are required');
      return;
    }
    if (createUserForm.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setCreatingUser(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch(
        `${supabase.supabaseUrl}/functions/v1/admin-create-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            email: createUserForm.email,
            password: createUserForm.password,
            nickname: createUserForm.nickname || 'User'
          })
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to create user');

      alert(`User created successfully!\nEmail: ${createUserForm.email}`);
      setShowCreateUserModal(false);
      setCreateUserForm({ email: '', password: '', nickname: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user: ' + error.message);
    } finally {
      setCreatingUser(false);
    }
  };

  // Delete functions
  const handleDeleteUser = async () => {
    if (confirmText.toLowerCase() !== 'delete' || !showDeleteConfirm) return;

    try {
      const userId = showDeleteConfirm.id;

      // Delete all user data
      await supabase.from('expenses').delete().eq('user_id', userId);
      await supabase.from('wallet_transactions').delete().eq('user_id', userId);
      await supabase.from('wallets').delete().eq('user_id', userId);
      await supabase.from('user_achievements').delete().eq('user_id', userId);
      await supabase.from('user_profiles').delete().eq('user_id', userId);
      await supabase.from('profiles').delete().eq('id', userId);

      setUsers(prev => prev.filter(u => u.id !== userId));
      if (selectedUser?.id === userId) setSelectedUser(null);
      setShowDeleteConfirm(null);
      setConfirmText('');
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user: ' + error.message);
    }
  };

  const handleResetUserData = async (resetType) => {
    if (confirmText.toLowerCase() !== 'delete' || !selectedUser) return;

    try {
      const userId = selectedUser.id;

      if (resetType === 'all' || resetType === 'expenses') {
        await supabase.from('expenses').delete().eq('user_id', userId);
        setUserExpenses([]);
      }

      if (resetType === 'all' || resetType === 'wallets') {
        await supabase.from('wallet_transactions').delete().eq('user_id', userId);
        await supabase.from('wallets').delete().eq('user_id', userId);
        setUserWallets([]);
      }

      if (resetType === 'all' || resetType === 'achievements') {
        await supabase.from('user_achievements').delete().eq('user_id', userId);
        setUserAchievements([]);
      }

      if (resetType === 'all' || resetType === 'vakita') {
        await supabase.from('user_profiles').update({
          vakita_clients: null,
          vakita_income: null,
          vakita_invoices: null,
          vakita_prospects: null,
          vakita_tax_settings: null,
          vakita_profile: null,
          vakita_activities: null
        }).eq('user_id', userId);
        setUserVAKitaData({ clients: [], income: [], invoices: [], prospects: [], taxSettings: {}, profile: {} });
      }

      if (resetType === 'all' || resetType === 'profile') {
        await supabase.from('user_profiles').update({
          xp: 0,
          streak: 0,
          current_streak: 0,
          selected_frame: 'none'
        }).eq('user_id', userId);
        setUserProfileData(prev => ({ ...prev, xp: 0, streak: 0 }));
      }

      setShowResetConfirm(null);
      setConfirmText('');
      alert(`User ${resetType} data has been reset`);
      fetchUsers();
    } catch (error) {
      console.error('Error resetting user data:', error);
      alert('Failed to reset data: ' + error.message);
    }
  };

  // Delete specific items
  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await supabase.from('expenses').delete().eq('id', expenseId);
      setUserExpenses(prev => prev.filter(e => e.id !== expenseId));
      fetchUsers();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Delete this client?')) return;
    try {
      const updatedClients = userVAKitaData.clients.filter(c => c.id !== clientId);
      await supabase.from('user_profiles').update({
        vakita_clients: JSON.stringify(updatedClients)
      }).eq('user_id', selectedUser.id);
      setUserVAKitaData(prev => ({ ...prev, clients: updatedClients }));
      alert('Client deleted');
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm('Delete this invoice?')) return;
    try {
      const updatedInvoices = userVAKitaData.invoices.filter(i => i.id !== invoiceId);
      await supabase.from('user_profiles').update({
        vakita_invoices: JSON.stringify(updatedInvoices)
      }).eq('user_id', selectedUser.id);
      setUserVAKitaData(prev => ({ ...prev, invoices: updatedInvoices }));
      alert('Invoice deleted');
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleDeleteIncome = async (incomeId) => {
    if (!window.confirm('Delete this income entry?')) return;
    try {
      const updatedIncome = userVAKitaData.income.filter(i => i.id !== incomeId);
      await supabase.from('user_profiles').update({
        vakita_income: JSON.stringify(updatedIncome)
      }).eq('user_id', selectedUser.id);
      setUserVAKitaData(prev => ({ ...prev, income: updatedIncome }));
      alert('Income entry deleted');
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  const handleDeleteProspect = async (prospectId) => {
    if (!window.confirm('Delete this prospect?')) return;
    try {
      const updatedProspects = userVAKitaData.prospects.filter(p => p.id !== prospectId);
      await supabase.from('user_profiles').update({
        vakita_prospects: JSON.stringify(updatedProspects)
      }).eq('user_id', selectedUser.id);
      setUserVAKitaData(prev => ({ ...prev, prospects: updatedProspects }));
      alert('Prospect deleted');
    } catch (error) {
      console.error('Error deleting prospect:', error);
    }
  };

  // Adjust level
  const handleAdjustLevel = async (adjustment) => {
    if (!selectedUser || !userProfileData) return;

    const currentXP = userProfileData.xp || 0;
    const currentLevel = calculateLevelFromXP(currentXP);
    const newLevel = Math.max(1, currentLevel + adjustment);
    const newXP = getXPForLevel(newLevel);

    try {
      const { data: existing } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', selectedUser.id)
        .single();

      if (existing) {
        await supabase.from('user_profiles').update({ xp: newXP }).eq('user_id', selectedUser.id);
      } else {
        await supabase.from('user_profiles').insert({
          user_id: selectedUser.id,
          xp: newXP,
          streak: 0,
          current_streak: 0,
          selected_frame: 'none'
        });
      }

      setUserProfileData(prev => ({ ...prev, xp: newXP }));
      alert(`User level ${adjustment > 0 ? 'increased' : 'decreased'} to Level ${newLevel}`);
    } catch (error) {
      console.error('Error adjusting level:', error);
      alert('Failed to adjust level: ' + error.message);
    }
  };

  // Send password reset
  const handleSendPasswordReset = async () => {
    if (!selectedUser?.email) return;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(selectedUser.email, {
        redirectTo: window.location.origin
      });
      if (error) throw error;
      alert(`Password reset email sent to ${selectedUser.email}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send password reset: ' + error.message);
    }
  };

  // Feedback functions
  const openFeedback = (feedback) => {
    setViewingFeedback(feedback);
    if (!feedback.read) {
      supabase.from('feedbacks').update({ read: true }).eq('id', feedback.id).then(() => {
        setFeedbacks(prev => prev.map(f => f.id === feedback.id ? { ...f, read: true } : f));
      });
    }
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await supabase.from('feedbacks').delete().eq('id', id);
      setFeedbacks(prev => prev.filter(f => f.id !== id));
      if (viewingFeedback?.id === id) setViewingFeedback(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Filtered data
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.nickname?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const unreadCount = feedbacks.filter(f => !f.read).length;

  // Styles
  const card = {
    backgroundColor: theme.cardBg,
    borderRadius: '12px',
    border: `1px solid ${theme.cardBorder}`,
    overflow: 'hidden'
  };

  const btn = {
    height: '36px',
    padding: '0 14px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  };

  const btnPrimary = { ...btn, backgroundColor: '#8b5cf6', color: '#fff' };
  const btnDanger = { ...btn, backgroundColor: '#ef4444', color: '#fff' };
  const btnSuccess = { ...btn, backgroundColor: '#10b981', color: '#fff' };
  const btnOutline = { ...btn, backgroundColor: 'transparent', border: `1px solid ${theme.cardBorder}`, color: theme.text };

  const input = {
    width: '100%',
    height: '40px',
    padding: '0 12px',
    backgroundColor: theme.inputBg,
    border: `1px solid ${theme.inputBorder}`,
    borderRadius: '8px',
    fontSize: '14px',
    color: theme.text,
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: theme.cardBg, 
        borderBottom: `1px solid ${theme.cardBorder}`, 
        padding: '12px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              backgroundColor: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield style={{ width: '22px', height: '22px', color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '700', color: theme.text, margin: 0 }}>BrewedOps Admin</h1>
              <p style={{ fontSize: '12px', color: '#dc2626', margin: 0, fontWeight: '500' }}>Administrator Panel</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => setIsDark(!isDark)} style={{ ...btnOutline, width: '36px', padding: 0 }}>
              {isDark ? <Sun style={{ width: '16px', height: '16px' }} /> : <Moon style={{ width: '16px', height: '16px' }} />}
            </button>
            <button onClick={onLogout} style={{ ...btnDanger }}>
              <LogOut style={{ width: '15px', height: '15px' }} />
              {!isSmall && 'Logout'}
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div style={{ backgroundColor: theme.cardBg, borderBottom: `1px solid ${theme.cardBorder}` }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '4px' }}>
          {[
            { id: 'users', label: 'Users', icon: Users, count: stats.totalUsers },
            { id: 'feedback', label: 'Feedback', icon: MessageSquare, count: unreadCount },
            { id: 'stats', label: 'Statistics', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setAdminTab(tab.id); setSelectedUser(null); }}
              style={{
                padding: '14px 18px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: adminTab === tab.id ? `2px solid ${theme.text}` : '2px solid transparent',
                fontSize: '14px',
                fontWeight: '500',
                color: adminTab === tab.id ? theme.text : theme.textMuted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <tab.icon style={{ width: '16px', height: '16px' }} />
              {!isSmall && tab.label}
              {tab.count > 0 && (
                <span style={{
                  backgroundColor: tab.id === 'feedback' && unreadCount > 0 ? '#ef4444' : theme.statBg,
                  color: tab.id === 'feedback' && unreadCount > 0 ? '#fff' : theme.textMuted,
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '2px 6px',
                  borderRadius: '10px'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: isSmall ? '16px' : '24px' }}>
        {adminTab === 'users' && (
          <div style={{ display: 'grid', gridTemplateColumns: selectedUser && !isMobile ? '1fr 1fr' : '1fr', gap: '20px' }}>
            {/* User List */}
            <div style={card}>
              <div style={{ 
                padding: '16px 20px', 
                borderBottom: `1px solid ${theme.cardBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: 0 }}>
                  All Users ({filteredUsers.length})
                </h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => setShowCreateUserModal(true)} style={btnSuccess}>
                    <Plus style={{ width: '14px', height: '14px' }} />
                    {!isSmall && 'Create'}
                  </button>
                  <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: theme.textMuted }} />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      style={{ ...input, width: isSmall ? '140px' : '180px', height: '36px', paddingLeft: '32px' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {loading ? (
                  <div style={{ padding: '60px', textAlign: 'center' }}>
                    <Loader2 style={{ width: '32px', height: '32px', color: theme.textMuted, animation: 'spin 1s linear infinite' }} />
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div style={{ padding: '60px', textAlign: 'center' }}>
                    <Users style={{ width: '40px', height: '40px', color: theme.textMuted, margin: '0 auto 12px' }} />
                    <p style={{ color: theme.textMuted }}>No users found</p>
                  </div>
                ) : (
                  filteredUsers.map(user => (
                    <div
                      key={user.id}
                      onClick={() => loadUserDetails(user)}
                      style={{
                        padding: '14px 20px',
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        backgroundColor: selectedUser?.id === user.id ? (isDark ? '#27272a' : '#f4f4f5') : 'transparent',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#8b5cf6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: '600',
                        flexShrink: 0
                      }}>
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          getInitial(user.nickname || user.email)
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: theme.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.nickname || 'User'}
                        </p>
                        <p style={{ fontSize: '12px', color: theme.textMuted, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.email}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#8b5cf6', margin: 0 }}>Lv.{user.level}</p>
                        <p style={{ fontSize: '11px', color: theme.textMuted, margin: '2px 0 0' }}>{user.expenses.length} entries</p>
                      </div>
                      <ChevronRight style={{ width: '16px', height: '16px', color: theme.textMuted, flexShrink: 0 }} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* User Details Panel */}
            {selectedUser && (
              <div style={card}>
                {loadingUserData ? (
                  <div style={{ padding: '60px', textAlign: 'center' }}>
                    <Loader2 style={{ width: '32px', height: '32px', color: theme.textMuted, animation: 'spin 1s linear infinite' }} />
                  </div>
                ) : (
                  <>
                    {/* User Header */}
                    <div style={{ padding: '20px', borderBottom: `1px solid ${theme.cardBorder}` }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: '#8b5cf6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '20px',
                            fontWeight: '600'
                          }}>
                            {selectedUser.avatar_url ? (
                              <img src={selectedUser.avatar_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                              getInitial(selectedUser.nickname || selectedUser.email)
                            )}
                          </div>
                          <div>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: 0 }}>{selectedUser.nickname || 'User'}</h3>
                            <p style={{ fontSize: '13px', color: theme.textMuted, margin: '2px 0' }}>{selectedUser.email}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                              <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#8b5cf620', color: '#8b5cf6', fontWeight: '500' }}>
                                Level {calculateLevelFromXP(userProfileData?.xp || 0)}
                              </span>
                              <span style={{ fontSize: '12px', color: theme.textMuted }}>
                                {userProfileData?.xp || 0} XP
                              </span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => setSelectedUser(null)} style={{ ...btnOutline, width: '32px', height: '32px', padding: 0 }}>
                          <X style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>

                      {/* Quick Actions */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button onClick={handleEditUser} style={btnOutline}>
                          <Edit style={{ width: '14px', height: '14px' }} /> Edit
                        </button>
                        <button onClick={handleSendPasswordReset} style={btnOutline}>
                          <Mail style={{ width: '14px', height: '14px' }} /> Reset Password
                        </button>
                        <button onClick={() => setShowDeleteConfirm(selectedUser)} style={{ ...btnOutline, borderColor: '#ef4444', color: '#ef4444' }}>
                          <Trash2 style={{ width: '14px', height: '14px' }} /> Delete
                        </button>
                      </div>
                    </div>

                    {/* Detail Tabs */}
                    <div style={{ borderBottom: `1px solid ${theme.cardBorder}`, display: 'flex', overflowX: 'auto' }}>
                      {[
                        { id: 'overview', label: 'Overview' },
                        { id: 'expenses', label: `Expenses (${userExpenses.length})` },
                        { id: 'clients', label: `Clients (${userVAKitaData?.clients?.length || 0})` },
                        { id: 'invoices', label: `Invoices (${userVAKitaData?.invoices?.length || 0})` },
                        { id: 'income', label: `Income (${userVAKitaData?.income?.length || 0})` },
                        { id: 'prospects', label: `Prospects (${userVAKitaData?.prospects?.length || 0})` },
                        { id: 'danger', label: 'Danger Zone' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setUserDetailTab(tab.id)}
                          style={{
                            padding: '10px 14px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderBottom: userDetailTab === tab.id ? `2px solid #8b5cf6` : '2px solid transparent',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: userDetailTab === tab.id ? '#8b5cf6' : theme.textMuted,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    <div style={{ padding: '16px 20px', maxHeight: '400px', overflowY: 'auto' }}>
                      {userDetailTab === 'overview' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                          <div style={{ padding: '14px', backgroundColor: theme.statBg, borderRadius: '10px' }}>
                            <p style={{ fontSize: '11px', color: theme.textMuted, margin: '0 0 4px' }}>Total Expenses</p>
                            <p style={{ fontSize: '20px', fontWeight: '700', color: theme.text, margin: 0 }}>₱{formatAmount(selectedUser.totalSpent)}</p>
                          </div>
                          <div style={{ padding: '14px', backgroundColor: theme.statBg, borderRadius: '10px' }}>
                            <p style={{ fontSize: '11px', color: theme.textMuted, margin: '0 0 4px' }}>Total Income</p>
                            <p style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e', margin: 0 }}>₱{formatAmount(userVAKitaData?.income?.reduce((sum, i) => sum + (parseFloat(i.amountPHP) || 0), 0) || 0)}</p>
                          </div>
                          <div style={{ padding: '14px', backgroundColor: theme.statBg, borderRadius: '10px' }}>
                            <p style={{ fontSize: '11px', color: theme.textMuted, margin: '0 0 4px' }}>Clients</p>
                            <p style={{ fontSize: '20px', fontWeight: '700', color: theme.text, margin: 0 }}>{userVAKitaData?.clients?.length || 0}</p>
                          </div>
                          <div style={{ padding: '14px', backgroundColor: theme.statBg, borderRadius: '10px' }}>
                            <p style={{ fontSize: '11px', color: theme.textMuted, margin: '0 0 4px' }}>Invoices</p>
                            <p style={{ fontSize: '20px', fontWeight: '700', color: theme.text, margin: 0 }}>{userVAKitaData?.invoices?.length || 0}</p>
                          </div>
                          <div style={{ padding: '14px', backgroundColor: theme.statBg, borderRadius: '10px' }}>
                            <p style={{ fontSize: '11px', color: theme.textMuted, margin: '0 0 4px' }}>Level / XP</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <p style={{ fontSize: '20px', fontWeight: '700', color: '#8b5cf6', margin: 0 }}>Lv.{calculateLevelFromXP(userProfileData?.xp || 0)}</p>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={() => handleAdjustLevel(-1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>-</button>
                                <button onClick={() => handleAdjustLevel(1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: 'none', backgroundColor: '#22c55e', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>+</button>
                              </div>
                            </div>
                          </div>
                          <div style={{ padding: '14px', backgroundColor: theme.statBg, borderRadius: '10px' }}>
                            <p style={{ fontSize: '11px', color: theme.textMuted, margin: '0 0 4px' }}>Achievements</p>
                            <p style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b', margin: 0 }}>{userAchievements.length}</p>
                          </div>
                        </div>
                      )}

                      {userDetailTab === 'expenses' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {userExpenses.length === 0 ? (
                            <p style={{ textAlign: 'center', color: theme.textMuted, padding: '20px' }}>No expenses</p>
                          ) : (
                            userExpenses.slice(0, 50).map(expense => (
                              <div key={expense.id} style={{ padding: '12px', backgroundColor: theme.statBg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                  <p style={{ fontSize: '13px', fontWeight: '500', color: theme.text, margin: 0 }}>{expense.name}</p>
                                  <p style={{ fontSize: '11px', color: theme.textMuted, margin: '2px 0 0' }}>{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '14px', fontWeight: '600', color: theme.text }}>₱{formatAmount(expense.amount)}</span>
                                  <button onClick={() => handleDeleteExpense(expense.id)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', backgroundColor: '#ef444420', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Trash2 style={{ width: '12px', height: '12px' }} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {userDetailTab === 'clients' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {!userVAKitaData?.clients?.length ? (
                            <p style={{ textAlign: 'center', color: theme.textMuted, padding: '20px' }}>No clients</p>
                          ) : (
                            userVAKitaData.clients.map(client => (
                              <div key={client.id} style={{ padding: '12px', backgroundColor: theme.statBg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: client.color || '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: '600' }}>
                                    {getInitial(client.name)}
                                  </div>
                                  <div>
                                    <p style={{ fontSize: '13px', fontWeight: '500', color: theme.text, margin: 0 }}>{client.name}</p>
                                    <p style={{ fontSize: '11px', color: theme.textMuted, margin: '2px 0 0' }}>{client.company || 'No company'} • {client.status}</p>
                                  </div>
                                </div>
                                <button onClick={() => handleDeleteClient(client.id)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', backgroundColor: '#ef444420', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Trash2 style={{ width: '12px', height: '12px' }} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {userDetailTab === 'invoices' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {!userVAKitaData?.invoices?.length ? (
                            <p style={{ textAlign: 'center', color: theme.textMuted, padding: '20px' }}>No invoices</p>
                          ) : (
                            userVAKitaData.invoices.map(invoice => (
                              <div key={invoice.id} style={{ padding: '12px', backgroundColor: theme.statBg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                  <p style={{ fontSize: '13px', fontWeight: '500', color: theme.text, margin: 0 }}>#{invoice.invoiceNumber}</p>
                                  <p style={{ fontSize: '11px', color: theme.textMuted, margin: '2px 0 0' }}>{invoice.clientName} • {invoice.status}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '14px', fontWeight: '600', color: invoice.status === 'paid' ? '#22c55e' : theme.text }}>{invoice.currency} {formatAmount(invoice.total)}</span>
                                  <button onClick={() => handleDeleteInvoice(invoice.id)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', backgroundColor: '#ef444420', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Trash2 style={{ width: '12px', height: '12px' }} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {userDetailTab === 'income' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {!userVAKitaData?.income?.length ? (
                            <p style={{ textAlign: 'center', color: theme.textMuted, padding: '20px' }}>No income entries</p>
                          ) : (
                            userVAKitaData.income.slice(0, 50).map(income => (
                              <div key={income.id} style={{ padding: '12px', backgroundColor: theme.statBg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                  <p style={{ fontSize: '13px', fontWeight: '500', color: theme.text, margin: 0 }}>{income.clientName || 'Unknown'}</p>
                                  <p style={{ fontSize: '11px', color: theme.textMuted, margin: '2px 0 0' }}>{income.platform} • {new Date(income.date).toLocaleDateString()}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#22c55e' }}>₱{formatAmount(income.amountPHP)}</span>
                                  <button onClick={() => handleDeleteIncome(income.id)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', backgroundColor: '#ef444420', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Trash2 style={{ width: '12px', height: '12px' }} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {userDetailTab === 'prospects' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {!userVAKitaData?.prospects?.length ? (
                            <p style={{ textAlign: 'center', color: theme.textMuted, padding: '20px' }}>No prospects</p>
                          ) : (
                            userVAKitaData.prospects.map(prospect => (
                              <div key={prospect.id} style={{ padding: '12px', backgroundColor: theme.statBg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                  <p style={{ fontSize: '13px', fontWeight: '500', color: theme.text, margin: 0 }}>{prospect.name}</p>
                                  <p style={{ fontSize: '11px', color: theme.textMuted, margin: '2px 0 0' }}>{prospect.company || 'No company'} • {prospect.status}</p>
                                </div>
                                <button onClick={() => handleDeleteProspect(prospect.id)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', backgroundColor: '#ef444420', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Trash2 style={{ width: '12px', height: '12px' }} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {userDetailTab === 'danger' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ padding: '16px', backgroundColor: isDark ? '#450a0a' : '#fef2f2', borderRadius: '10px', border: '1px solid #ef4444' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444', margin: '0 0 8px' }}>⚠️ Danger Zone</h4>
                            <p style={{ fontSize: '12px', color: isDark ? '#fca5a5' : '#b91c1c', margin: '0 0 16px' }}>
                              These actions are irreversible. Please be careful.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <button onClick={() => setShowResetConfirm('expenses')} style={{ ...btnOutline, width: '100%', borderColor: '#f59e0b', color: '#f59e0b', justifyContent: 'flex-start' }}>
                                <Trash2 style={{ width: '14px', height: '14px' }} /> Reset Expenses ({userExpenses.length})
                              </button>
                              <button onClick={() => setShowResetConfirm('wallets')} style={{ ...btnOutline, width: '100%', borderColor: '#f59e0b', color: '#f59e0b', justifyContent: 'flex-start' }}>
                                <Trash2 style={{ width: '14px', height: '14px' }} /> Reset Wallets ({userWallets.length})
                              </button>
                              <button onClick={() => setShowResetConfirm('vakita')} style={{ ...btnOutline, width: '100%', borderColor: '#f59e0b', color: '#f59e0b', justifyContent: 'flex-start' }}>
                                <Trash2 style={{ width: '14px', height: '14px' }} /> Reset VAKita Data (Clients, Invoices, Income)
                              </button>
                              <button onClick={() => setShowResetConfirm('achievements')} style={{ ...btnOutline, width: '100%', borderColor: '#f59e0b', color: '#f59e0b', justifyContent: 'flex-start' }}>
                                <Trash2 style={{ width: '14px', height: '14px' }} /> Reset Achievements ({userAchievements.length})
                              </button>
                              <button onClick={() => setShowResetConfirm('all')} style={{ ...btnDanger, width: '100%', justifyContent: 'flex-start' }}>
                                <Trash2 style={{ width: '14px', height: '14px' }} /> Reset ALL User Data
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {adminTab === 'feedback' && (
          <div style={card}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.cardBorder}` }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: 0 }}>User Feedback ({feedbacks.length})</h2>
            </div>
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {feedbacks.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <MessageSquare style={{ width: '40px', height: '40px', color: theme.textMuted, margin: '0 auto 12px' }} />
                  <p style={{ color: theme.textMuted }}>No feedback yet</p>
                </div>
              ) : (
                feedbacks.map(feedback => (
                  <div
                    key={feedback.id}
                    onClick={() => openFeedback(feedback)}
                    style={{
                      padding: '14px 20px',
                      borderBottom: `1px solid ${theme.cardBorder}`,
                      cursor: 'pointer',
                      backgroundColor: !feedback.read ? (isDark ? '#1e3a5f20' : '#dbeafe20') : 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {!feedback.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />}
                        <span style={{ fontSize: '14px', fontWeight: feedback.read ? '400' : '600', color: theme.text }}>{feedback.name || 'Anonymous'}</span>
                        <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', backgroundColor: theme.statBg, color: theme.textMuted }}>{feedback.type}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: theme.textMuted }}>{new Date(feedback.created_at).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {feedback.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {adminTab === 'stats' && (
          <div style={{ display: 'grid', gridTemplateColumns: isSmall ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#3b82f6' },
              { label: 'Active Users (30d)', value: stats.activeUsers, icon: User, color: '#22c55e' },
              { label: 'Total Expenses', value: stats.totalExpenses, icon: Receipt, color: '#f59e0b' },
              { label: 'Total Clients', value: stats.totalClients, icon: Briefcase, color: '#8b5cf6' },
              { label: 'Total Invoices', value: stats.totalInvoices, icon: FileText, color: '#ec4899' },
              { label: 'Total Income', value: `₱${formatAmount(stats.totalIncome)}`, icon: DollarSign, color: '#22c55e' },
            ].map((stat, i) => (
              <div key={i} style={{ ...card, padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: theme.textMuted }}>{stat.label}</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <stat.icon style={{ width: '18px', height: '18px', color: stat.color }} />
                  </div>
                </div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: theme.text, margin: 0 }}>{stat.value}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {/* Edit User Modal */}
      {showEditUserModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }} onClick={() => setShowEditUserModal(false)}>
          <div style={{ ...card, width: '100%', maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${theme.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: 0 }}>Edit User</h3>
              <button onClick={() => setShowEditUserModal(false)} style={{ ...btnOutline, width: '32px', height: '32px', padding: 0 }}>
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Nickname</label>
                <input type="text" value={editUserForm.nickname} onChange={e => setEditUserForm(p => ({ ...p, nickname: e.target.value }))} style={input} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Email</label>
                <input type="email" value={editUserForm.email} onChange={e => setEditUserForm(p => ({ ...p, email: e.target.value }))} style={input} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>New Password (leave blank to keep)</label>
                <input type="password" value={editUserForm.password} onChange={e => setEditUserForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" style={input} />
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderTop: `1px solid ${theme.cardBorder}`, display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowEditUserModal(false)} style={{ ...btnOutline, flex: 1 }}>Cancel</button>
              <button onClick={handleSaveUser} disabled={savingUser} style={{ ...btnPrimary, flex: 1, opacity: savingUser ? 0.6 : 1 }}>
                {savingUser ? <><Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} /> Saving...</> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }} onClick={() => setShowCreateUserModal(false)}>
          <div style={{ ...card, width: '100%', maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${theme.cardBorder}` }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: 0 }}>Create New User</h3>
              <p style={{ fontSize: '13px', color: theme.textMuted, margin: '4px 0 0' }}>User will be able to login immediately</p>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Email *</label>
                <input type="email" value={createUserForm.email} onChange={e => setCreateUserForm(p => ({ ...p, email: e.target.value }))} placeholder="user@example.com" style={input} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Password *</label>
                <input type="password" value={createUserForm.password} onChange={e => setCreateUserForm(p => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters" style={input} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Nickname</label>
                <input type="text" value={createUserForm.nickname} onChange={e => setCreateUserForm(p => ({ ...p, nickname: e.target.value }))} placeholder="Display name" style={input} />
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderTop: `1px solid ${theme.cardBorder}`, display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowCreateUserModal(false)} style={{ ...btnOutline, flex: 1 }}>Cancel</button>
              <button onClick={handleCreateUser} disabled={creatingUser || !createUserForm.email || !createUserForm.password} style={{ ...btnSuccess, flex: 1, opacity: (creatingUser || !createUserForm.email || !createUserForm.password) ? 0.6 : 1 }}>
                {creatingUser ? <><Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} /> Creating...</> : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }} onClick={() => { setShowDeleteConfirm(null); setConfirmText(''); }}>
          <div style={{ ...card, width: '100%', maxWidth: '400px', padding: '24px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle style={{ width: '28px', height: '28px', color: '#ef4444' }} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>Delete User?</h3>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: '0 0 16px' }}>
              This will permanently delete <strong>{showDeleteConfirm.email}</strong> and all their data.
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: theme.textMuted, marginBottom: '6px' }}>
                Type <strong style={{ color: '#ef4444' }}>delete</strong> to confirm:
              </label>
              <input type="text" value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="delete" style={input} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setShowDeleteConfirm(null); setConfirmText(''); }} style={{ ...btnOutline, flex: 1 }}>Cancel</button>
              <button onClick={handleDeleteUser} disabled={confirmText.toLowerCase() !== 'delete'} style={{ ...btnDanger, flex: 1, opacity: confirmText.toLowerCase() === 'delete' ? 1 : 0.5 }}>Delete User</button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirm Modal */}
      {showResetConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '20px' }} onClick={() => { setShowResetConfirm(null); setConfirmText(''); }}>
          <div style={{ ...card, width: '100%', maxWidth: '400px', padding: '24px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle style={{ width: '28px', height: '28px', color: '#f59e0b' }} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>Reset {showResetConfirm}?</h3>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: '0 0 16px' }}>
              This will permanently delete the user's {showResetConfirm === 'all' ? 'all data' : showResetConfirm} data.
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: theme.textMuted, marginBottom: '6px' }}>
                Type <strong style={{ color: '#ef4444' }}>delete</strong> to confirm:
              </label>
              <input type="text" value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="delete" style={input} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setShowResetConfirm(null); setConfirmText(''); }} style={{ ...btnOutline, flex: 1 }}>Cancel</button>
              <button onClick={() => handleResetUserData(showResetConfirm)} disabled={confirmText.toLowerCase() !== 'delete'} style={{ ...btnDanger, flex: 1, opacity: confirmText.toLowerCase() === 'delete' ? 1 : 0.5 }}>Reset</button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Detail Modal */}
      {viewingFeedback && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }} onClick={() => setViewingFeedback(null)}>
          <div style={{ ...card, width: '100%', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${theme.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: 0 }}>{viewingFeedback.name || 'Anonymous'}</h3>
                <p style={{ fontSize: '13px', color: theme.textMuted, margin: '4px 0 0' }}>{viewingFeedback.email || 'No email'}</p>
              </div>
              <button onClick={() => setViewingFeedback(null)} style={{ ...btnOutline, width: '32px', height: '32px', padding: 0 }}>
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', backgroundColor: theme.statBg, color: theme.textMuted }}>{viewingFeedback.type}</span>
                <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', backgroundColor: theme.statBg, color: theme.textMuted }}>{new Date(viewingFeedback.created_at).toLocaleString()}</span>
              </div>
              <p style={{ fontSize: '14px', color: theme.text, lineHeight: '1.7', margin: 0, whiteSpace: 'pre-wrap' }}>{viewingFeedback.message}</p>
            </div>
            <div style={{ padding: '16px 20px', borderTop: `1px solid ${theme.cardBorder}`, display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => deleteFeedback(viewingFeedback.id)} style={{ ...btnOutline, borderColor: '#ef4444', color: '#ef4444' }}>
                <Trash2 style={{ width: '14px', height: '14px' }} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
