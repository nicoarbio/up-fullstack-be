import mongoose from "mongoose";
import { DB_CONFIG } from "@config/config.properties";
import { mongoClientOptions } from "@config/db.config";
import { seedDatabase } from "@config/mongodb/inmemory.connection";

export async function connectToAtlasMongoDB() {
    const uri = DB_CONFIG.getConnectionString();

    return mongoose.connect(uri, mongoClientOptions).then(
        async () => {
            console.log('MongoDB Atlas successfully connected');
            await seedDatabase();
        },
        (err) => {
            console.error('Error connecting to MongoDB Atlas', err);
            throw err;
        }
    );
}
