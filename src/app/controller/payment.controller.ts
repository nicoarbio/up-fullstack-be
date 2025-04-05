import { Request, Response } from "express";

export async function processPayment(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" });
}

export async function updatePaymentStatus(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" });
}

export async function processRefund(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" });
}
