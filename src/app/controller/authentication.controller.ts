import { Request, Response } from "express";
import { loginUserWithEmailPassword, refreshAccessToken, registerUser } from "@service/authentication.service";

export async function login(req: Request, res: Response) {
    await loginUserWithEmailPassword(req.body.email, req.body.password)
        .then((tokens) => res.json(tokens))
        .catch((err) => {
            console.error("Error al iniciar sesión:", err.message || err);
            res.status(401).json({ error: err });
        });
}

export async function refreshToken(req: Request, res: Response) {
    await refreshAccessToken(req.body.refreshToken)
        .then((accessToken) => res.json({ accessToken }))
        .catch((err) => {
            console.error("Error al refrescar el token:", err.message || err);
            res.status(401).json({ error: err });
        });
}

export async function signup(req: Request, res: Response) {
    await registerUser(req.body)
        .then((user => res.status(201).json(user)))
        .catch((err => {
            console.error("Error al registrar el usuario:", err.message || err);
            res.status(409).json({ error: err });
        }));
}
