import { BCRYPT_SALT_ROUNDS, PASSWORD_ENCRYPTION } from "@config/config.properties";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const cryptoService = {
    bcrypt: {
        async hash(password: string): Promise<string> {
            return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
        },

        async compare(password: string, hash: string): Promise<boolean> {
            return await bcrypt.compare(password, hash);
        }
    },
    password: {
        encrypt(password: string) {
            try {
                return crypto.publicEncrypt(PASSWORD_ENCRYPTION.getPublicKey(), Buffer.from(password)).toString('base64');
            } catch (error) {
                throw new Error('Error al encriptar la contraseña', { cause: error });
            }
        },
        decrypt(hash: string) {
            try {
                return crypto.privateDecrypt(PASSWORD_ENCRYPTION.getPrivateKey(), Buffer.from(hash, 'base64')).toString('utf-8');
            } catch (error) {
                throw new Error('Error al desencriptar la contraseña', { cause: error });
            }
        }
    }
};

export default cryptoService;
