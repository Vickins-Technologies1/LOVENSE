// lib/mongodb.ts
import { MongoClient, MongoClientOptions } from 'mongodb';

// Extend global for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri: string | undefined = process.env.MONGODB_URI;
const dbName: string | undefined = process.env.MONGODB_DB;

const options: MongoClientOptions = {
  maxPoolSize: 20,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
  maxIdleTimeMS: 60000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('MONGODB_URI environment variable is not defined.');
}

if (!dbName) {
  throw new Error('MONGODB_DB environment variable is not defined.');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    try {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect().catch((err) => {
        console.error('MongoDB connection failed in development:', err);
        throw err;
      });
    } catch (err) {
      console.error('MongoDB client initialization failed:', err);
      throw err;
    }
  }
  clientPromise = global._mongoClientPromise;
} else {
  try {
    client = new MongoClient(uri, options);
    clientPromise = client.connect().catch((err) => {
      console.error('MongoDB connection failed in production:', err);
      throw err;
    });
  } catch (err) {
    console.error('MongoDB client initialization failed:', err);
    throw err;
  }
}

export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}

export default clientPromise;