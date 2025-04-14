import React, { useEffect } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { CartProvider } from '../context/CartContext';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import('aos')
      .then((AOS) => {
        AOS.default.init({
          duration: 600,
          easing: 'ease-out-cubic',
          once: true,
        });
      })
      .catch((error) => console.error('Failed to load AOS:', error));
  }, []);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/aos@next/dist/aos.css"
        />
        <title>Lovense - Premium Pleasure Products</title>
        <meta
          name="description"
          content="Explore premium sex toys designed for solo or shared pleasure."
        />
      </Head>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </>
  );
}
