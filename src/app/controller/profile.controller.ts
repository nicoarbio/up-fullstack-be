import { Request, Response } from "express";

export async function getUserProfile(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" });
}

export async function editUserProfile(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" });
}
