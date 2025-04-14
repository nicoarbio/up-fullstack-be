import { OAUTH } from "@config/config.properties";
import { googleOauth2Client } from "@config/oauth2.config";
import { TokenPayload } from "google-auth-library";
import cryptoService from "@service/crypto.service";
import { JwtPayload, signAccessToken, signRefreshToken, verifyRefreshToken } from "@service/jwt-handler.service";
import { User } from "@model/user.model";
import { DateTime } from "luxon";

export const loginUserWithEmailPassword = async (email: string, encryptedPassword: string) => {
    const error = new Error('Credenciales inválidas');

    const user = await User.findOne({ email });
    if (!user) {
        throw error;
    }

    const plainPassword = cryptoService.password.decrypt(encryptedPassword);
    const passwordMatch = await cryptoService.bcrypt.compare(plainPassword, user.passwordHash);
    if (!passwordMatch) {
        throw error;
    }

    const payload: JwtPayload = { id: user._id, email: user.email, role: user.role };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await User.updateOne({ email }, { lastLogin: DateTime.now() });

    console.log(`User '${email}' logged in using password. accessToken and refreshToken sent in response.`);

    return { accessToken, refreshToken };
}

export async function refreshAccessToken(refreshToken: string) {
    const tokenInvalido = (cause?: any) => new Error('Token inválido o expirado', { cause });

    let jtwPayload;
    try {
        jtwPayload = verifyRefreshToken(refreshToken);
    } catch (error) {
        throw tokenInvalido(error);
    }
    const user = await User.findById(jtwPayload.id);
    if (!user) throw tokenInvalido();

    console.log(`User '${user.email}' refreshed access token using refresh token.`);
    return signAccessToken({ id: user._id, email: user.email, role: user.role });
}

export async function registerUser(newUserInfo: { name: string, lastname: string, email: string, encryptedPassword: string, phoneNumber: string }) {
    const userAlreadyExists = new Error('El usuario ya existe');

    const existing = await User.findOne({ email: newUserInfo.email });
    if (existing) throw userAlreadyExists;

    const plainPassword = cryptoService.password.decrypt(newUserInfo.encryptedPassword);
    const passwordHash = await cryptoService.bcrypt.hash(plainPassword);
    const newUser = await User.create({ ...newUserInfo, passwordHash }).then((user) => {
        console.log(`User '${user.email}' registered successfully. [${JSON.stringify(user)}]`);
        return user;
    });

    return {
        email: newUser.email,
        name: newUser.name,
        lastname: newUser.lastname,
        emailVerified: newUser.emailVerified,
        phoneNumber: newUser.phoneNumber,
    };
}

export async function authenticateGoogleUser(googleJWT: string) {
    const error = new Error('Error al autenticar el usuario con Google');

    if (!googleJWT) throw error;

    const ticket = await googleOauth2Client.verifyIdToken({
        idToken: googleJWT,
        audience: OAUTH.GOOGLE.CLIENT_ID,
    });

    const googlePayload = ticket.getPayload();
    if (!googlePayload) throw error;

    let dbUser = await User.findOne({ email: googlePayload.email, googleId: googlePayload.sub }).lean();

    if (!dbUser) {
        dbUser = await registerGoogleUser(googlePayload!)
    }

    return await loginGoogleUser(googlePayload, { id: dbUser._id, email: dbUser.email, role: dbUser.role });
}

async function registerGoogleUser(googlePayload: TokenPayload) {
    return await User.create({
        name: googlePayload.given_name,
        lastname: googlePayload.family_name,
        email: googlePayload.email,
        emailVerified: true,
        googleId: googlePayload.sub,
        imageUrl: googlePayload.picture,
    }).then((user) => {
        console.log(`User '${user.email}' registered successfully. [${JSON.stringify(user)}]`);
        return user;
    });
}

async function loginGoogleUser(googlePayload: TokenPayload, jwtPayloadRequiredData: JwtPayload) {
    if (googlePayload.email !== jwtPayloadRequiredData.email)  throw new Error("Unexpected error. Emails do not match.");

    const accessToken = signAccessToken(jwtPayloadRequiredData);
    const refreshToken = signRefreshToken(jwtPayloadRequiredData);

    await User.updateOne({ email: googlePayload.email, googleId: googlePayload.sub }, { lastLogin: DateTime.now(), imageUrl: googlePayload.picture });

    console.log(`User '${jwtPayloadRequiredData.email}' logged in using Google OAuth. accessToken and refreshToken sent in response.`);

    return { userEmail: jwtPayloadRequiredData.email, tokens: { accessToken, refreshToken } };
}
