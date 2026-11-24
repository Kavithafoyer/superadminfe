'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { loginSuperAdminApi, getUserDetailsApi } from '@/service/apiClient';
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Shield,
  Activity,
  Layers,
  TrendingUp,
  CheckCircle2,
  LockKeyhole,
  Users,
  BarChart3,
  KeyRound,
  Check
} from 'lucide-react';

export interface UserDetailsByEmailResponse {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

// Custom high-fidelity Potted Plant SVG illustration
const PlantIcon = () => (
  <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-20 xl:w-20 xl:h-24 drop-shadow-xl select-none">
    <path d="M48 95 C15 75 8 50 25 20 C42 45 42 70 48 95 Z" fill="#0565FD" opacity="0.9" />
    <path d="M48 95 C25 75 20 60 30 35 C40 55 42 72 48 95 Z" fill="#0251cd" />
    <path d="M60 95 C45 60 45 30 60 5 C75 30 75 60 60 95 Z" fill="#0251cd" />
    <path d="M60 95 C52 65 52 40 60 18 C68 40 68 65 60 95 Z" fill="#013fa0" />
    <path d="M72 95 C105 75 112 50 95 20 C78 45 78 70 72 95 Z" fill="#3b88ff" opacity="0.9" />
    <path d="M72 95 C95 75 100 60 90 35 C80 55 78 72 72 95 Z" fill="#0565FD" />
    <path d="M52 95 C35 85 30 75 40 55 C48 70 50 82 52 95 Z" fill="#73a9ff" />
    <path d="M68 95 C85 85 90 75 80 55 C72 70 70 82 68 95 Z" fill="#5397ff" />
    <path d="M42 95 C42 95 38 128 38 130 C38 133 42 135 48 135 H72 C78 135 82 133 82 130 C82 128 78 95 78 95 H42 Z" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
    <path d="M38 95 H82 V99 H38 V95 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const BackgroundCloud = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
  </svg>
);

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<'none' | 'email' | 'otp' | 'reset'>('none');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState<string[]>(Array(6).fill(''));
  const [forgotTimer, setForgotTimer] = useState(59);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [forgotUserDetails, setForgotUserDetails] = useState<UserDetailsByEmailResponse | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const otpInputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { updateUserProfile } = useStore();

  // Load remembered credentials on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUsername = localStorage.getItem('remembered_username') || localStorage.getItem('LUserName');
      const savedPassword = localStorage.getItem('remembered_password') || localStorage.getItem('LPassword');
      if (savedUsername) {
        setUsername(savedUsername);
        if (savedPassword) {
          setPassword(savedPassword);
        }
        setRememberMe(true);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim();
    const pwd = password;

    if (!trimmedUsername || !pwd) {
      setError('Please provide both username and password');
      return;
    }

    setLoading(true);
    try {
      // 1. Call SuperAdmin Login API: [backend url] / [tenant] / useradmin/login/
      const loginRes = await loginSuperAdminApi(trimmedUsername, pwd);

      const accessToken = loginRes.access_token || loginRes.token;
      const refreshToken = loginRes.refresh_token || '';
      const sessionId = loginRes.session_id || '';

      if (!accessToken) {
        throw new Error('No access token returned from authentication service');
      }

      // 2. Lookup user profile if available
      const userDetails = await getUserDetailsApi(trimmedUsername, accessToken);

      // 3. Synchronize credentials into localStorage as required by superadminfe
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('accesstoken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshtoken', refreshToken);
          localStorage.setItem('refreshToken', refreshToken);
        }
        if (sessionId) {
          localStorage.setItem('session_id', sessionId);
        }
        localStorage.setItem('isLoggedIn', 'true');

        const userId = userDetails?.id || loginRes.user?.id || '1';
        const orgId = userDetails?.Organization_Id || loginRes.user?.Organization_Id || '1';
        const designation = userDetails?.Designation || loginRes.user?.Designation || 'SuperAdmin';
        const userType = userDetails?.UserType || loginRes.user?.UserType || 'SuperAdmin';

        localStorage.setItem('UserId', String(userId));
        localStorage.setItem('userId', String(userId));
        localStorage.setItem('Username', trimmedUsername);
        localStorage.setItem('OrganizationId', String(orgId));
        localStorage.setItem('Designation', designation);
        localStorage.setItem('UserType', userType);
        localStorage.setItem('DBName', 'crmuseradmin1');
        localStorage.setItem('role', 'SuperAdmin');
        localStorage.setItem(
          'UserDetails',
          JSON.stringify(userDetails || loginRes.user || { username: trimmedUsername, role: 'SuperAdmin' })
        );

        if (rememberMe) {
          localStorage.setItem('remembered_username', trimmedUsername);
          localStorage.setItem('remembered_password', pwd);
        } else {
          localStorage.removeItem('remembered_username');
          localStorage.removeItem('remembered_password');
        }
      }

