import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from "@config/config.properties";

const bcryptService = {
    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    },

    async compare(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
};

export default bcryptService;
