import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from "@config/config.properties"

let { SECRET_ACCESS, SECRET_REFRESH, EXPIRES_IN, REFRESH_EXPIRES_IN } = JWT_CONFIG;

if (!SECRET_ACCESS || !SECRET_REFRESH) {
    throw new Error('Missing JWT secrets in environment variables');
}

export type JwtPayload = {
    id: any;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

export const signAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, SECRET_ACCESS, { expiresIn: EXPIRES_IN });
}

export const signRefreshToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, SECRET_REFRESH, { expiresIn: REFRESH_EXPIRES_IN });
}

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, SECRET_ACCESS) as JwtPayload;
}

export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, SECRET_REFRESH) as JwtPayload;
}
