import dotenv from 'dotenv';

dotenv.config();

export const IS_PROD = process.env.NODE_ENV === 'prod';
export const PORT = process.env.PORT || 8081;
export const HOST = process.env.HOST || `http://localhost:${PORT}`;
export const API_BASE_URL = `/api/v1`;
export const DB_CONFIG = {
    DB_NAME: process.env.DB_NAME || 'TropicalHub',
    PASSWORD: process.env.DB_PASSWORD,
    USERNAME: process.env.DB_USERNAME,
    HOST: process.env.DB_HOST,
    OPTIONS: process.env.DB_OPTIONS,
    getConnectionString: (): string => { return `mongodb+srv://${DB_CONFIG.USERNAME}:${DB_CONFIG.PASSWORD}@${DB_CONFIG.HOST}/${DB_CONFIG.OPTIONS}` },
}

