import mongoose, { ConnectOptions } from 'mongoose';
import { IS_PROD, DB_CONFIG } from "./config.properties.js";
import connectToInMemoryMongoDB from "./mongodb/inmemory.connection.js";
import connectToAtlasMongoDB from "./mongodb/atlas.connection.js";

export const mongoClientOptions: ConnectOptions = {
    dbName: DB_CONFIG.DB_NAME,
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
    return mongoose.disconnect();
}
