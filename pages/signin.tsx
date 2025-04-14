// pages/signin.tsx
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';
import styles from '../styles/Auth.module.css';
import { z } from 'zod';
import Image from 'next/image';

const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      signinSchema.parse({ email, password });

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Sign-in failed');
      }

      login(data.user, data.token);
      router.push('/products');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message, {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
    }
  };

  return (
    <Layout>
      <section className={styles.authSection}>
        <div className={styles.authCard}>
          <div className={styles.authImage}>
            <Image
              src="/lovense-logo.png"
              alt="Lovense Logo"
              width={150}
              height={80}
              priority
            />
          </div>
          <h1 className={styles.sectionTitle}>Sign In</h1>
          <p className={styles.sectionSubtitle}>
            Access your account to explore premium pleasure.
          </p>
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.formInput}
                required
                aria-describedby="email-error"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.formInput}
                required
                aria-describedby="password-error"
              />
            </div>
            {error && (
              <p className={styles.errorMessage} id="form-error">
                {error}
              </p>
            )}
            <button type="submit" className={styles.submitButton}>
              Sign In
            </button>
          </form>
          <p className={styles.authLink}>
            Don’t have an account?{' '}
            <a href="/signup" className={styles.link}>
              Sign Up
            </a>
          </p>
        </div>
      </section>
    </Layout>
  );
}