import mongoose from "mongoose";
import { DB_CONFIG } from "@config/config.properties";
import { mongoClientOptions } from "@config/db.config";

export async function connectToAtlasMongoDB() {
    const uri = DB_CONFIG.getConnectionString();

    return mongoose.connect(uri, mongoClientOptions).then(
        async () => {
            console.log('MongoDB Atlas successfully connected');
        },
        async (err) => {
            console.error('Error connecting to MongoDB Atlas', err);
            throw err;
        }
    );
}

export async function disconnectAtlasMongoDB() {
    console.log("Disconnecting MongoDB Atlas...");
    await mongoose.disconnect();
}
