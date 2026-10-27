import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import { userAPI } from '../services/api.ts';
import { Input } from '../components/Input.tsx';
import { Button } from '../components/Button.tsx';
import {
  User as UserIcon,
  Mail,
  Calendar,
  FileCheck,
  Shield,
  Lock,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Name state
  const [name, setName] = useState('');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getProfile();
      if (res.data.success) {
        setProfileData(res.data.data);
        setName(res.data.data.name);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to retrieve profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setNameSaving(true);
    setNameSuccess(false);
    try {
      const res = await userAPI.updateProfile({ name: name.trim() });
      if (res.data.success) {
        updateUser({ name: res.data.data.name });
        setNameSuccess(true);
        setTimeout(() => setNameSuccess(false), 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update profile name.');
    } finally {
      setNameSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError('Please provide your current password.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New password confirmation does not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await userAPI.updateProfile({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      if (res.data.success) {
        setPasswordSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setTimeout(() => setPasswordSuccess(false), 4000);
      }
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-xs font-mono text-slate-400">Loading user profile telemetry...</p>
      </div>
    );
  }

  const joinDate = profileData?.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold text-2xl flex items-center justify-center font-mono">
            {profileData?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{profileData?.name}</h1>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono uppercase text-blue-300">
                {profileData?.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{profileData?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Account Telemetry Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <FileCheck className="w-4 h-4 text-blue-400" />
            <span>Total Analyses</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {profileData?.totalAnalyses || 0}
          </div>
          <p className="text-[11px] text-slate-500">Evaluations conducted on this profile</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Member Since</span>
          </div>
          <div className="text-sm font-bold font-mono text-white pt-1">{joinDate}</div>
          <p className="text-[11px] text-slate-500">Registration timestamp</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Role Privileges</span>
          </div>
          <div className="text-sm font-bold font-mono text-white pt-1 capitalize">
            {profileData?.role} Access
          </div>
          <p className="text-[11px] text-slate-500">
            {profileData?.role === 'admin' ? 'Full administrative rights' : 'Standard verifier'}
          </p>
        </div>
      </div>

      {/* Profile Modification Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Edit Name Form */}
        <form
          onSubmit={handleUpdateName}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm"
        >
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-blue-400" />
              <span>Update Profile Name</span>
            </h3>
            <p className="text-xs text-slate-400">
              Modify the display name associated with your verification submissions.
            </p>
          </div>

          {nameSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Name updated successfully.</span>
            </div>
          )}

          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={nameSaving}
            className="w-full"
          >
            Save Display Name
          </Button>
        </form>

        {/* Change Password Form */}
        <form
          onSubmit={handleChangePassword}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm"
        >
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Change Password</span>
            </h3>
            <p className="text-xs text-slate-400">
              Update your account credentials using bcrypt hashing.
            </p>
          </div>

          {passwordSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Password updated successfully.</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />

          <Input
            label="New Password"
            type="password"
            placeholder="Min. 8 characters"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-type new password"
            value={confirmNewPassword}
            onChange={e => setConfirmNewPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="secondary"
            size="sm"
            isLoading={passwordSaving}
            className="w-full"
          >
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};
