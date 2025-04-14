// pages/api/auth/signup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { getDb } from '../../lib/mongodb'; 
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = signupSchema.parse(req.body);
    const db = await getDb();
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}