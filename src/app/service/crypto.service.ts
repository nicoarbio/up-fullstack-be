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
        encrypt(text: string) {
            try {
                return crypto.publicEncrypt(PASSWORD_ENCRYPTION.getPublicKey(), Buffer.from(text)).toString('base64');
            } catch (error) {
                throw new Error('Error trying to encrypt text with rsa public key', { cause: error });
            }
        },
        decrypt(hash: string) {
            try {
                return crypto.privateDecrypt(PASSWORD_ENCRYPTION.getPrivateKey(), Buffer.from(hash, 'base64')).toString('utf-8');
            } catch (error) {
                throw new Error('Error trying to decrypt text with rsa private key', { cause: error });
            }
        }
    }
};

export default cryptoService;
