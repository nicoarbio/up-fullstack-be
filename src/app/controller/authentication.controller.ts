import { Request, Response } from "express";

export async function login(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" });
}

export async function signup(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" });
}

export async function refreshToken(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" });
}
