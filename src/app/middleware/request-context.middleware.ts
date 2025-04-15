import { MDC, MDCKeys } from '@config/log4js.config';
import { NextFunction, Request, Response } from 'express';

export function withRequestContext(req: Request, res: Response, next: NextFunction) {
    MDC.run(() => {
        MDC.set(MDCKeys.USER_ID, req.user?.email || req.headers['x-request-id']);
        next();
    });
}
