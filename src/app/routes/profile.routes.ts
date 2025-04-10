import { Router } from "express";
import { editUserProfile, getUserProfile } from "../controller/profile.controller.js";

export default Router()
    .get("/profile", getUserProfile)
    .put("/profile", editUserProfile)
    .get("/user/all", getAllUsers); // TODO: delete

import { Request, Response } from "express";
import { User } from "../model/user.model.js";
async function getAllUsers(req: Request, res: Response) {
    try {
        const users = await User.find();
        res.status(200).json({
            message: 'Lista de usuarios',
            data: users,
        });
    } catch (error: any) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            message: 'Error al obtener usuarios',
            error: error.message,
        });
    }
}
