// store/cartStore.ts
import { create } from 'zustand';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  cartCount: number;
  cartTotal: number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  addToCart: (item) => {
    const cart = get().cart;
    const existingItem = cart.find(p => p.id === item.id);

    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map(p =>
        p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p
      );
    } else {
      updatedCart = [...cart, item];
    }

    set({ cart: updatedCart });
  },
  get cartCount() {
    return get().cart.reduce((sum, item) => sum + item.quantity, 0);
  },
  get cartTotal() {
    return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));
