import { Request, Response } from "express";

export async function getAllServices(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" });
}
