// @ts-ignore
import jwt from 'jsonwebtoken';
import bcrypt from "../../app/service/brypt.service";
import { JWT_CONFIG } from "../../app/config/config.properties";
import { User } from "../../app/model/user.model";
import { loginUserWithEmailPassword, refreshAccessToken, registerUser } from "../../app/service/authentication.service";
import { verifyAccessToken, verifyRefreshToken } from "../../app/service/jwt-handler.service";

describe('authentication.service.ts # loginUserWithEmailPassword', () => {

    test('happy path', async () => {
        const res = await loginUserWithEmailPassword('nico@outlook.com', '123456');

        expect(res).toBeDefined();
        expect(res.accessToken).toBeDefined();
        expect(res.refreshToken).toBeDefined();
        expect(() => verifyRefreshToken(res.refreshToken)).not.toThrow();
        expect(() => verifyAccessToken(res.accessToken)).not.toThrow();
    });

});

describe('authentication.service.ts # registerUser', () => {
    const newUserInfo = {
        name: "Nicolás",
        lastname: "Arbio",
        email: "nico@up.com",
        encryptedPassword: "123456",
        phoneNumber: "+5491113245678"
    }
    const alredyExistUserInfo = {
        name: "Nicolás",
        lastname: "Arbio",
        email: "nico@outlook.com",
        encryptedPassword: "123456",
        phoneNumber: "+5491113245678"
    }

    afterEach(async () => {
        await User.deleteOne({ email: newUserInfo.email });
    });

    test('happy path', async () => {
        const result = await registerUser(newUserInfo);

        const userInDb = await User.findOne({ email: newUserInfo.email });
        expect(userInDb).not.toBeNull();
        expect(userInDb?.passwordHash).not.toBe(newUserInfo.encryptedPassword);
        expect(await bcrypt.compare(newUserInfo.encryptedPassword, userInDb!.passwordHash)).toBe(true);

        expect(result).toEqual({ email: newUserInfo.email });
    });

    test('user already exists', async () => {
        await expect(registerUser(alredyExistUserInfo)).rejects.toThrow('El usuario ya existe');
    });

});

describe('authentication.service.ts # refreshAccessToken', () => {
    const user = {
        email: "nico@outlook.com",
        password: "123456"
    };
    let refreshToken: string;
    let accessToken: string;
    let dbUser: any;

    beforeAll(async () => {
       const res = await loginUserWithEmailPassword(user.email, user.password);
       accessToken = res.accessToken;
       refreshToken = res.refreshToken;
       await User.findOne({ email: user.email })
           .then(user => dbUser = user)
           .catch(err => { throw new Error('REVISAR SEEDS DE USUARIOS') });
    })

    test('happy path', async () => {
        const accessToken = await refreshAccessToken(refreshToken);
        expect(() => verifyAccessToken(accessToken)).not.toThrow();
    });

    test('refreshToken expirado', async () => {
        const jwtPayload = { id: dbUser!._id, email: dbUser!.email, role: dbUser!.role };
        const expiredRefreshToken = jwt.sign(jwtPayload, JWT_CONFIG.SECRET_REFRESH, { expiresIn: -10 });

        await expect(refreshAccessToken(expiredRefreshToken)).rejects.toThrow('Token inválido o expirado');
    });

});
