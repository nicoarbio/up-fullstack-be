import { ConnectOptions } from 'mongoose';
import { DB_CONFIG, IS_PROD } from "@config/config.properties";
import { connectToInMemoryMongoDB, disconnectAndShutdownInMemoryMongoDB } from "@config/mongodb/inmemory.connection";
import { connectToAtlasMongoDB, disconnectAtlasMongoDB } from "@config/mongodb/atlas.connection";

export const mongoClientOptions: ConnectOptions = {
    dbName: DB_CONFIG.NAME,
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    }
};

export async function connectDB() {
    console.log("Connecting to MongoDB...");
    if (IS_PROD) return await connectToAtlasMongoDB();
    return await connectToInMemoryMongoDB();
}

export async function disconnectDB() {
    if (IS_PROD) return await disconnectAtlasMongoDB();
    return await disconnectAndShutdownInMemoryMongoDB();
}
