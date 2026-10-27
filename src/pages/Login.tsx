import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import { Input } from '../components/Input.tsx';
import { Button } from '../components/Button.tsx';
import { ShieldAlert, Mail, Lock, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Login failed. Please verify your credentials and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 mx-auto flex items-center justify-center shadow-inner">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">
            Sign in to access your news verification dashboard and analysis history
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
            isLoading={isLoading}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Platform
          </Button>
        </form>

        {/* Quick Fill Demo Accounts */}
        <div className="pt-4 border-t border-slate-800 space-y-2.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
            Quick Fill Demo Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@credibility.org', 'AdminPass123!')}
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-700/50 text-left transition text-slate-300 group cursor-pointer"
            >
              <div className="flex items-center gap-1 font-semibold text-amber-400 text-[11px]">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate">admin@credibility.org</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('jane.doe@university.edu', 'UserPass123!')}
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-700/50 text-left transition text-slate-300 group cursor-pointer"
            >
              <div className="flex items-center gap-1 font-semibold text-blue-400 text-[11px]">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Verifier User</span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate">jane.doe@university.edu</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>Don't have an account? </span>
          <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
