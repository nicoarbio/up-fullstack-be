import { Request, Response } from "express";
import { authenticateGoogleUser, loginUserWithEmailPassword, refreshAccessToken, registerUser } from "@service/authentication.service";

export async function login(req: Request, res: Response) {
    await loginUserWithEmailPassword(req.body.email, req.body.password)
        .then((tokens) => res.json(tokens))
        .catch((error) => {
            res.status(401).json({ error: error.message, detail: error.cause });
            console.error("Error al iniciar sesión:", error.message || error);
        });
}

export async function refreshToken(req: Request, res: Response) {
    await refreshAccessToken(req.body.refreshToken)
        .then((accessToken) => res.json({ accessToken }))
        .catch((error) => {
            res.status(401).json({ error: error.message, detail: error.cause });
            console.error("Error al refrescar el token:", error.message || error);
        });
}

export async function signup(req: Request, res: Response) {
    await registerUser(req.body)
        .then((user => res.status(201).json(user)))
        .catch((error => {
            res.status(409).json({ error: error.message, detail: error.cause });
            console.error("Error al registrar el usuario:", error.message || error);
        }));
}

export async function handleGoogleOAuth(req: Request, res: Response) {
    await authenticateGoogleUser(req.body.googleJWT!)
        .then((login) => res.json(login.tokens))
        .catch((error) => {
            res.status(401).json({ error: error.message, detail: error.cause });
            console.error("Error al iniciar sesión con Google:", error.message || error);
        });
}
