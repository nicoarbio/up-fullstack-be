import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from "@service/jwt-handler.service";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                email: string,
                role: string
            };
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const error = "Credenciales erroneas, inicie sesión";
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded as Request['user'];
        next();
    } catch (err) {
        res.status(401).json({ error });
        return;
    }
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, () => {
        if (req.user?.role !== 'user') {
            res.status(403).json({ error: 'No tiene permisos para acceder a este recurso', role: req.user?.role });
            return;
        }
        next();
    });
}

export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, () => {
        if (req.user?.role !== 'admin') {
            res.status(403).json({ error: 'No tiene permisos para acceder a este recurso', role: req.user?.role });
            return;
        }
        next();
    });
}
