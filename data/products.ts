export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  features?: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Lush 3',
    price: 119.99,
    image: '/images/lush3.jpg',
    category: 'Vibrators',
    description: 'A powerful, app-controlled vibrator for solo or couple play.',
    features: ['Bluetooth connectivity', 'Body-safe silicone', 'Waterproof'],
  },
  {
    id: 2,
    name: 'Max 2',
    price: 99.99,
    image: '/images/max2.jpg',
    category: 'Male Toys',
    description: 'An innovative male masturbator with customizable settings.',
    features: ['App-controlled', 'Adjustable suction', 'Rechargeable'],
  },
  {
    id: 3,
    name: 'Nora',
    price: 129.99,
    image: '/images/nora.jpg',
    category: 'Vibrators',
    description: 'A versatile rabbit vibrator for intense pleasure.',
    features: ['Dual motors', 'Flexible design', 'USB charging'],
  },
  {
    id: 4,
    name: 'Domi 2',
    price: 89.99,
    image: '/images/domi2.jpg',
    category: 'Wands',
    description: 'A compact yet powerful wand for external stimulation.',
    features: ['Wireless control', 'Long battery life', 'Ergonomic grip'],
  },
];