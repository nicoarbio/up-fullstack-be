import { Request, Response } from "express";
import { User } from "@model/user.model";

export async function getUserProfile(req: Request, res: Response) {
    await User.findById(req.user?.id).select("-_id -passwordHash -__v")
        .then(user => {
            res.status(200).json(user);
            console.log(`User '${user?.email}' profile retrieved successfully. [${JSON.stringify(user)}]`);
        })
}

export async function editUserProfile(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" });
}
