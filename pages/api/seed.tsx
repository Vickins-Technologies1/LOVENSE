// pages/api/seed.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../lib/mongodb';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  features?: string[];
}

const seedData: Product[] = [
  {
    id: 1,
    name: 'Lush 3',
    price: 119.99,
    image: '/images/lush3.png',
    category: 'Vibrators',
    description: 'A powerful, app-controlled vibrator for solo or partner play.',
    features: ['App-controlled', 'Body-safe silicone', 'Waterproof'],
  },
  {
    id: 2,
    name: 'Max 2',
    price: 99.99,
    image: '/images/max2.png',
    category: 'Male Toys',
    description: 'A high-tech male masturbator with adjustable suction.',
    features: ['Adjustable suction', 'App-controlled', 'Rechargeable'],
  },
  {
    id: 3,
    name: 'Nora',
    price: 129.99,
    image: '/images/nora.png',
    category: 'Vibrators',
    description: 'A versatile rabbit vibrator with dual motors.',
    features: ['Dual motors', 'Remote control', 'Body-safe materials'],
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method?.toUpperCase() !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const db = await getDb();
    const collection = db.collection<Product>('products');

    await collection.deleteMany({});
    const result = await collection.insertMany(seedData);

    res.status(200).json({
      message: 'Database seeded successfully',
      count: result.insertedCount,
    });
  } catch (error) {
    console.error('Seeding error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to seed database';
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? errorMessage : 'An unexpected error occurred',
    });
  }
}