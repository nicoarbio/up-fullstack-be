import { MDC, MDCKeys } from '@config/log4js.config';
import { NextFunction, Request, Response } from 'express';

export function withRequestContext(req: Request, res: Response, next: NextFunction) {
    MDC.run(() => {
        const email = req.user?.email;
        let userId = email;
        const role = req.user?.role;
        if (email && role) userId += `:${req.user?.role}`
        MDC.set(MDCKeys.USER_ID, userId || req.headers['x-request-id']?.toString() ||
            req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
            req.ip);
        next();
    });
}
