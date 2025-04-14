import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB;

    if (!dbName) {
      throw new Error('MONGODB_DB environment variable is not defined.');
    }

    const db = client.db(dbName);

    const demoProducts = [
      {
        name: 'PulseWave',
        description: 'A sleek, app-controlled toy for personalized pleasure.',
        image: '/lovense-logo.png',
        price: 89.99,
        category: 'Vibrators',
        features: ['App-controlled', 'Body-safe silicone', 'Rechargeable'],
      },
      {
        name: 'IntimateGlow',
        description: 'Discreet design with powerful, whisper-quiet vibrations.',
        image: '/lovense-logo.png',
        price: 59.99,
        category: 'Vibrators',
        features: ['Waterproof', 'Multiple intensities', 'Travel-friendly'],
      },
      {
        name: 'SilkTouch',
        description: 'Luxurious toy for couples, enhancing shared moments.',
        image: '/lovense-logo.png',
        price: 129.99,
        category: 'Couples',
        features: ['Dual stimulation', 'Remote control', 'Ergonomic design'],
      },
      {
        name: 'BlissRing',
        description: 'Enhances stamina and pleasure for prolonged enjoyment.',
        image: '/lovense-logo.png',
        price: 39.99,
        category: 'Rings',
        features: ['Flexible fit', 'Vibration modes', 'Easy to clean'],
      },
    ];

    // Seed new data without clearing existing products
    const result = await db.collection('products').insertMany(demoProducts);

    res.status(200).json({
      message: 'Products added successfully!',
      insertedCount: result.insertedCount,
      insertedIds: result.insertedIds,
    });
  } catch (error) {
    console.error('Seeding failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}