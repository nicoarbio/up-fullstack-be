import { Router, Request, Response } from "express";
import bcrypt from "@service/brypt.service";
import { authenticate, authenticateAdmin, authenticateUser } from "@middleware/authentication.middleware";

const encryptPassword = async (req: Request, res: Response) => {
    const password = req.query.password as string;
    if(!password) {
        res.status(400).json({ message: "Password is required" });
    } else {
        res.status(200).json({ passwordHash: await bcrypt.hash(password)})
    }
}

const response200ok = (req: Request, res: Response) => {
    res.status(200).json({ message: "OK" });
}

export default Router()
    .get("/auth/encrypt/bcrypt", encryptPassword)
    .get("/auth", authenticate, response200ok)
    .get("/auth/admin", authenticateAdmin, response200ok)
    .get("/auth/user", authenticateUser, response200ok)