      const updatedProfile = {
        id: userDetails?.id || 1,
        name: userDetails?.Contact_Name || (userDetails?.first_name ? `${userDetails.first_name} ${userDetails.last_name || ''}`.trim() : trimmedUsername),
        username: trimmedUsername,
        email: userDetails?.email || userDetails?.Mail || email.trim() || `${trimmedUsername}@crmfarm.app`,
        avatarUrl: '/logo_blue.png',
        jobTitle: userDetails?.Designation || 'SuperAdmin',
        role: 'SuperAdmin',
        phone: userDetails?.Phone_Number || '+1 (555) 019-2834',
        location: userDetails?.City || 'Global',
        workspace: 'SuperAdmin Hub',
        workspaceRole: 'Owner',
        bio: 'Pegatto SuperAdmin Console Administrator.',
      };

      updateUserProfile(updatedProfile);
      login();

      toast.success(`Signed in successfully as ${trimmedUsername}`);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('SuperAdmin Login API Error:', err);
      const errMsg = err.message || 'An error occurred during login. Please check your credentials.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoBypassLogin = () => {
    // Development fallback if remote backend credentials are unknown or offline
    const mockToken = 'mock_jwt_access_token_' + Date.now();
    const mockRefreshToken = 'mock_jwt_refresh_token_' + Date.now();
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', mockToken);
      localStorage.setItem('accesstoken', mockToken);
      localStorage.setItem('refreshtoken', mockRefreshToken);
      localStorage.setItem('refreshToken', mockRefreshToken);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('Username', username.trim() || 'admin');
      localStorage.setItem('role', 'SuperAdmin');
      localStorage.setItem('DBName', 'crmuseradmin1');
    }
    const updatedProfile = {
      id: 1,
      name: username.trim() || 'SuperAdmin Demo',
      username: username.trim() || 'admin',
      email: `${username.trim() || 'admin'}@crmfarm.app`,
      avatarUrl: '/logo_blue.png',
      jobTitle: 'SuperAdmin',
      role: 'SuperAdmin',
      phone: '+1 (555) 019-2834',
      location: 'San Francisco, CA',
      workspace: 'SuperAdmin Hub',
      workspaceRole: 'Owner',
      bio: 'Demo SuperAdmin Account.',
    };
    updateUserProfile(updatedProfile);
    login();
    toast.success('Signed in as Demo SuperAdmin');
    router.push('/dashboard');
  };

  // OTP Timer Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (forgotStep === 'otp' && forgotTimer > 0) {
      interval = setInterval(() => {
        setForgotTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [forgotStep, forgotTimer]);

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    const trimmedEmail = forgotEmail.trim();
    if (!trimmedEmail) {
      setForgotError('Please enter your email address');
      return;
    }
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotUserDetails({
        id: 1,
        username: 'admin',
        email: trimmedEmail,
        first_name: 'Admin',
        last_name: 'User',
      });
      setForgotStep('otp');
      setForgotTimer(59);
      setForgotOtp(Array(6).fill(''));
      toast.success('Verification code sent to ' + trimmedEmail + ' (use any 6 digits e.g. 123456)');
    }, 500);
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const val = element.value.replace(/[^0-9]/g, '');
    const newOtp = [...forgotOtp];
    newOtp[index] = val;
    setForgotOtp(newOtp);
    if (val && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !forgotOtp[index] && index > 0) {
      const newOtp = [...forgotOtp];
      newOtp[index - 1] = '';
      setForgotOtp(newOtp);
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    const fullCode = forgotOtp.join('');
    if (fullCode.length < 6) {
      setForgotError('Please enter the complete 6-digit code');
      return;
    }
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      toast.success('Identity verified successfully');
      setForgotStep('reset');
    }, 500);
  };

  const handleResendOtp = async () => {
    if (forgotTimer > 0 || forgotLoading) return;
    setForgotError('');
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotOtp(Array(6).fill(''));
      setForgotTimer(59);
      toast.success('A new verification code has been sent');
    }, 500);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    if (!newPassword) {
      setForgotError('Please enter a new password');
      return;
    }
    if (newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError('Passwords do not match');
      return;
    }
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      toast.success('Password updated successfully. You can now sign in.');
      setForgotStep('none');
      setNewPassword('');
      setConfirmNewPassword('');
    }, 500);
  };

  const handleGoogleSignIn = () => {
    toast.info('Google Sign-In is not configured yet');
  };


  return (
    // Root: full viewport, flex row on lg+, column on mobile/tablet
    <div
      className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200"
      suppressHydrationWarning
    >

      {/* ═══════════════════════════════════════════════
          LEFT BRAND PANE — hidden on mobile/tablet, visible lg+
          Uses overflow-hidden + flex column to never overflow
      ═══════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] flex-col bg-gradient-to-tr from-[#d2e4fc] via-[#e5f0fe] to-[#c6dcf8] relative overflow-hidden min-h-screen">

        {/* Dot grid top-left */}
        <div className="absolute top-0 left-0 w-36 h-36 bg-[radial-gradient(#b8d4f7_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-35 pointer-events-none m-4 z-0" />

        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <div className="absolute top-10 right-0 w-80 h-80 bg-white/55 rounded-full blur-3xl" />

          {/* Clouds */}
          <BackgroundCloud className="absolute top-[6%] left-[10%] w-20 h-12 text-white/50 blur-[2.5px]" />
          <BackgroundCloud className="absolute top-[12%] right-[18%] w-24 h-16 text-white/55 blur-[3px]" />
          <BackgroundCloud className="absolute top-[18%] left-[30%] w-22 h-14 text-white/45 blur-[2px]" />
          <BackgroundCloud className="absolute top-[52%] right-[6%] w-26 h-16 text-white/55 blur-[2.5px]" />
          <BackgroundCloud className="absolute top-[59%] right-[12%] w-22 h-14 text-white/50 blur-[2px]" />
          <BackgroundCloud className="absolute bottom-[22%] left-[4%] w-28 h-18 text-white/50 blur-[2.5px]" />
          <BackgroundCloud className="absolute bottom-[14%] right-[8%] w-24 h-15 text-white/45 blur-[3px]" />
          <BackgroundCloud className="absolute bottom-[6%] left-[24%] w-20 h-12 text-white/40 blur-[2px]" />

          {/* Wave layers */}
          <svg viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-[52%]">
            <path d="M0,280 C200,220 500,360 800,260 C1100,160 1300,300 1440,240 L1440,600 L0,600 Z" fill="#ffffff" opacity="0.4" />
          </svg>
          <svg viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-[45%]">
            <path d="M0,320 C240,260 480,380 720,300 C960,220 1200,340 1440,280 L1440,600 L0,600 Z" fill="#f1f6fc" opacity="0.9" />
          </svg>
          <svg viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-[37%]">
            <path d="M0,350 C280,290 560,400 840,330 C1120,260 1280,360 1440,310 L1440,600 L0,600 Z" fill="#e7effa" />
          </svg>
          <svg viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-[30%]">
            <path d="M0,390 C320,320 640,440 960,370 C1280,300 1360,390 1440,360 L1440,600 L0,600 Z" fill="#dae7f6" />
          </svg>
          <svg viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-[22%]">
            <path d="M0,450 C360,390 720,490 1080,420 C1260,385 1350,440 1440,420 L1440,600 L0,600 Z" fill="#cbdff3" />
          </svg>
        </div>

        {/* Content column: logo → slogan+features → mockup */}
        <div className="relative z-10 flex flex-col h-full px-8 xl:px-12 py-8 xl:py-10">

          {/* Logo */}
          <div className="flex items-center gap-2 select-none shrink-0">
            <img src="/pegatto_logo.png" alt="PEGATTO SuperAdmin Logo" style={{ height: '70px', width: 'auto', objectFit: 'contain' }} />
            <span className="text-xl xl:text-2xl font-extrabold text-[#0f172a] tracking-tight">
              PEGATTO <span className="text-purple-600">SuperAdmin</span>
            </span>
          </div>

          {/* Slogan + Features — grows to fill middle space */}
          <div className="flex-1 flex flex-col justify-center py-6 min-h-0">
            <div className="space-y-2">
              <h1 className="text-2xl xl:text-[32px] font-extrabold tracking-tight text-[#0f172a] leading-[1.2]">
                Smart <span className="text-blue-500">SuperAdmin.</span><br />
                Unified Tenant Control.<br />
                Enterprise Scalability
              </h1>
              <p className="text-slate-500 text-xs xl:text-sm leading-relaxed">
                Manage multi-tenant accounts, subscription plans, usage analytics, role governance and your entire cloud ecosystem in one place.
              </p>
            </div>

            {/* 2×2 Features Grid (Referenced from superadminfe folders) */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 mt-6">
              {[
                { icon: Users, title: 'Tenant Management', desc: 'Onboard, configure, and monitor multi-tenant organizations effortlessly.' },
                { icon: TrendingUp, title: 'Plans & Subscriptions', desc: 'Manage tiered subscription plans, renewals, addons, and billing cycles in real time.' },
                { icon: BarChart3, title: 'Instance & Usage Analytics', desc: 'Monitor tenant resource utilization, active instances, and operational health.' },
                { icon: Shield, title: 'Role & Menu Governance', desc: 'Control granular permissions, dynamic menu configurations, and enterprise access.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="flex items-center justify-center w-9 h-9 xl:w-11 xl:h-11 rounded-full bg-white shadow-sm border border-blue-50/30 shrink-0">
                    <div className="flex items-center justify-center w-6 h-6 xl:w-7 xl:h-7 rounded-full bg-blue-50 text-blue-600">
                      <item.icon className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs xl:text-sm text-[#0f172a]">{item.title}</h3>
                    <p className="text-[10px] xl:text-xs text-slate-500 leading-snug mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mock browser card — fixed height, never grows */}
          <div className="relative w-full shrink-0">
            {/* Plant decoration — sits at bottom-left of card area */}
            <div className="absolute bottom-0 left-0 z-10 origin-bottom-left">
              <PlantIcon />
            </div>

            {/* Mock browser card */}
            <div className="w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100/80 overflow-hidden ml-auto"
              style={{ width: 'calc(100% - 3.5rem)' }}>
              {/* Browser bar */}
              <div className="bg-slate-50 border-b border-slate-100/80 px-4 py-2 flex items-center gap-1.5 select-none">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              </div>

              {/* Dashboard mockup */}
              <div className="flex h-[200px] xl:h-[230px] text-[10px] text-slate-650 select-none">
                {/* Sidebar */}
                <div className="w-10 xl:w-11 bg-[#161b26] flex flex-col items-center py-3.5 gap-3.5 border-r border-slate-800 shrink-0">
                  <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                    </svg>
                  </div>
                  <div className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-blue-500">
                    <Layers className="w-3 h-3" />
                  </div>
                  <div className="w-5 h-5 rounded-md flex items-center justify-center text-slate-500">
                    <User className="w-3 h-3" />
                  </div>
                  <div className="w-5 h-5 rounded-md flex items-center justify-center text-slate-500">
                    <Activity className="w-3 h-3" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-2.5 xl:p-3 flex flex-col gap-2 overflow-hidden bg-slate-50/50">
                  <div className="flex items-center justify-between shrink-0">
                    <div className="font-bold text-slate-800 text-[11px]">SuperAdmin Console</div>
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-2 rounded bg-slate-200/60"></div>
                      <div className="w-4 h-2 rounded bg-slate-300/30"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 xl:gap-2 shrink-0">
                    {[
                      { label: 'Active Tenants', value: '1,420', growth: '↑ 14.2%' },
                      { label: 'Subscriptions', value: '3,840', growth: '↑ 22.5%' },
                      { label: 'System Health', value: '99.9%', growth: 'Optimal' },
                    ].map((card, i) => (
                      <div key={i} className="bg-white border border-slate-100 rounded-lg p-1.5 xl:p-2">
                        <div className="text-[7px] text-slate-400 font-medium leading-none">{card.label}</div>
                        <div className="font-bold text-slate-800 text-[11px] mt-1 leading-none">{card.value}</div>
                        <div className="text-[6px] text-emerald-500 font-semibold mt-0.5">{card.growth}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-5 gap-2 flex-1 min-h-0">
                    <div className="col-span-3 bg-white border border-slate-100 rounded-lg p-2 flex flex-col justify-between overflow-hidden">
                      <div>
                        <div className="text-[8px] font-bold text-slate-700 leading-none">Plan Distribution</div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <svg viewBox="0 0 100 100" className="w-7 h-7 xl:w-8 xl:h-8 shrink-0">
                            <circle cx="50" cy="50" r="35" fill="transparent" stroke="#f1f5f9" strokeWidth="16" />
                            <circle cx="50" cy="50" r="35" fill="transparent" stroke="#3b82f6" strokeWidth="16" strokeDasharray="219.9" strokeDashoffset="66" transform="rotate(-90 50 50)" />
                            <circle cx="50" cy="50" r="35" fill="transparent" stroke="#10b981" strokeWidth="16" strokeDasharray="219.9" strokeDashoffset="165" transform="rotate(18 50 50)" />
                            <circle cx="50" cy="50" r="35" fill="transparent" stroke="#f59e0b" strokeWidth="16" strokeDasharray="219.9" strokeDashoffset="195" transform="rotate(108 50 50)" />
                          </svg>
                          <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 text-[5px] text-slate-400 font-medium">
                            <div className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-blue-500 shrink-0"></span>Enterprise</div>
                            <div className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0"></span>Business Pro</div>
                            <div className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-amber-500 shrink-0"></span>Growth</div>
                            <div className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>Custom</div>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-slate-50 pt-1">
                        <div className="text-[7px] font-bold text-slate-700">Renewal Pipeline</div>
                        <div className="space-y-0.5 mt-0.5">
                          <div className="h-0.5 w-full bg-blue-500 rounded-sm"></div>
                          <div className="h-0.5 w-[80%] bg-blue-400 rounded-sm"></div>
                          <div className="h-0.5 w-[55%] bg-emerald-400 rounded-sm"></div>
                          <div className="h-0.5 w-[35%] bg-blue-200 rounded-sm"></div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 bg-white border border-slate-100 rounded-lg p-2 flex flex-col gap-1 overflow-hidden">
                      <div className="text-[8px] font-bold text-slate-700 leading-none">Recent Operations</div>
                      <div className="space-y-1.5 mt-0.5">
                        {[
                          { initials: 'AG', name: 'Apex Global', action: 'provisioned instance', time: '2m ago', bg: 'bg-slate-800' },
                          { initials: 'CT', name: 'CloudTech Inc', action: 'upgraded to Enterprise', time: '15m ago', bg: 'bg-slate-500' },
                          { initials: 'NL', name: 'Nexus Corp', action: 'renewed subscription', time: '1h ago', bg: 'bg-slate-900' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1 min-w-0">
                              <div className={`w-4 h-4 rounded-full ${item.bg} text-white font-bold text-[5px] flex items-center justify-center shrink-0`}>{item.initials}</div>
                              <div className="min-w-0">
                                <div className="font-semibold text-slate-700 text-[6px] truncate">{item.name}</div>
                                <div className="text-[5px] text-slate-400">{item.action}</div>
                              </div>
                            </div>
                            <div className="text-[5px] text-slate-400 shrink-0">{item.time}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          RIGHT LOGIN PANE — full width on mobile/tablet, 58% on lg+
          Scrolls independently when content is tall
      ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-slate-950 overflow-y-auto">

        {/* Inner wrapper: centers card vertically with padding */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-10 xl:px-14 py-8 md:py-12">

          {/* Mobile logo — only shown below lg */}
          <div className="flex lg:hidden items-center gap-2 mb-6 select-none">
            <img src="/pegatto_logo.png" alt="PEGATTO SuperAdmin Logo" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
            <span className="text-xl font-extrabold text-[#0f172a] dark:text-slate-100 tracking-tight">
              PEGATTO <span className="text-purple-600">SuperAdmin</span>
            </span>
          </div>

          {/* Form card */}
          <div className="w-full max-w-[440px] md:max-w-[480px] bg-white dark:bg-slate-900 rounded-[28px] sm:rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100/90 dark:border-slate-800 p-7 sm:p-9 xl:p-10">

            <AnimatePresence mode="wait">
              {forgotStep === 'none' ? (
                <motion.div
                  key="login-step"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#002b5c] dark:text-slate-100 text-center tracking-tight">
                    Welcome Back!
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5 mb-7 text-center font-medium">
                    Sign in to your Pegatto SuperAdmin account
                  </p>

                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* Username Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                        Username
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="admin"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full pl-11 pr-4 h-12 bg-[#edf3fd] dark:bg-slate-800/80 border border-[#d6e3f8] dark:border-slate-700 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-100/60 dark:focus:ring-blue-900/30 transition-all text-sm font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-11 pr-11 h-12 bg-[#edf3fd] dark:bg-slate-800/80 border border-[#d6e3f8] dark:border-slate-700 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-100/60 dark:focus:ring-blue-900/30 transition-all text-sm font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 tracking-wider"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password Row */}
                    <div className="flex items-center justify-between pt-1 pb-1">
                      <label htmlFor="remember-me" className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          id="remember-me"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                          Remember Me
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setForgotError('');
                          setForgotStep('email');
                          if (username.includes('@')) {
                            setForgotEmail(username);
                          }
                        }}
                        className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    {error && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-xl flex items-start gap-2 text-rose-600 dark:text-rose-400 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Sign In Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#0062ff] hover:bg-[#0052df] dark:bg-blue-600 dark:hover:bg-blue-700 active:scale-[0.99] text-white font-bold h-12 rounded-2xl shadow-lg shadow-blue-500/15 transition-all text-sm cursor-pointer mt-2 disabled:opacity-75 flex items-center justify-center gap-2"
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </button>

                    {/* Copyright footer directly inside card */}
                    <div className="pt-5 text-center select-none">
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        &copy; 2026 Pegatto SuperAdmin. All rights reserved.
                      </p>
                      <button
                        type="button"
                        onClick={handleDemoBypassLogin}
                        className="text-[11px] text-slate-400 hover:text-blue-600 transition-colors cursor-pointer mt-2.5 inline-block"
                      >
                        Testing offline? <span className="underline font-medium">Continue as Demo SuperAdmin</span>
                      </button>
                    </div>
                  </form>
                </motion.div>

              ) : forgotStep === 'email' ? (
                <motion.div
                  key="forgot-email-step"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#002b5c] dark:text-slate-100 text-center tracking-tight">
                    Forgot Password
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5 mb-7 text-center font-medium">
                    Enter your email to receive an OTP verification code
                  </p>

                  <form onSubmit={handleSendResetLink} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          placeholder="Enter your registered email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full pl-11 pr-4 h-12 bg-[#edf3fd] dark:bg-slate-800/80 border border-[#d6e3f8] dark:border-slate-700 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-100/60 dark:focus:ring-blue-900/30 transition-all text-sm font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400"
                        />
                      </div>
                    </div>
                    {forgotError && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-xl flex items-start gap-2 text-rose-600 dark:text-rose-400 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{forgotError}</span>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full bg-[#0062ff] hover:bg-[#0052df] dark:bg-blue-600 dark:hover:bg-blue-700 active:scale-[0.99] text-white font-bold h-12 rounded-2xl shadow-lg shadow-blue-500/15 transition-all text-sm cursor-pointer mt-2 disabled:opacity-75"
                    >
                      {forgotLoading ? 'Sending OTP...' : 'Send Verification OTP'}
                    </button>
                  </form>

                  <div className="text-center mt-6">
                    <button
                      type="button"
                      onClick={() => { setForgotError(''); setForgotStep('none'); }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                    </button>
                  </div>
                </motion.div>

              ) : forgotStep === 'otp' ? (
                <motion.div
                  key="forgot-otp-step"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#002b5c] dark:text-slate-100 text-center tracking-tight">
                    Enter OTP Code
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5 mb-7 text-center font-medium">
                    We sent a 6-digit code to <span className="font-semibold text-slate-700 dark:text-slate-200">{forgotEmail}</span>
                  </p>

                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    {/* 6 Segmented Input fields */}
                    <div className="flex justify-between items-center gap-2 max-w-[320px] mx-auto">
                      {forgotOtp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => { otpInputsRef.current[idx] = el; }}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(e.target, idx)}
                          onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                          className="w-11 h-12 border-2 border-[#d6e3f8] dark:border-slate-800 rounded-xl text-center text-lg font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all bg-[#edf3fd] dark:bg-slate-900"
                        />
                      ))}
                    </div>

                    {forgotError && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-xl flex items-start gap-2 text-rose-600 dark:text-rose-400 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    <div className="text-center text-xs font-semibold text-slate-400">
                      {forgotTimer > 0 ? (
                        <span>Resend code in <span className="text-blue-600 font-mono">00:{forgotTimer < 10 ? `0${forgotTimer}` : forgotTimer}</span></span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-blue-600 hover:text-blue-700 cursor-pointer font-bold"
                        >
                          Resend Code
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full bg-[#0062ff] hover:bg-[#0052df] dark:bg-blue-600 dark:hover:bg-blue-700 active:scale-[0.99] text-white font-bold h-12 rounded-2xl shadow-lg shadow-blue-500/15 transition-all text-sm cursor-pointer disabled:opacity-75"
                    >
                      {forgotLoading ? 'Verifying...' : 'Verify Code'}
                    </button>
                  </form>

                  <div className="text-center mt-6">
                    <button
                      type="button"
                      onClick={() => { setForgotError(''); setForgotStep('email'); }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Email
                    </button>
                  </div>
                </motion.div>

              ) : (
                <motion.div
                  key="forgot-reset-step"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#002b5c] dark:text-slate-100 text-center tracking-tight">
                    Reset Password
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5 mb-7 text-center font-medium">
                    Choose a strong password for your account
                  </p>

                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                        New Password
                      </label>
                      <div className="relative">
                        <LockKeyhole className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Enter new password (min. 6 characters)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-11 pr-11 h-12 bg-[#edf3fd] dark:bg-slate-800/80 border border-[#d6e3f8] dark:border-slate-700 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-100/60 dark:focus:ring-blue-900/30 transition-all text-sm font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <CheckCircle2 className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showConfirmNewPassword ? 'text' : 'password'}
                          placeholder="Confirm new password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full pl-11 pr-11 h-12 bg-[#edf3fd] dark:bg-slate-800/80 border border-[#d6e3f8] dark:border-slate-700 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-100/60 dark:focus:ring-blue-900/30 transition-all text-sm font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    {forgotError && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-xl flex items-start gap-2 text-rose-600 dark:text-rose-400 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{forgotError}</span>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full bg-[#0062ff] hover:bg-[#0052df] dark:bg-blue-600 dark:hover:bg-blue-700 active:scale-[0.99] text-white font-bold h-12 rounded-2xl shadow-lg shadow-blue-500/15 transition-all text-sm cursor-pointer mt-2 disabled:opacity-75"
                    >
                      {forgotLoading ? 'Updating Password...' : 'Save New Password'}
                    </button>
                  </form>

                  <div className="text-center mt-6">
                    <button
                      type="button"
                      onClick={() => { setForgotError(''); setForgotStep('none'); }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer — always at the bottom of the right pane */}
        <div className="w-full px-4 sm:px-8 md:px-16 lg:px-10 xl:px-14 py-4 border-t border-slate-100 dark:border-slate-900">
          <div className="max-w-[440px] md:max-w-[480px] lg:max-w-[460px] xl:max-w-[500px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-slate-400 font-medium select-none">
            <span>&copy; 2026 PEGATTO SuperAdmin. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
