import express, { Request, Response } from "express";

export default express.Router()
    .post("/login", login)
    .post("/signup", signup)
    .post("/refresh-token", refreshToken);

function login(req: Request, res: Response) {

}

function signup(req: Request, res: Response) {

}

function refreshToken(req: Request, res: Response) {

}
