import { MongoClient, Db } from "mongodb";

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not defined');
}

const uri = process.env.MONGO_URI;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        global._mongoClientPromise = MongoClient.connect(uri);
    }
    clientPromise = global._mongoClientPromise;
} else {
    clientPromise = MongoClient.connect(uri);
}

const connectToDatabase = async (): Promise<Db> => {
    try {
        const client = await clientPromise;
        return client.db("bot");
    } catch (error) {
        console.error('Failed to connect to database:', error);
        throw error;
    }};

export { connectToDatabase };
