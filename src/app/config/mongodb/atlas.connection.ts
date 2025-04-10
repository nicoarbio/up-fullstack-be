import mongoose from "mongoose";
import { DB_CONFIG } from "@config/config.properties";
import { mongoClientOptions } from "@config/db.config";

export default async function connectToAtlasMongoDB()  {
    const uri = DB_CONFIG.getConnectionString();

    return mongoose.connect(uri, mongoClientOptions).then(
        () => {
            console.log('MongoDB Atlas successfully connected');
        },
        (err) => {
            console.error('Error connecting to MongoDB Atlas', err);
            throw err;
        }
    );
}
