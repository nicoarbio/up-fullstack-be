import { Router, Request, Response } from "express";
import cryptoService from "@service/crypto.service";
import { authenticate, authenticateAdmin, authenticateUser } from "@middleware/authentication.middleware";

const encryptRsa = async (req: Request, res: Response) => {
    const text = req.query.text as string;
    if(!text) {
        res.status(400).json({ message: "Text is required" });
    } else {
        const hash = cryptoService.password.encrypt(text);
        res.status(200).send(hash);
    }
}

const decryptRsa = async (req: Request, res: Response) => {
    const hash = req.query.hash as string;
    if(!hash) {
        res.status(400).json({ message: "Text is required" });
    } else {
        const text = cryptoService.password.decrypt(hash);
        res.status(200).send(text);
    }
}

const encryptBcrypt = async (req: Request, res: Response) => {
    const text = req.query.text as string;
    if(!text) {
        res.status(400).json({ message: "Text is required" });
    } else {
        const hash = await cryptoService.bcrypt.hash(text);
        res.status(200).send(hash);
    }
}

const response200ok = (req: Request, res: Response) => {
    res.status(200).json({ message: "OK" });
}

export default Router()
    .get("/auth/encrypt/rsa", encryptRsa)
    .get("/auth/decrypt/rsa", decryptRsa)

    .get("/auth/encrypt/bcrypt", encryptBcrypt)

    .get("/auth", authenticate, response200ok)
    .get("/auth/admin", authenticateAdmin, response200ok)
    .get("/auth/user", authenticateUser, response200ok);
