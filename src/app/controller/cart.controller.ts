import { Request, Response } from "express";

export async function getCart(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" });
}

export async function cleanCart(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" });
}

export async function addItems(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" });
}

export async function deleteItem(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" });
}
