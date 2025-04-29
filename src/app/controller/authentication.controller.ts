import { Request, Response } from "express";
import { authenticateGoogleUser, loginUserWithEmailPassword, refreshAccessToken, registerUser } from "@service/authentication.service";

export async function login(req: Request, res: Response) {
    await loginUserWithEmailPassword(req.body.email, req.body.password)
        .then(tokens => res.json(tokens))
        .catch(error => {
            res.status(401).json({ error: error.message, detail: error.cause });
            console.error("Error trying to log in:", error.message || error);
        });
}

export async function refreshToken(req: Request, res: Response) {
    await refreshAccessToken(req.body.refreshToken)
        .then(accessToken => res.json({ accessToken }))
        .catch(error => {
            res.status(401).json({ error: error.message, detail: error.cause });
            console.error("Error refreshing accessToken:", error.message || error);
        });
}

export async function signup(req: Request, res: Response) {
    await registerUser(req.body)
        .then(user => res.status(201).json(user))
        .catch(error => {
            res.status(409).json({ error: error.message, detail: error.cause });
            console.error("Error registering user:", error.message || error);
        });
}

export async function handleGoogleOAuth(req: Request, res: Response) {
    await authenticateGoogleUser(req.body.googleJWT!)
        .then(login => res.json(login.tokens))
        .catch(error => {
            res.status(401).json({ error: error.message, detail: error.cause });
            console.error("Error trying to login with Google OAuth2:", error.message || error);
        });
}
