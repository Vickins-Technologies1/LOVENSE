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
} from 'lucide-react';
import styles from '../styles/Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // ✅ useState now inside the component
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Optional: grab cart count from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(storedCart.length);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);


  return (
    <>
      {/* Favicon and Meta Tags */}
      <Head>
        <title>Lovense - Premium Pleasure Products</title>
        <meta name="description" content="Explore premium sex toys designed for solo or shared pleasure." />
        <link rel="icon" href="/icon.png" />
      </Head>

      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
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

          {/* Desktop Links */}
          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLink}>
              <Home size={18} />
              Home
            </Link>
            <Link href="/products" className={styles.navLink}>
              <ShoppingBag size={18} />
              Products
            </Link>
            <Link href="/cart" className={styles.navLink}>
              <ShoppingCart size={18} />
              Cart
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </Link>

            <Link href="/signin" className={styles.navLink}>
              <LogIn size={18} />
              Sign In
            </Link>
            <Link href="/signup" className={styles.navLink}>
              <UserPlus size={18} />
              Sign Up
            </Link>
          </div>

          <button
            className={styles.menuToggle}
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* Sidebar Overlay */}
        <div
          className={`${styles.sidebarBackdrop} ${isSidebarOpen ? styles.visible : ''}`}
          onClick={closeSidebar}
        />

        {/* Mobile Sidebar */}
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
            <Home size={18} />
            Home
          </Link>
          <Link href="/products" className={styles.mobileLink} onClick={closeSidebar}>
            <ShoppingBag size={18} />
            Products
          </Link>
          <Link href="/cart" className={styles.mobileLink} onClick={closeSidebar}>
            <ShoppingCart size={18} />
            Cart
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </Link>

          <Link href="/signin" className={styles.mobileLink} onClick={closeSidebar}>
            <LogIn size={18} />
            Sign In
          </Link>
          <Link href="/signup" className={styles.mobileLink} onClick={closeSidebar}>
            <UserPlus size={18} />
            Sign Up
          </Link>
        </div>

        {/* Page Content */}
        <main className="flex-grow container mx-auto p-6 pt-28">{children}</main>

        {/* Footer */}
        <footer className={styles.footer}>
          © {new Date().getFullYear()} Lovense — All rights reserved.
        </footer>
      </div>
    </>
  );
}