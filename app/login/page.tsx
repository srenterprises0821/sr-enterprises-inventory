'use client';
import { FormEvent, useState } from 'react';
import { api } from '@/lib/client/api';
import { useToast } from '@/components/ui/Providers';

export default function LoginPage() {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      const u = await api<{ theme?: string }>('/api/auth/login', {
        method: 'POST',
        body: { email: f.get('email'), password: f.get('password'), remember: f.get('remember') === 'on' }
      });
      if (u?.theme && !localStorage.srt) localStorage.srt = u.theme;
      window.location.href = '/dashboard';
    } catch (err) {
      toast((err as Error).message, true);
      setBusy(false);
    }
  }
  return (
    <div className="login">
      <form className="card" onSubmit={submit}>
        <div className="brand">
          <svg width="34" height="34" viewBox="0 0 86 86" aria-hidden>
            <rect width="86" height="86" rx="20" fill="#10a37f" />
            <text x="43" y="56" fontSize="34" fontWeight="800" fill="#fff" textAnchor="middle">SR</text>
          </svg>
          <div>SR<br /><small style={{ fontWeight: 400 }}>ENTERPRISES</small></div>
        </div>
        <p style={{ color: 'var(--mut)', margin: '4px 0 6px' }}>Sign in to your workspace</p>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required autoFocus />
        <label htmlFor="password">Password</label>
        <div style={{ position: 'relative' }}>
          <input
            id="password"
            name="password"
            type={showPw ? 'text' : 'password'}
            autoComplete="current-password"
            required
            style={{ paddingRight: 42 }}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
            aria-pressed={showPw}
            style={{
              position: 'absolute',
              right: 6,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              padding: 6,
              cursor: 'pointer',
              color: 'var(--mut)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {showPw ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '14px 0' }}>
          <input name="remember" type="checkbox" style={{ width: 'auto' }} /> Remember this device
        </label>
        <button className="p" style={{ width: '100%' }} disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}