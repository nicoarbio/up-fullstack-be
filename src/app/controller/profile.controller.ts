import { Request, Response } from "express";
import { User } from "@model/user.model";

export async function getUserProfile(req: Request, res: Response) {
    await User.findById(req.user?.id).select("-_id -passwordHash -__v")
        .then(user => {
            res.status(200).json(user);
            console.log(`User profile retrieved successfully. [${JSON.stringify(user)}]`);
        }).catch(error => {
            res.status(500).json({ error: error.message, detail: error.cause });
            console.error("Error retrieving user profile:", error.message || error);
        })
}
