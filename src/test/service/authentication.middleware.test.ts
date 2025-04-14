import { Request, Response, NextFunction } from 'express';
import { authenticate, authenticateAdmin, authenticateUser } from "../../app/middleware/authentication.middleware";
import { setupUser } from "../utils/authentication.utils";
import cryptoService from "../../app/service/crypto.service";

describe('authentication.middleware.test.ts', () => {
    const res = {
        statusCode: 200,
        json: jest.fn(),
        status: (code: number) => {
            res.statusCode = code;
            return res;
        }
    } as unknown as Response;
    const emptyFallback: NextFunction = jest.fn();
    const users = {
        user: {
            tokens: { },
            loginData: { email: "nico@outlook.com", password: cryptoService.password.encrypt("123456") },
            req: { headers: { } } as Request
        },
        admin: {
            tokens: { },
            loginData: { email: "nico@tropicalhub.com", password: cryptoService.password.encrypt("123456") },
            req: { headers: { } } as Request
        }
    }

    beforeAll(async () => {
        await setupUser(users.user);
        await setupUser(users.admin);
    })

    beforeEach(() => {
        res.statusCode = 200;
    })

    test.each([
        [users.user.req, 200],
        [users.admin.req, 200]
    ])('happy path # authenticate', (req, expectedStatus) => {
        authenticate(req, res, emptyFallback);
        expect(res.statusCode).toBe(expectedStatus);
    });

    test.each([
        [users.user.req, 200],
        [users.admin.req, 403]
    ])('happy path # authenticateUser', (req, expectedStatus) => {
        authenticateUser(req, res, emptyFallback);
        expect(res.statusCode).toBe(expectedStatus);
    });

    test.each([
        [users.user.req, 403],
        [users.admin.req, 200]
    ])('happy path # authenticateAdmin', (req, expectedStatus) => {
        authenticateAdmin(req, res, emptyFallback);
        expect(res.statusCode).toBe(expectedStatus);
    });

});
