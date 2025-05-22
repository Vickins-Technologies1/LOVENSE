// components/Layout.tsx
import React, { ReactNode, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';
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
import { useCart } from '../context/CartContext';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({
  children,
  title = 'Lovense - Premium Pleasure Products',
  description = 'Explore premium sex toys designed for solo or shared pleasure.',
}: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { cart } = useCart();
  const { data: session } = useSession();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const isAuthenticated = !!session?.user;

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
      sidebarRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isSidebarOpen) {
      closeSidebar();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/signin' });
      toast.success('Logged out successfully', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'light',
      });
      closeSidebar();
    } catch (error) {
      toast.error('Failed to log out', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'light',
      });
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/icon.png" />
      </Head>

      {isLoading && (
        <div className={styles.preloader}>
          <div className={styles.preloaderContent}>
            <Image
              src="/lovense-logo.png"
              alt="Lovense brand logo"
              width={140}
              height={74}
              className={styles.preloaderLogo}
              priority
              sizes="(max-width: 768px) 120px, 140px"
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
              alt="Lovense brand logo"
              width={150}
              height={80}
              priority
              sizes="(max-width: 768px) 120px, 150px"
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
                onClick={handleLogout}
                className={styles.navLink}
                aria-label="Log out of account"
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
            aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        <div
          className={`${styles.sidebarBackdrop} ${isSidebarOpen ? styles.visible : ''}`}
          onClick={closeSidebar}
          onKeyDown={handleKeyDown}
          tabIndex={isSidebarOpen ? 0 : -1}
          aria-hidden={!isSidebarOpen}
        />

        <div
          ref={sidebarRef}
          className={`${styles.mobileSidebar} ${isSidebarOpen ? styles.open : ''}`}
          tabIndex={isSidebarOpen ? 0 : -1}
          onKeyDown={handleKeyDown}
        >
          <div className={styles.sidebarHeader}>
            <span>Menu</span>
            <button
              onClick={closeSidebar}
              aria-label="Close navigation menu"
            >
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
              onClick={handleLogout}
              className={styles.mobileLink}
              aria-label="Log out of account"
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