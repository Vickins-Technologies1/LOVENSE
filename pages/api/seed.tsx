import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const demoProducts = [
      {
        title: 'Vibrating Wand',
        description: 'A powerful personal massager with multiple settings.',
        image: '/images/vibrators.jpg',
        price: 59.99,
        category: 'Vibrators',
      },
      {
        title: 'Couples Toy Set',
        description: 'Enhance intimacy with toys designed for couples.',
        image: '/images/couples.jpg',
        price: 89.99,
        category: 'Couples',
      },
    ];

    await db.collection('products').deleteMany({});
    await db.collection('products').insertMany(demoProducts);

    res.status(200).json({ message: 'Database seeded!' });
  } catch (error) {
    console.error('Seeding failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
