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
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

interface CartStore {
  cart: CartItem[];
  cartCount: number; // Add cartCount
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  getOrderSummary: () => OrderSummary;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      cartCount: 0, // Initialize cartCount
      addToCart: (item) => {
        set((state) => {
          const existingItem = state.cart.find((i) => i.id === item.id);
          if (existingItem) {
            const newCart = state.cart.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
            return {
              cart: newCart,
              cartCount: newCart.reduce((sum, item) => sum + item.quantity, 0), // Update cartCount
            };
          }
          const newCart = [...state.cart, { ...item, quantity: 1 }];
          return {
            cart: newCart,
            cartCount: newCart.reduce((sum, item) => sum + item.quantity, 0), // Update cartCount
          };
        });
      },
      removeFromCart: (id) => {
        set((state) => {
          const newCart = state.cart.filter((item) => item.id !== id);
          return {
            cart: newCart,
            cartCount: newCart.reduce((sum, item) => sum + item.quantity, 0), // Update cartCount
          };
        });
      },
      updateQuantity: (id, quantity) => {
        set((state) => {
          const newCart = state.cart
            .map((item) =>
              item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
            )
            .filter((item) => item.quantity > 0);
          return {
            cart: newCart,
            cartCount: newCart.reduce((sum, item) => sum + item.quantity, 0), // Update cartCount
          };
        });
      },
      getOrderSummary: () => {
        const cart = get().cart;
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * 0.08; // 8% tax
        const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
        const total = subtotal + tax + shipping;
        return { itemCount, subtotal, tax, shipping, total };
      },
      clearCart: () => {
        set({ cart: [], cartCount: 0 }); // Reset cartCount
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);