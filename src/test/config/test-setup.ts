import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

process.env.JWT_SECRET_ACCESS = 'test-secret-access';
process.env.JWT_SECRET_REFRESH = 'test-secret-refresh';

beforeAll(async () => {
    const uriPath = path.resolve('.jest-test-mongo-uri');

    if (!fs.existsSync(uriPath)) {
        throw new Error('No se encontró el archivo .jest-test-mongo-uri. ¿Se ejecutó globalSetup?');
    }

    const mongoUri = fs.readFileSync(uriPath, 'utf-8');
    console.log('[test-setup] Conectando a Mongo URI:', mongoUri);

    await mongoose.connect(mongoUri);

    console.log('[test-setup] Estado mongoose.connection.readyState:', mongoose.connection.readyState);
    if (mongoose.connection.readyState !== 1) {
        throw new Error('Mongoose no logró conectarse antes de correr los tests');
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    console.log('[test-setup] Mongoose desconectado');
});
