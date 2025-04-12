import mongoose, { ConnectOptions } from 'mongoose';
import { DB_CONFIG, IS_PROD } from "@config/config.properties";
import { connectToInMemoryMongoDB, shutdownInMemoryMongoDB } from "@config/mongodb/inmemory.connection";
import { connectToAtlasMongoDB } from "@config/mongodb/atlas.connection";

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
    console.log("Disconnecting from MongoDB...");
    if (!IS_PROD) await shutdownInMemoryMongoDB();
    return mongoose.disconnect();
}
