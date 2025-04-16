import { Request, Response, NextFunction } from 'express';
import { JwtPayload, verifyAccessToken } from "@service/jwt-handler.service";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}

export const extractAuthorizationHeader = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        next();
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded as Request['user'];
    } catch (error) {
        req.user = undefined;
    } finally {
        next();
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const error = "Credenciales erroneas, inicie sesión";
    if (!req.user) {
        res.status(401).json({ error });
        return;
    }
    next();
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const error = "No tiene permisos para acceder a este recurso";
    authenticate(req, res, () => {
        if (req.user?.role !== 'user') {
            res.status(403).json({ error, role: req.user?.role });
            return;
        }
        next();
    });
}

export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
    const error = "No tiene permisos para acceder a este recurso";
    authenticate(req, res, () => {
        if (req.user?.role !== 'admin') {
            res.status(403).json({ error, role: req.user?.role });
            return;
        }
        next();
    });
}
