import { Request, Response } from "express";
import { User } from "@model/user.model";

const userProfileSelect = "-_id -passwordHash -__v";

export async function getUserProfile(req: Request, res: Response) {
    await User.findById(req.user?.id).select(userProfileSelect)
        .then(user => {
            res.status(200).json(user);
            console.log(`User profile retrieved successfully. [${JSON.stringify(user)}]`);
        }).catch(error => {
            res.status(500).json({ error: error.message, detail: error.cause });
            console.error("Error retrieving user profile:", error.message || error);
        })
}

export async function updateUserProfile(req: Request, res: Response) {
    const fieldsToUpdate = {
        name: req.body.name,
        lastname: req.body.lastname,
        phoneNumber: req.body.phoneNumber,
    };
    const userId = req.user!.id;

    await User.findByIdAndUpdate(userId, fieldsToUpdate, { new: true }).select(userProfileSelect)
        .then(user => {
            res.status(200).json(user);
            console.log(`User profile updated successfully. [${JSON.stringify(user)}]`);
        }).catch(error => {
            res.status(500).json({ error: error.message, detail: error.cause });
            console.error("Error updating user profile:", error.message || error);
        })
}
