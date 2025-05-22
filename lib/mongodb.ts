import { MongoClient, MongoClientOptions, Db } from 'mongodb';

// Augment global namespace for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Environment variables with validation
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined.');
}

if (!MONGODB_DB) {
  throw new Error('MONGODB_DB environment variable is not defined.');
}

// Configurable MongoDB options
const options: MongoClientOptions = {
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '20', 10),
  connectTimeoutMS: parseInt(process.env.MONGODB_CONNECT_TIMEOUT || '10000', 10),
  socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT || '30000', 10),
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Singleton MongoDB client
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      console.error('MongoDB connection failed:', err);
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect().catch((err) => {
    console.error('MongoDB connection failed:', err);
    throw err;
  });
}

// Export a typed database getter
export async function getDb(): Promise<Db> {
  try {
    const client = await clientPromise;
    return client.db(MONGODB_DB);
  } catch (error) {
    console.error('Failed to get MongoDB database:', error);
    throw new Error('Unable to connect to the database');
  }
}

export default clientPromise;