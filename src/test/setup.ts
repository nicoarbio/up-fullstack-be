import dotenv from 'dotenv';
import { connectToInMemoryMongoDB, shutdownInMemoryMongoDB } from "../app/config/mongodb/inmemory.connection";
import { afterEach, beforeEach } from 'vitest';

dotenv.config({ path: '.env.test' });

beforeEach(async () => {
    await connectToInMemoryMongoDB();
});

afterEach(async () => {
    await shutdownInMemoryMongoDB();
});
