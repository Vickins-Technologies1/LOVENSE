import React from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}
