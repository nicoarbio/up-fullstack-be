import express, { Request, Response } from "express";

export default express.Router()
    .post("/profile", getUserProfile)
    .patch("/profile", editUserProfile);

function getUserProfile(req: Request, res: Response) {

}

function editUserProfile(req: Request, res: Response) {

}
