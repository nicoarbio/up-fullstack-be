import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const mongoPath = path.resolve('.jest-test-mongo-uri');

export default async () => {
    await mongoose.disconnect();

    try {
        fs.unlinkSync(mongoPath);
    } catch {}

    const mongoServer = (global as any).__MONGO_SERVER__;
    if (mongoServer) {
        await mongoServer.stop();
    }
};
