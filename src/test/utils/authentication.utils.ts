import { loginUserWithEmailPassword } from "../../app/service/authentication.service";
import { User } from "../../app/model/user.model";

export type AuthUtils = {
    tokens: {
        accessToken?: string;
        refreshToken?: string;
    };
    loginData: {
        email: string;
        password: string;
    };
    db?: any;
    req: {
        headers: {
            authorization?: string;
        }
    };
}

export const setupUser = async (data: AuthUtils) => {
    const loginRes = await loginUserWithEmailPassword(data.loginData.email, data.loginData.password);
    data.tokens.accessToken = loginRes.accessToken;
    data.tokens.refreshToken = loginRes.refreshToken;
    await User.findOne({ email: data.loginData.email })
        .then(user => data.db = user)
        .catch(() => { throw new Error('REVISAR SEEDS DE USUARIOS') });
    data.req.headers.authorization = `Bearer ${data.tokens.accessToken}`;
}
