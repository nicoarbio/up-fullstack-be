import { User } from "@model/user.model";
import bcrypt from "@service/brypt.service";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@service/jwt-handler.service";
import { DateTime } from "luxon";

export const loginUserWithEmailPassword = async (email: string, encryptedPassword: string) => {
    const error = new Error('Credenciales inválidas');

    const user = await User.findOne({ email });
    if (!user) {
        throw error;
    }

    const passwordMatch = await bcrypt.compare(encryptedPassword, user.passwordHash);
    if (!passwordMatch) {
        throw error;
    }

    const payload = { id: user._id, email: user.email, role: user.role };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await User.updateOne({ email }, { lastLogin: DateTime.now() });

    return { accessToken, refreshToken };
}

export async function refreshAccessToken(refreshToken: string) {
    const tokenInvalido = (cause?: any) => new Error('Token inválido o expirado', { cause });

    let jtwPayload;
    try {
        jtwPayload = verifyRefreshToken(refreshToken);
    } catch (err) {
        throw tokenInvalido(err);
    }
    const user = await User.findById(jtwPayload.id);
    if (!user) throw tokenInvalido();

    return signAccessToken({ id: user._id, email: user.email, role: user.role });
}

export async function registerUser(newUserInfo: { name: string, lastname: string, email: string, encryptedPassword: string, phoneNumber: string }) {
    const userAlreadyExists = new Error('El usuario ya existe');

    const existing = await User.findOne({ email: newUserInfo.email });
    if (existing) throw userAlreadyExists;

    const passwordHash = await bcrypt.hash(newUserInfo.encryptedPassword);
    const newUser = await User.create({ ...newUserInfo, passwordHash });

    return {
        email: newUser.email
    };
}

