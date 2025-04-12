import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { connectToInMemoryMongoDB, shutdownInMemoryMongoDB } from "../app/config/mongodb/inmemory.connection";
import { beforeEach, afterEach } from 'vitest';

beforeEach(async () => {
    await connectToInMemoryMongoDB();
});

afterEach(async () => {
    await shutdownInMemoryMongoDB();
});
