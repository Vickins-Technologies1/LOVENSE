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
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const db = await getDb();
    const products = await db.collection<Product>('products').find({}).limit(50).toArray();
    res.status(200).json(products);
  } catch (error) {
    console.error('MongoDB error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Internal server error', error: errorMessage });
  }
}