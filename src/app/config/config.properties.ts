import dotenv from 'dotenv';
import fs from "fs";
import { validateObject } from "@utils/objects.utils";

dotenv.config();

export const IS_PROD = process.env.NODE_ENV === 'production';
export const PORT = process.env.PORT || 8081;
export const HOST = process.env.HOST || `http://localhost:${ PORT }`;
export const API_BASE_URL = `/api/v1`;
export const DB_CONFIG = {
    NAME: process.env.DB_NAME || 'TropicalHub',
    PASSWORD: process.env.DB_PASSWORD,
    USERNAME: process.env.DB_USERNAME,
    HOST: process.env.DB_HOST,
    OPTIONS: process.env.DB_OPTIONS,
    getConnectionString: (): string => {
        return `mongodb+srv://${ DB_CONFIG.USERNAME }:${ DB_CONFIG.PASSWORD }@${ DB_CONFIG.HOST }/${ DB_CONFIG.OPTIONS }`
    },
    LOCAL_PORT: Number(process.env.DB_LOCAL_PORT),
    SEED_PATH: process.env.DB_SEED_PATH || 'inMemoryDBmockedData'
}
export const JWT_CONFIG = {
    SECRET_ACCESS: process.env.JWT_SECRET_ACCESS as string,
    SECRET_REFRESH: process.env.JWT_SECRET_REFRESH as string,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN as any,
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as any
}

export const BCRYPT_SALT_ROUNDS = 10;

const getPath = (key: string) => {
    if (!IS_PROD) {
        if (fs.existsSync(`${key}.pem`)) {
            return `${key}.pem`
        } else {
            throw new Error(`NODE_ENV=${process.env.NODE_ENV}. Falta generar los archivos 'private.pem' y 'public.pem' en la raiz del proyecto!`);
        }
    } else if (!fs.existsSync(`/etc/secrets/${key}.pem`)) {
        throw new Error(`NODE_ENV=${process.env.NODE_ENV}. Key configuration files missing!`);
    }
    return `/etc/secrets/${key}.pem`;
}

export const PASSWORD_ENCRYPTION = {
    getPrivateKey: () => fs.readFileSync(getPath(`private`), 'utf-8'),
    getPublicKey: () => fs.readFileSync(getPath(`public`), 'utf-8')
}

export const OAUTH = {
    GOOGLE: {
        CLIENT_ID: process.env.OAUTH2_GOOGLE_CLIENT_ID,
        CLIENT_SECRET: process.env.OAUTH2_GOOGLE_CLIENT_SECRET
    }
}

const validationErrorMessage = `Missing configuration values. Please check out your .env file and src/app/config/config.properties.ts`;
validateObject(JWT_CONFIG, validationErrorMessage);
validateObject(DB_CONFIG, validationErrorMessage);
validateObject(OAUTH, validationErrorMessage);
