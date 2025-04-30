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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const db = await getDb();
    const seedData: Product[] = [
      {
        id: 1,
        name: 'Sample Product',
        price: 99.99,
        image: '/images/lovense-logo.png',
        category: 'Electronics',
        description: 'A sample product description',
        features: ['Feature 1', 'Feature 2'],
      },
    ];

    await db.collection<Product>('products').deleteMany({});
    await db.collection<Product>('products').insertMany(seedData);

    res.status(200).json({ message: 'Database seeded successfully', count: seedData.length });
  } catch (error) {
    console.error('Seeding error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Internal server error', error: errorMessage });
  }
}