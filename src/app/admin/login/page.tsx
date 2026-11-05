'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background Saffron/Navy Blurs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary/15 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <img src="/images/logo.png" alt="Ananya Express" className="w-16 h-16 object-contain rounded-2xl bg-white p-1 mx-auto shadow-lg" />
          <div>
            <h2 className="text-xl font-bold font-display text-white">Ananya Express</h2>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Admin Panel Access</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm p-4 rounded-lg font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-bold text-gray-400 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                placeholder="name@ananyaexpress.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-secondary focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-gray-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-secondary focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary hover:bg-secondary-light text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 text-sm shadow-lg hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Logging in...' : 'Access Dashboard'}</span>
            <ArrowRight className="h-4 w-4 text-accent" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[10px] text-slate-500 leading-normal">
            For security reasons, login sessions automatically expire after 24 hours. Contact the systems administrator if you forgot your credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
