// pages/cart.tsx
import React from 'react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import styles from '../styles/Cart.module.css';
import { toast } from 'react-toastify';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getOrderSummary } = useCart();
  const summary = getOrderSummary();

  const handleQuantityChange = (id: number, quantity: number) => {
    updateQuantity(id, quantity);
    if (quantity === 0) {
      const item = cart.find((i) => i.id === id);
      toast.info(`${item?.name} removed from cart`, {
        position: 'top-right',
        autoClose: 2000,
        theme: 'light',
      });
    }
  };

  return (
    <Layout>
      <section className={styles.cartSection}>
        <h1 className={styles.sectionTitle}>Your Shopping Cart</h1>
        <p className={styles.sectionSubtitle}>
          Review your selected pleasure products before checkout.
        </p>

        {cart.length === 0 ? (
          <div className={styles.emptyCart}>
            <p className={styles.emptyMessage}>Your cart is empty.</p>
            <a href="/products" className={styles.shopButton}>
              Shop Now
            </a>
          </div>
        ) : (
          <div className={styles.cartContent}>
            <div className={styles.cartItems}>
              {cart.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={100}
                      height={100}
                      className={styles.productImage}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <h2 className={styles.itemName}>{item.name}</h2>
                    <p className={styles.itemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                      <span className={styles.unitPrice}>
                        (${item.price.toFixed(2)} each)
                      </span>
                    </p>
                    <div className={styles.quantityControl}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus size={16} />
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <button
                    className={styles.removeButton}
                    onClick={() => {
                      removeFromCart(item.id);
                      toast.info(`${item.name} removed from cart`, {
                        position: 'top-right',
                        autoClose: 2000,
                        theme: 'light',
                      });
                    }}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.cartSummary}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              <div className={styles.summaryDetails}>
                <p className={styles.summaryRow}>
                  <span>Subtotal ({summary.itemCount} items)</span>
                  <span>${summary.subtotal.toFixed(2)}</span>
                </p>
                <p className={styles.summaryRow}>
                  <span>Tax (8%)</span>
                  <span>${summary.tax.toFixed(2)}</span>
                </p>
                <p className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span>
                    {summary.shipping === 0 ? 'Free' : `$${summary.shipping.toFixed(2)}`}
                  </span>
                </p>
                <p className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>${summary.total.toFixed(2)}</span>
                </p>
              </div>
              <button
                className={styles.checkoutButton}
                onClick={() => toast.info('Checkout is not implemented yet!', {
                  position: 'top-right',
                  autoClose: 2000,
                })}
              >
                Proceed to Checkout
              </button>
              <a href="/products" className={styles.continueShopping}>
                Continue Shopping
              </a>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}