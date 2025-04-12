import dotenv from 'dotenv';
import { connectToInMemoryMongoDB, shutdownInMemoryMongoDB } from "../app/config/mongodb/inmemory.connection";

dotenv.config({ path: '.env.test' });

export const startDbBefore = (async () => {
    await connectToInMemoryMongoDB();
});

export const shutdownDbAfter = (async () => {
    await shutdownInMemoryMongoDB();
});
