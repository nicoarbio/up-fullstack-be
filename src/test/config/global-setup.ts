import dotenv from "dotenv";
dotenv.config({path:'src/test/config/.env.test'});

import fs from 'fs';
import path from 'path';
import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { mongoDbInMemoryConnection, seedDatabase } from "../../app/config/mongodb/inmemory.connection";
const mongoPath = path.resolve('.jest-test-mongo-uri');

export default async () => {
    const mongoServer = await MongoMemoryServer.create(mongoDbInMemoryConnection);
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
    await seedDatabase();
    await mongoose.disconnect();

    fs.writeFileSync(mongoPath, uri);
    (global as any).__MONGO_SERVER__ = mongoServer;
};
