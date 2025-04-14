import React from 'react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between border-b py-2">
              <div>
                <h2>{item.name}</h2>
                <p>Quantity: {item.quantity}</p>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <h2 className="text-xl mt-4">Total: ${total.toFixed(2)}</h2>
          <button className="bg-green-500 text-white px-4 py-2 mt-4">
            Proceed to Checkout
          </button>
        </div>
      )}
    </Layout>
  );
}