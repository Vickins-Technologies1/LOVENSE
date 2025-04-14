// components/Layout.tsx
import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  LogIn,
  UserPlus,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import styles from '../styles/Layout.module.css';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const cartCount = useCartStore((state) => state.cartCount || 0);
  const { isAuthenticated, logout } = useAuthStore();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Lovense - Premium Pleasure Products</title>
        <meta
          name="description"
          content="Explore premium sex toys designed for solo or shared pleasure."
        />
        <link rel="icon" href="/icon.png" />
      </Head>

      {isLoading && (
        <div className={styles.preloader}>
          <div className={styles.preloaderContent}>
            <Image
              src="/lovense-logo.png"
              alt="Lovense Logo"
              width={140}
              height={74}
              className={styles.preloaderLogo}
              priority
            />
            <div className={styles.waveContainer}>
              <div className={styles.wave}></div>
              <div className={styles.wave}></div>
              <div className={styles.wave}></div>
            </div>
            <div className={styles.particles}>
              <span className={styles.particle}></span>
              <span className={styles.particle}></span>
              <span className={styles.particle}></span>
              <span className={styles.particle}></span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col min-h-screen">
        <nav className={styles.navbar}>
          <Link href="/" className={styles.navLogo}>
            <Image
              src="/lovense-logo.png"
              alt="Lovense Logo"
              width={150}
              height={80}
              priority
            />
          </Link>

          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLink}>
              <Home size={18} className="mr-2" />
              Home
            </Link>
            <Link href="/products" className={styles.navLink}>
              <ShoppingBag size={18} className="mr-2" />
              Products
            </Link>
            <Link href="/cart" className={styles.navLink}>
              <ShoppingCart size={18} className="mr-2" />
              Cart
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  closeSidebar();
                }}
                className={styles.navLink}
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </button>
            ) : (
              <>
                <Link href="/signin" className={styles.navLink}>
                  <LogIn size={18} className="mr-2" />
                  Sign In
                </Link>
                <Link href="/signup" className={styles.navLink}>
                  <UserPlus size={18} className="mr-2" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className={styles.menuToggle}
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        <div
          className={`${styles.sidebarBackdrop} ${isSidebarOpen ? styles.visible : ''}`}
          onClick={closeSidebar}
        />

        <div
          className={`${styles.mobileSidebar} ${isSidebarOpen ? styles.open : ''}`}
        >
          <div className={styles.sidebarHeader}>
            <span>Menu</span>
            <button onClick={closeSidebar} aria-label="Close Sidebar">
              <X size={22} />
            </button>
          </div>
          <Link href="/" className={styles.mobileLink} onClick={closeSidebar}>
            <Home size={18} className="mr-2" />
            Home
          </Link>
          <Link href="/products" className={styles.mobileLink} onClick={closeSidebar}>
            <ShoppingBag size={18} className="mr-2" />
            Products
          </Link>
          <Link href="/cart" className={styles.mobileLink} onClick={closeSidebar}>
            <ShoppingCart size={18} className="mr-2" />
            Cart
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </Link>
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                closeSidebar();
              }}
              className={styles.mobileLink}
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          ) : (
            <>
              <Link href="/signin" className={styles.mobileLink} onClick={closeSidebar}>
                <LogIn size={18} className="mr-2" />
                Sign In
              </Link>
              <Link href="/signup" className={styles.mobileLink} onClick={closeSidebar}>
                <UserPlus size={18} className="mr-2" />
                Sign Up
              </Link>
            </>
          )}
        </div>

        <main className="flex-grow container mx-auto p-6 pt-28">{children}</main>

        <footer className={styles.footer}>
          © {new Date().getFullYear()} Lovense — All rights reserved.
        </footer>
      </div>
    </>
  );
}