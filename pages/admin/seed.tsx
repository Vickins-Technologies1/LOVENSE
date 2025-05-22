// pages/admin/seed.tsx
import { useState } from 'react';
import Layout from '../../components/Layout';
import { toast } from 'react-toastify';
import styles from '../../styles/Admin.module.css';

export default function SeedDatabase() {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Seeded ${data.count} products`, {
          position: 'top-right',
          autoClose: 2000,
          theme: 'light',
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error('Failed to seed database', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'light',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Admin - Seed Database" description="Seed the product database.">
      <section className={styles.adminSection}>
        <h1>Seed Database</h1>
        <p>Click the button below to populate the database with sample products.</p>
        <button
          className={styles.seedButton}
          onClick={handleSeed}
          disabled={loading}
          aria-label="Seed database with sample products"
        >
          {loading ? 'Seeding...' : 'Seed Database'}
        </button>
      </section>
    </Layout>
  );
}