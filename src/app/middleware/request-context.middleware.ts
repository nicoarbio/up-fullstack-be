import { requestNamespace } from '@config/log4js.config';
import { Request, Response, NextFunction } from 'express';

export function withRequestContext(req: Request, res: Response, next: NextFunction) {
    requestNamespace.run(() => {
        requestNamespace.set('userId', req.user?.email || req.headers['x-request-id']);
        next();
    });
}
