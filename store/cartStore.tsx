// store/cartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface OrderSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getOrderSummary: () => OrderSummary;
  cartCount: number;
  cartTotal: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item) => {
        if (!item.id || item.quantity <= 0) {
          console.warn('Invalid cart item:', item);
          return;
        }
        set((state) => {
          const existingItem = state.cart.find((p) => p.id === item.id);
          if (existingItem) {
            return {
              cart: state.cart.map((p) =>
                p.id === item.id
                  ? { ...p, quantity: p.quantity + (item.quantity || 1) }
                  : p
              ),
            };
          }
          return { cart: [...state.cart, { ...item, quantity: item.quantity || 1 }] };
        });
      },
      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              cart: state.cart.filter((item) => item.id !== id),
            };
          }
          return {
            cart: state.cart.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          };
        });
      },
      clearCart: () => {
        set({ cart: [] });
      },
      getOrderSummary: () => {
        const cart = get().cart;
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const taxRate = 0.08; // 8% tax
        const tax = subtotal * taxRate;
        const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
        const total = subtotal + tax + shipping;

        return {
          subtotal: Number(subtotal.toFixed(2)),
          tax: Number(tax.toFixed(2)),
          shipping: Number(shipping.toFixed(2)),
          total: Number(total.toFixed(2)),
          itemCount,
        };
      },
      get cartCount() {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },
      get cartTotal() {
        return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);