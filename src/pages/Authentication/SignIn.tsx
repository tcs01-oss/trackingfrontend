import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import Logo from '../../images/logo/logo1.png';
import { toast } from 'react-toastify';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        let msg = 'Invalid credentials';
        try {
          const text = await res.text();
          try {
            const err = JSON.parse(text);
            msg = err?.error || err?.message || msg;
          } catch {
            msg = text || msg;
          }
        } catch {}
        setError(msg);
        toast.error(msg);
        return;
      }

      const data = await res.json().catch(() => ({}));

      const token = data?.token || data?.accessToken || '';
      localStorage.setItem('authToken', token);

      if (data) {
        const adminData = {
          id: data.id,
          name: data.name,
          email: data.email,
        };

        try {
          localStorage.setItem('authUser', JSON.stringify(adminData));
        } catch (e) {
          console.error('Failed to save adminData:', e);
        }
      }

      if (data && data.user) {
        try {
          localStorage.setItem('authUser', JSON.stringify(data.user));
        } catch (e) {
          console.error('Failed to save user:', e);
        }
      }

      toast.success('Login successful!');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err?.message || 'Network error';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-boxdark">
        {/* Left Side - Illustration */}
        <div className="hidden w-1/2 flex-col items-center justify-center bg-blue-50 p-12 dark:bg-blue-900/20 lg:flex">
          <div className="relative mb-6">
            <img src={Logo} alt="Logo" className="h-20 w-auto" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-black dark:text-white text-center">
            Welcome Back!
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Sign in to access your dashboard and manage your account.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <h2 className="mb-8 text-2xl font-bold text-black dark:text-white text-left">
            Login to Dashboard
          </h2>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Email Address
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary focus:ring-1 focus:ring-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary focus:ring-1 focus:ring-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

           

            {error && (
              <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-xs text-red-600 dark:border-red-500 dark:bg-transparent">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full cursor-pointer rounded-lg bg-primary py-3 text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Logging in...' : 'LOGIN'}
            </button>

           
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
