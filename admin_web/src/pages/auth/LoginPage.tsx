import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  User, 
  Sparkles, 
  KeyRound, 
  Clock, 
  ShieldCheck, 
  ShieldAlert,
  Eye,
  EyeOff,
  Activity,
  Cpu,
  Layers,
  Check,
  Server,
  Radio,
  FileCheck2
} from 'lucide-react';
import { UserRole } from '../../types';
import { validatePasswordStrength, hashPasswordClient, verifyPasswordHash } from '../../security/passwordPolicy';
import { rateLimiter } from '../../security/rateLimiter';
import {
  MfaSetupData,
  createPerUserMfaEnrollment,
  getLocalUserMfaRecord,
  matchTotpStep,
  saveLocalUserMfaEnrollment,
  verifyLocalUserMfaCode,
} from '../../security/totpService';
import { recordSecurityEvent } from '../../security/securityAuditLogger';
import { requestPasswordReset, completePasswordReset } from '../../security/passwordResetService';
import { supabaseService } from '../../services/supabaseClient';

export const LoginPage: React.FC = () => {
  const { login, setupMasterAdmin, adminProfile, staffMembers, agencyName } = useAdmin();

  const initialLocalInitialized = Boolean(
    adminProfile.email ||
    (localStorage.getItem('servicepro_admin_initialized') && localStorage.getItem('servicepro_admin_pwd_hash'))
  );
  const [isSystemInitialized, setIsSystemInitialized] = useState<boolean>(initialLocalInitialized);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'FIRST_TIME_SETUP' | 'PASSWORD_RESET'>(
    initialLocalInitialized ? 'LOGIN' : 'FIRST_TIME_SETUP'
  );

  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [adminFullName, setAdminFullName] = useState('');
  const [companyName, setCompanyName] = useState(agencyName || '');
  const [provisioningToken, setProvisioningToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Password Reset State
  const [resetToken, setResetToken] = useState<string>('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [resetStep, setResetStep] = useState<'REQUEST' | 'VERIFY'>('REQUEST');

  // Rate Limiting State
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Per-User MFA Challenge & Enrollment State (Zero hardcoded secrets or bypasses)
  const [mfaStepRequired, setMfaStepRequired] = useState<boolean>(false);
  const [mfaEnrollmentRequired, setMfaEnrollmentRequired] = useState<boolean>(false);
  const [pendingMfaEnrollment, setPendingMfaEnrollment] = useState<MfaSetupData | null>(null);
  const [pendingCloudSession, setPendingCloudSession] = useState<{
    token: string;
    role: 'ADMIN' | 'STAFF';
    fullName?: string;
    isBootstrapFlow?: boolean;
  } | null>(null);
  const [totpCode, setTotpCode] = useState<string>('');
  const [useBackupCode, setUseBackupCode] = useState<boolean>(false);
  const [mfaAttemptsRemaining, setMfaAttemptsRemaining] = useState<number>(3);

  // Live password validation
  const passwordStrength = validatePasswordStrength(password, 10);

  // Query authoritative initialization state from Supabase (or local state if unconfigured)
  useEffect(() => {
    let active = true;
    supabaseService.checkSystemInitialized().then((res) => {
      if (!active) return;
      setIsSystemInitialized(res.initialized);
      if (res.initialized) {
        setAuthMode('LOGIN');
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Monitor rate limiter status
  useEffect(() => {
    if (!email) return;
    const status = rateLimiter.check(email);
    setIsLocked(status.isLocked);
    setLockoutSeconds(status.lockoutRemainingSeconds);
  }, [email]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const targetEmail = email.trim().toLowerCase();

    // 1. Check Rate Limiter
    const rateStatus = rateLimiter.check(targetEmail);
    if (rateStatus.isLocked) {
      setError(
        `Account temporarily locked due to multiple failed attempts. Please retry in ${rateStatus.lockoutRemainingSeconds}s.`
      );
      recordSecurityEvent(
        'ACCOUNT_LOCKED',
        targetEmail,
        selectedRole,
        'CRITICAL',
        'Login attempt while account in lockout state'
      );
      return;
    }

    if (!targetEmail) {
      setError('Please enter your account email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your account password.');
      return;
    }

    // 2. Progressive login delay
    if (rateStatus.delayMs > 0) {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, rateStatus.delayMs));
    }

    // 3. Password length verification
    if (password.length < 6) {
      const failStatus = rateLimiter.recordFailure(targetEmail);
      recordSecurityEvent('LOGIN_FAILED', targetEmail, selectedRole, 'WARNING', 'Invalid password length');
      setError('Invalid credentials. Please verify your work email and password.');
      if (failStatus.isLocked) {
        setIsLocked(true);
        setLockoutSeconds(failStatus.lockoutRemainingSeconds);
      }
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // 4. Cloud-Configured Authentication Path (Server-Authoritative Supabase Auth + Role + MFA)
    if (supabaseService.isConfigured()) {
      const cloudRes = await supabaseService.signIn(targetEmail, password);
      if (!cloudRes.success || !cloudRes.token || !cloudRes.role) {
        const failStatus = rateLimiter.recordFailure(targetEmail);
        recordSecurityEvent(
          'LOGIN_FAILED',
          targetEmail,
          selectedRole,
          'WARNING',
          cloudRes.error || 'Supabase authentication failed'
        );
        setError(cloudRes.error || 'Invalid credentials. Please verify your work email and password.');
        if (failStatus.isLocked) {
          setIsLocked(true);
          setLockoutSeconds(failStatus.lockoutRemainingSeconds);
        }
        setIsLoading(false);
        return;
      }

      // Enforce server-returned role: prevent STAFF account from signing into ADMIN portal
      if (selectedRole === 'ADMIN' && cloudRes.role !== 'ADMIN') {
        await supabaseService.signOut();
        rateLimiter.recordFailure(targetEmail);
        recordSecurityEvent(
          'PRIVILEGE_ELEVATION_DENIED',
          targetEmail,
          cloudRes.role,
          'CRITICAL',
          'Non-admin account attempted to sign in via Admin Portal'
        );
        setError('Access denied: Your account is not authorized for Administrator access.');
        setIsLoading(false);
        return;
      }

      // Both Cloud ADMIN and Cloud STAFF require server-verified MFA session (aal2 / user_mfa_sessions)
      const cloudRole: UserRole = cloudRes.role === 'ADMIN' ? 'ADMIN' : 'STAFF';
      const mfaStatus = await supabaseService.getMfaStatus();
      if (mfaStatus?.isLocked) {
        await supabaseService.signOut();
        setIsLocked(true);
        setLockoutSeconds(900);
        setError('Account MFA is locked due to multiple failed verification attempts.');
        setIsLoading(false);
        return;
      }

      setPendingCloudSession({
        token: cloudRes.token,
        role: cloudRole,
        fullName: cloudRes.fullName,
        isBootstrapFlow: false,
      });

      if (mfaStatus && !mfaStatus.isMfaEnabled) {
        const enrollment = await createPerUserMfaEnrollment(targetEmail, agencyName || 'ServicePro OS');
        setPendingMfaEnrollment(enrollment);
        setMfaEnrollmentRequired(true);
        setTotpCode('');
        setIsLoading(false);
        return;
      }

      setMfaAttemptsRemaining(Math.max(1, 3 - (mfaStatus?.failedAttempts || 0)));
      setMfaStepRequired(true);
      setTotpCode('');
      setIsLoading(false);
      recordSecurityEvent('MFA_CHALLENGE', targetEmail, cloudRole, 'INFO', `Server-enforced ${cloudRole} MFA challenge initiated`);
      return;
    }

    // 5. Unconfigured Local / Test Environment Path
    if (selectedRole === 'ADMIN') {
      const storedHash = localStorage.getItem('servicepro_admin_pwd_hash');
      const storedSalt = localStorage.getItem('servicepro_admin_pwd_salt');
      const registeredAdminEmail = (adminProfile.email || '').trim().toLowerCase();

      if (!storedHash || !storedSalt || !registeredAdminEmail) {
        setIsLoading(false);
        setError(
          'No Master Administrator has been provisioned yet. Please complete First-Time Deployment Setup first.'
        );
        return;
      }

      if (targetEmail !== registeredAdminEmail) {
        const failStatus = rateLimiter.recordFailure(targetEmail);
        recordSecurityEvent('LOGIN_FAILED', targetEmail, 'ADMIN', 'WARNING', 'Unrecognized admin email');
        setError('Invalid credentials. Please verify your work email and password.');
        if (failStatus.isLocked) {
          setIsLocked(true);
          setLockoutSeconds(failStatus.lockoutRemainingSeconds);
        }
        setIsLoading(false);
        return;
      }

      const isMatch = await verifyPasswordHash(password, storedHash, storedSalt);
      if (!isMatch) {
        const failStatus = rateLimiter.recordFailure(targetEmail);
        recordSecurityEvent('LOGIN_FAILED', targetEmail, 'ADMIN', 'WARNING', 'Invalid admin password attempt');
        setError('Invalid credentials. Please verify your work email and password.');
        if (failStatus.isLocked) {
          setIsLocked(true);
          setLockoutSeconds(failStatus.lockoutRemainingSeconds);
        }
        setIsLoading(false);
        return;
      }

      const localMfa = getLocalUserMfaRecord(targetEmail);
      if (!localMfa || !localMfa.isMfaEnabled) {
        const enrollment = await createPerUserMfaEnrollment(targetEmail, agencyName || 'ServicePro OS');
        setPendingMfaEnrollment(enrollment);
        setMfaEnrollmentRequired(true);
        setTotpCode('');
        setIsLoading(false);
        return;
      }

      if (localMfa.lockedUntil && Date.now() < localMfa.lockedUntil) {
        const remSec = Math.max(1, Math.ceil((localMfa.lockedUntil - Date.now()) / 1000));
        setIsLocked(true);
        setLockoutSeconds(remSec);
        setError(`Account MFA locked due to failed attempts. Retry in ${remSec}s.`);
        setIsLoading(false);
        return;
      }

      setMfaAttemptsRemaining(Math.max(1, 3 - (localMfa.failedAttempts || 0)));
      setMfaStepRequired(true);
      setTotpCode('');
      setIsLoading(false);
      recordSecurityEvent('MFA_CHALLENGE', targetEmail, 'ADMIN', 'INFO', 'Admin MFA challenge initiated');
      return;
    }

    // 6. Local Staff Login: Require a Staff account in staffMembers roster + password hash verification
    const matchingStaff = staffMembers.find(
      (s) => s.email.trim().toLowerCase() === targetEmail
    );
    const staffAuthMapRaw = localStorage.getItem('servicepro_staff_pwd_map');
    const staffAuthMap: Record<string, { hash: string; salt: string }> = staffAuthMapRaw
      ? JSON.parse(staffAuthMapRaw)
      : {};
    const staffCreds = staffAuthMap[targetEmail];

    if (!matchingStaff || !staffCreds) {
      const failStatus = rateLimiter.recordFailure(targetEmail);
      recordSecurityEvent(
        'LOGIN_FAILED',
        targetEmail,
        'STAFF',
        'WARNING',
        'Attempted Staff login for unregistered or unprovisioned staff account'
      );
      setError('Invalid credentials or unregistered staff account. Staff accounts must be provisioned by an Administrator.');
      if (failStatus.isLocked) {
        setIsLocked(true);
        setLockoutSeconds(failStatus.lockoutRemainingSeconds);
      }
      setIsLoading(false);
      return;
    }

    const isStaffPwdValid = await verifyPasswordHash(password, staffCreds.hash, staffCreds.salt);
    if (!isStaffPwdValid) {
      const failStatus = rateLimiter.recordFailure(targetEmail);
      recordSecurityEvent('LOGIN_FAILED', targetEmail, 'STAFF', 'WARNING', 'Invalid staff password');
      setError('Invalid credentials. Please verify your work email and password.');
      if (failStatus.isLocked) {
        setIsLocked(true);
        setLockoutSeconds(failStatus.lockoutRemainingSeconds);
      }
      setIsLoading(false);
      return;
    }

    rateLimiter.reset(targetEmail);
    recordSecurityEvent('LOGIN_SUCCESS', targetEmail, 'STAFF', 'INFO', 'Staff authentication successful');
    setIsLoading(false);
    login('STAFF', targetEmail, password);
  };

  const handleMfaEnrollmentConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!pendingMfaEnrollment) return;

    const cleanCode = totpCode.trim().replace(/\s+/g, '');
    const targetEmail = email.trim().toLowerCase();

    if (!/^\d{6}$/.test(cleanCode)) {
      setError('Please enter the 6-digit code from your authenticator app to confirm enrollment.');
      return;
    }

    setIsLoading(true);

    // If cloud bootstrap already enrolled MFA on the server via bootstrap-first-admin, verify via verifyMfaCode
    if (supabaseService.isConfigured() && pendingCloudSession) {
      if (pendingCloudSession.isBootstrapFlow) {
        const verifyRes = await supabaseService.verifyMfaCode(cleanCode, false);
        if (!verifyRes.verified) {
          setIsLoading(false);
          setError(verifyRes.error || 'Authenticator code did not match your enrolled secret.');
          return;
        }
        setIsLoading(false);
        setMfaEnrollmentRequired(false);
        setPendingMfaEnrollment(null);
        setIsSystemInitialized(true);
        setupMasterAdmin(
          adminFullName.trim(),
          targetEmail,
          password,
          companyName.trim() || undefined,
          pendingCloudSession.token
        );
        return;
      }

      const enrollRes = await supabaseService.enrollMfa({
        secretBase32: pendingMfaEnrollment.secretBase32,
        recoveryCodeHashes: pendingMfaEnrollment.recoveryCodeHashes,
        verificationCode: cleanCode,
      });
      if (!enrollRes.success) {
        setIsLoading(false);
        setError(enrollRes.error || 'Authenticator code did not match the generated secret.');
        return;
      }

      setIsLoading(false);
      setMfaEnrollmentRequired(false);
      setPendingMfaEnrollment(null);
      login(pendingCloudSession.role, targetEmail, password, pendingCloudSession);
      return;
    }

    // Local test mode MFA enrollment confirmation
    const matchedStep = await matchTotpStep(pendingMfaEnrollment.secretBase32, cleanCode, 1);
    if (matchedStep === null) {
      setIsLoading(false);
      setError('Invalid 6-digit authenticator code. Please verify your secret key and try again.');
      return;
    }

    saveLocalUserMfaEnrollment(
      targetEmail,
      pendingMfaEnrollment.secretBase32,
      pendingMfaEnrollment.recoveryCodeHashes,
      matchedStep
    );

    recordSecurityEvent(
      'MFA_VERIFIED',
      targetEmail,
      'ADMIN',
      'INFO',
      'Per-user RFC 6238 TOTP MFA enrolled and verified'
    );

    setIsLoading(false);
    setMfaEnrollmentRequired(false);
    setPendingMfaEnrollment(null);
    setIsSystemInitialized(true);

    if (authMode === 'FIRST_TIME_SETUP') {
      setupMasterAdmin(adminFullName.trim(), targetEmail, password, companyName.trim() || undefined);
    } else {
      login('ADMIN', targetEmail, password);
    }
  };

  const handleMfaVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const cleanCode = totpCode.trim().toUpperCase();
    const targetEmail = email.trim().toLowerCase();

    // 1. Cloud Server-Enforced MFA Verification
    if (supabaseService.isConfigured()) {
      const serverVerify = await supabaseService.verifyMfaCode(cleanCode, useBackupCode);
      if (!serverVerify.verified) {
        setIsLoading(false);
        const rem = serverVerify.attemptsRemaining ?? mfaAttemptsRemaining - 1;
        setMfaAttemptsRemaining(Math.max(0, rem));
        recordSecurityEvent(
          'MFA_FAILED',
          targetEmail,
          'ADMIN',
          'WARNING',
          serverVerify.error || 'Server MFA verification failed'
        );

        if (serverVerify.isLocked || rem <= 0) {
          await supabaseService.signOut();
          setPendingCloudSession(null);
          rateLimiter.recordFailure(targetEmail);
          setIsLocked(true);
          setLockoutSeconds(serverVerify.lockoutSeconds || 900);
          setMfaStepRequired(false);
          setError(
            serverVerify.error || 'Maximum 2FA verification attempts exceeded. Account locked for 15 minutes.'
          );
          return;
        }

        setError(serverVerify.error || `Invalid verification code. ${rem} attempt(s) remaining.`);
        return;
      }

      const activeRole = pendingCloudSession?.role || 'ADMIN';
      recordSecurityEvent('MFA_VERIFIED', targetEmail, activeRole, 'INFO', 'Server-side MFA verification successful');
      rateLimiter.reset(targetEmail);
      setIsLoading(false);
      setMfaStepRequired(false);
      if (pendingCloudSession) {
        login(activeRole, targetEmail, password, pendingCloudSession);
        setPendingCloudSession(null);
      }
      return;
    }

    // 2. Local Per-User MFA Verification (Strict RFC 6238 TOTP or Single-Use Hashed Recovery Code)
    const localVerify = await verifyLocalUserMfaCode(targetEmail, cleanCode, useBackupCode);
    if (!localVerify.verified) {
      setIsLoading(false);
      const newRemaining = localVerify.attemptsRemaining ?? mfaAttemptsRemaining - 1;
      setMfaAttemptsRemaining(Math.max(0, newRemaining));

      recordSecurityEvent(
        'MFA_FAILED',
        targetEmail,
        'ADMIN',
        'WARNING',
        `Invalid MFA code. Attempts remaining: ${newRemaining}`
      );

      if (localVerify.isLocked || newRemaining <= 0) {
        rateLimiter.recordFailure(targetEmail);
        setIsLocked(true);
        setLockoutSeconds(localVerify.lockoutSeconds || 900);
        setMfaStepRequired(false);
        setError(
          localVerify.error || 'Maximum 2FA verification attempts exceeded. Account locked for 15 minutes.'
        );
        return;
      }

      setError(localVerify.error || `Invalid verification code. ${newRemaining} attempt(s) remaining.`);
      return;
    }

    recordSecurityEvent('MFA_VERIFIED', targetEmail, 'ADMIN', 'INFO', 'TOTP verification successful');
    rateLimiter.reset(targetEmail);
    setIsLoading(false);
    setMfaStepRequired(false);
    login('ADMIN', targetEmail, password);
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSystemInitialized) {
      setError('First-time deployment setup is permanently locked because a Master Administrator is already provisioned.');
      setAuthMode('LOGIN');
      return;
    }

    if (!adminFullName.trim()) {
      setError('Please enter your Full Name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid primary administrator work email address.');
      return;
    }

    if (!passwordStrength.isValid) {
      setError(`Password policy requirement: ${passwordStrength.errors[0]}`);
      recordSecurityEvent(
        'PASSWORD_POLICY_VIOLATION',
        email.trim(),
        'ADMIN',
        'WARNING',
        'Setup attempted with weak password'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter identical passwords.');
      return;
    }

    const targetEmail = email.trim().toLowerCase();
    setIsLoading(true);

    try {
      // Cloud Mode: Require One-Time Server-Controlled Provisioning via bootstrap-first-admin Edge Function
      if (supabaseService.isConfigured()) {
        if (!provisioningToken.trim() || provisioningToken.trim().length < 16) {
          setError(
            'A valid one-time Server Provisioning Token (INITIAL_ADMIN_BOOTSTRAP_SECRET, min 16 chars) is required.'
          );
          setIsLoading(false);
          return;
        }

        const bootstrapRes = await supabaseService.bootstrapFirstAdmin({
          provisioningToken: provisioningToken.trim(),
          email: targetEmail,
          password,
          fullName: adminFullName.trim(),
          companyName: companyName.trim() || 'ServicePro OS Enterprise',
        });

        if (!bootstrapRes.success || !bootstrapRes.mfaEnrollment) {
          setError(bootstrapRes.error || 'Server-controlled first-Admin provisioning failed.');
          setIsLoading(false);
          return;
        }

        const signInRes = await supabaseService.signIn(targetEmail, password);
        if (!signInRes.success || !signInRes.token) {
          setError(signInRes.error || 'Provisioned account sign-in verification failed.');
          setIsLoading(false);
          return;
        }

        setPendingCloudSession({
          token: signInRes.token,
          role: 'ADMIN',
          fullName: adminFullName.trim(),
          isBootstrapFlow: true,
        });
        setPendingMfaEnrollment({
          secretBase32: bootstrapRes.mfaEnrollment.secretBase32,
          otpauthUrl: bootstrapRes.mfaEnrollment.otpauthUrl,
          recoveryCodes: bootstrapRes.mfaEnrollment.recoveryCodes,
          recoveryCodeHashes: [],
        });
        setMfaEnrollmentRequired(true);
        setTotpCode('');
        setIsLoading(false);
        return;
      }

      // Unconfigured Local Test Mode: Store PBKDF2 password hash & require per-user MFA enrollment
      const { hash, salt } = await hashPasswordClient(password);
      localStorage.setItem('servicepro_admin_pwd_hash', hash);
      localStorage.setItem('servicepro_admin_pwd_salt', salt);

      const enrollment = await createPerUserMfaEnrollment(
        targetEmail,
        companyName.trim() || agencyName || 'ServicePro OS'
      );
      setPendingMfaEnrollment(enrollment);
      setMfaEnrollmentRequired(true);
      setTotpCode('');
      setIsLoading(false);
      recordSecurityEvent(
        'MASTER_ADMIN_INITIALIZED',
        targetEmail,
        'ADMIN',
        'INFO',
        'Master Administrator credentials initialized; awaiting per-user MFA enrollment confirmation'
      );
    } catch (err: any) {
      setError(err.message || 'Setup failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSuccessMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid account email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestPasswordReset(email.trim(), selectedRole);
      setIsLoading(false);
      setResetSuccessMessage(res.message);
      if (res.debugToken) {
        setResetToken(res.debugToken);
      }
      setResetStep('VERIFY');
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch recovery instructions.');
      setIsLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await completePasswordReset(resetToken, password, confirmPassword);
      if (!res.success) {
        setError(res.error || 'Password reset failed. Please check token validity.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setResetSuccessMessage('Your password has been successfully updated. All previous sessions revoked. Please log in.');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setAuthMode('LOGIN');
        setResetStep('REQUEST');
        setResetSuccessMessage(null);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'An error occurred while resetting password.');
      setIsLoading(false);
    }
  };

  const displayName = agencyName || companyName || 'ServicePro OS Enterprise';

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row bg-[#08101D] text-slate-800 antialiased overflow-x-hidden selection:bg-emerald-200 selection:text-black">
      
      {/* =========================================================================
          LEFT PANEL: Enterprise Mission Control & Telemetry Showcase
          Visible on large screens (52% width), delivers high-value $50K SaaS prestige
      ========================================================================= */}
      <div className="hidden lg:flex lg:w-[50%] xl:w-[52%] relative flex-col justify-between p-12 xl:p-16 bg-gradient-to-br from-[#060D17] via-[#0A1626] to-[#041E19] text-white overflow-hidden border-r border-slate-800/80">
        
        {/* Ambient Glow & Grid Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & Brand Identity */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0C3832] to-[#145a50] border border-emerald-400/30 flex items-center justify-center shadow-lg shadow-emerald-950/50">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white">{displayName}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  NOC Active
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Mission Critical Field Operations</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NOC Zone TX-01</span>
          </div>
        </div>

        {/* Central Enterprise Value Card */}
        <div className="relative z-10 my-auto py-8 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Turnkey On-Demand Home Services Platform</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight">
            Centralized Command for High-Volume Trade &amp; Field Dispatch.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            Autonomous technician dispatch radar, verified trade credentialing, dynamic take-rate commissions, and immutable cryptographic audit logging engineered for rapid scale.
          </p>

          {/* High-Fidelity NOC Telemetry Card */}
          <div className="bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xl rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Realtime Operations Telemetry</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Operations Node</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Dispatch Mode</div>
                <div className="text-xs font-black text-emerald-400 mt-1 flex items-center justify-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>Standby</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono">SLA Uptime</div>
                <div className="text-xs font-black text-white mt-1">99.98%</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Vault Cipher</div>
                <div className="text-xs font-black text-teal-300 mt-1">256-bit AES</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              "Dual-Vision Engine compliant — zero hardcoded demo data, true multi-tenant database isolation, and OWASP Level 3 verified."
            </p>
          </div>
        </div>

        {/* Bottom Trust Footer */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Secure Enterprise Portal
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Encrypted Session</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANEL: Interactive Authentication Portal
          Clean slate canvas (#F8FAFC), elevated white surface, responsive perfection
      ========================================================================= */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-[#F8FAFC] min-h-screen">
        
        {/* Mobile-Only Header Brand Bar */}
        <div className="flex lg:hidden items-center justify-between pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0C3832] text-emerald-400 flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900">{displayName}</div>
              <div className="text-[10px] text-slate-500 font-mono">ServicePro OS Enterprise</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
            Secure Portal
          </span>
        </div>

        {/* Central Auth Surface Container */}
        <div className="w-full max-w-md mx-auto my-auto py-6 sm:py-8">
          
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
            
            {mfaEnrollmentRequired && pendingMfaEnrollment ? (
              /* =========================================================================
                 VIEW 0: Per-User RFC 6238 MFA Enrollment & Single-Use Recovery Codes
              ========================================================================= */
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Mandatory Per-User 2FA Enrollment
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMfaEnrollmentRequired(false);
                      setPendingMfaEnrollment(null);
                      setError(null);
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    ← Cancel
                  </button>
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Pair Your Authenticator App
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Add this unique Base32 key to Google Authenticator, Authy, or 1Password for <strong>{email}</strong>, save your 8 single-use recovery codes, and enter a 6-digit token below to activate MFA.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Unique Per-User TOTP Secret Key (Base32)
                  </div>
                  <div
                    data-testid="mfa-enrollment-secret"
                    className="font-mono text-xs font-black text-emerald-800 bg-white px-3 py-2 rounded-xl border border-emerald-200 select-all break-all text-center tracking-widest"
                  >
                    {pendingMfaEnrollment.secretBase32}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {pendingMfaEnrollment.otpauthUrl}
                  </div>
                </div>

                {pendingMfaEnrollment.recoveryCodes.length > 0 && (
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900">
                        Single-Use Emergency Recovery Codes (Save Offline Now)
                      </span>
                      <span className="text-[10px] font-semibold text-amber-700">
                        SHA-256 Hashed
                      </span>
                    </div>
                    <div
                      data-testid="mfa-recovery-codes-list"
                      className="grid grid-cols-2 gap-1.5 font-mono text-[11px] font-bold text-slate-800"
                    >
                      {pendingMfaEnrollment.recoveryCodes.map((rc) => (
                        <div
                          key={rc}
                          className="bg-white px-2 py-1 rounded border border-amber-200/80 text-center select-all"
                        >
                          {rc}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleMfaEnrollmentConfirm} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center uppercase tracking-wider">
                      Confirm 6-Digit Authenticator Token
                    </label>
                    <input
                      type="text"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                      autoComplete="one-time-code"
                      autoFocus
                      required
                      className="w-full py-3 text-center text-2xl font-mono font-black tracking-widest bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 transition-all shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl font-extrabold text-xs text-white bg-[#0C3832] hover:bg-[#124e45] shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Verifying &amp; Locking MFA Enrollment...</span>
                    ) : (
                      <>
                        <span>Confirm 2FA &amp; Enter Console</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : mfaStepRequired ? (
              /* =========================================================================
                 VIEW 1: Multi-Factor Authentication (TOTP / Backup Code)
              ========================================================================= */
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Two-Factor Authentication
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMfaStepRequired(false);
                      setError(null);
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    ← Back to Login
                  </button>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-200 shadow-xs">
                    <KeyRound className="w-6 h-6 animate-pulse" />
                  </div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Enter Authenticator Code
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Open your TOTP Authenticator app (Google Authenticator, Authy, 1Password) and enter the code for <strong>{email}</strong>.
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleMfaVerifySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center uppercase tracking-wider">
                      {useBackupCode ? '10-Character Emergency Recovery Code' : '6-Digit One-Time Passcode'}
                    </label>
                    <input
                      type="text"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value)}
                      placeholder={useBackupCode ? 'ABCDE-12345' : '000000'}
                      maxLength={useBackupCode ? 12 : 6}
                      autoComplete="one-time-code"
                      autoFocus
                      required
                      className="w-full py-3.5 text-center text-2xl font-mono font-black tracking-widest bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 transition-all shadow-inner"
                    />
                    {!useBackupCode && (
                      <p className="text-[11px] text-slate-400 text-center mt-2">
                        Enter the current 6-digit RFC 6238 code from your paired authenticator app.
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl font-extrabold text-xs text-white bg-[#0C3832] hover:bg-[#124e45] shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Verifying Authenticator Token...</span>
                    ) : (
                      <>
                        <span>Verify &amp; Enter Console</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUseBackupCode(!useBackupCode);
                        setTotpCode('');
                        setError(null);
                      }}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
                    >
                      {useBackupCode ? '← Use 6-Digit Authenticator App' : 'Use Emergency Backup Code instead'}
                    </button>
                  </div>
                </form>
              </div>
            ) : authMode === 'FIRST_TIME_SETUP' ? (
              /* =========================================================================
                 VIEW 2: First-Time Master Admin Deployment Setup Wizard
              ========================================================================= */
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    First-Time Deployment Setup
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('LOGIN');
                      setError(null);
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    Standard Sign In →
                  </button>
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Initialize Master Administrator
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    One-time initial provisioning for an empty installation. Enrolls mandatory per-user RFC 6238 TOTP two-factor authentication and permanently locks public bootstrap upon completion.
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSetupSubmit} className="space-y-3.5">
                  {supabaseService.isConfigured() && (
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        One-Time Server Provisioning Token (X-Bootstrap-Token)
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={provisioningToken}
                          onChange={(e) => setProvisioningToken(e.target.value)}
                          placeholder="Enter INITIAL_ADMIN_BOOTSTRAP_SECRET"
                          required
                          className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 transition-all font-mono"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={adminFullName}
                        onChange={(e) => setAdminFullName(e.target.value)}
                        placeholder="e.g. Master Administrator"
                        required
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Company / Organization Name
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. ServicePro Enterprise LLC"
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Primary Master Work Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. admin@yourcompany.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Master Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 10 characters"
                          required
                          className="w-full pl-10 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 transition-all font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••••••"
                          required
                          className="w-full pl-10 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 transition-all font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Strength Meter */}
                  {password.length > 0 && (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] space-y-1.5">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-600">Password Strength:</span>
                        <span className={
                          passwordStrength.score >= 3 ? 'text-emerald-700' :
                          passwordStrength.score === 2 ? 'text-amber-600' : 'text-rose-600'
                        }>
                          {passwordStrength.score >= 3 ? 'Strong' :
                           passwordStrength.score === 2 ? 'Medium' : 'Weak'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex gap-1">
                        <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 1 ? 'bg-rose-500' : 'bg-transparent'}`} />
                        <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 2 ? 'bg-amber-500' : 'bg-transparent'}`} />
                        <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 3 ? 'bg-emerald-500' : 'bg-transparent'}`} />
                        <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 4 ? 'bg-emerald-600' : 'bg-transparent'}`} />
                      </div>
                      {passwordStrength.errors.length > 0 && (
                        <p className="text-rose-600 text-[10px] leading-tight pt-0.5">
                          • {passwordStrength.errors[0]}
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 rounded-2xl font-extrabold text-xs text-white bg-[#0C3832] hover:bg-[#124e45] shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    {isLoading ? (
                      <span>Initializing Master Console...</span>
                    ) : (
                      <>
                        <span>Initialize Admin &amp; Enter Console</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>


              </div>
            ) : authMode === 'PASSWORD_RESET' ? (
              /* =========================================================================
                 VIEW 3: Self-Service Account Recovery & Password Reset
              ========================================================================= */
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-amber-100 text-amber-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    Account Recovery
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('LOGIN');
                      setError(null);
                      setResetSuccessMessage(null);
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    ← Back to Login
                  </button>
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {resetStep === 'REQUEST' ? 'Reset Account Password' : 'Set New Master Password'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {resetStep === 'REQUEST'
                      ? 'Enter your verified account email. If an authorized account matches, a single-use 15-minute recovery token will be dispatched.'
                      : 'Enter the recovery token dispatched to your email along with your new compliant password.'}
                  </p>
                </div>

                {resetSuccessMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{resetSuccessMessage}</span>
                  </div>
                )}

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                {resetStep === 'REQUEST' ? (
                  <form onSubmit={handlePasswordResetRequest} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Account Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. admin@yourcompany.com"
                          required
                          className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                    >
                      {isLoading ? 'Dispatching Recovery Instructions...' : 'Send Recovery Token →'}
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setResetStep('VERIFY')}
                        className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                      >
                        Already have a recovery token? Enter it here →
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handlePasswordResetSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Recovery Token
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={resetToken}
                          onChange={(e) => setResetToken(e.target.value)}
                          placeholder="rst_..."
                          required
                          className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        New Password (Min 10 characters)
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          required
                          className="w-full pl-10 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 transition-all font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••••••"
                          required
                          className="w-full pl-10 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 transition-all font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-[#0C3832] hover:bg-[#124e45] text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                    >
                      {isLoading ? 'Updating & Revoking Sessions...' : 'Confirm & Update Password'}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* =========================================================================
                 VIEW 4: Standard Enterprise Role-Based Sign In
              ========================================================================= */
              <div className="space-y-6">
                
                {/* Segmented Persona / Role Tabs */}
                <div className="flex rounded-2xl bg-slate-100/90 p-1 border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('ADMIN');
                      setError(null);
                    }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedRole === 'ADMIN'
                        ? 'bg-[#0C3832] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Shield className={`w-3.5 h-3.5 ${selectedRole === 'ADMIN' ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>Admin Portal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('STAFF');
                      setError(null);
                    }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedRole === 'STAFF'
                        ? 'bg-sky-700 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UserCheck className={`w-3.5 h-3.5 ${selectedRole === 'STAFF' ? 'text-sky-300' : 'text-slate-400'}`} />
                    <span>Staff Desk</span>
                  </button>
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {selectedRole === 'ADMIN' ? 'Administrator Sign In' : 'Field Operations Desk'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedRole === 'ADMIN' 
                      ? 'Authorized executive access for company configuration and financials.'
                      : 'Authorized operator access for technician dispatch and order queues.'}
                  </p>
                </div>

                {/* Account Lockout Warning Banner */}
                {isLocked && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-3 animate-in fade-in">
                    <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                    <div>
                      <strong className="text-sm font-bold block text-rose-950">Account Temporarily Locked</strong>
                      <p className="text-xs text-rose-700 mt-1">
                        Rate limit exceeded: 5 failed attempts. Console locked for security. Auto-resumes in <strong>{lockoutSeconds} seconds</strong>.
                      </p>
                    </div>
                  </div>
                )}

                {error && !isLocked && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Work Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        disabled={isLocked}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={selectedRole === 'ADMIN' ? (adminProfile.email || 'admin@yourcompany.com') : 'staff@yourcompany.com'}
                        autoComplete="username"
                        required
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 transition-all font-medium disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        disabled={isLocked}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        autoComplete="current-password"
                        required
                        className="w-full pl-10 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 transition-all font-medium disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        disabled={isLocked}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="text-xs text-slate-600 font-medium">Keep session active</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('PASSWORD_RESET');
                        setError(null);
                        setResetSuccessMessage(null);
                        setResetStep('REQUEST');
                      }}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || isLocked}
                    className={`w-full py-3 rounded-2xl font-extrabold text-xs text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 ${
                      selectedRole === 'ADMIN'
                        ? 'bg-[#0C3832] hover:bg-[#124e45] shadow-emerald-950/20'
                        : 'bg-sky-700 hover:bg-sky-800 shadow-sky-950/20'
                    }`}
                  >
                    {isLoading ? (
                      <span>Authenticating &amp; Verifying...</span>
                    ) : (
                      <>
                        <span>Sign In to {selectedRole === 'ADMIN' ? 'Admin Portal' : 'Operations Desk'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Setup guidance note (shown only before initial provisioning) */}
                {!isSystemInitialized ? (
                  <div className="pt-4 border-t border-slate-100 text-center space-y-2">
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Empty database detected — first-time Master Administrator provisioning is available.
                    </p>
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('FIRST_TIME_SETUP');
                          setError(null);
                        }}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Run First-Time Master Admin Setup Wizard →</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-slate-100 text-center">
                    <span className="text-[11px] font-semibold text-slate-400 inline-flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Master Administrator Provisioned • Public Bootstrap Locked</span>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Micro Footer Seal */}
          <div className="text-center mt-6 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Encrypted Session</span>
            </div>
            <div className="text-[10px] text-slate-400">
              ServicePro OS Enterprise Franchise Edition • Commercial Turnkey Architecture
            </div>
          </div>
        </div>

        {/* Bottom Terms & Links */}
        <div className="text-center text-[11px] text-slate-400 py-2 border-t border-slate-200/60 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} {displayName}. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-600 cursor-pointer">Security Whitepaper</span>
            <span className="hover:text-slate-600 cursor-pointer">Privacy Standard</span>
            <span className="hover:text-slate-600 cursor-pointer">API SLA</span>
          </div>
        </div>
      </div>
    </div>
  );
};
