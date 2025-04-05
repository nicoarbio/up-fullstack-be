import { Router } from "express";
import { login, signup, refreshToken } from "../controller/authentication.controller.js";

export default Router()
    .post("/login", login)
    .post("/signup", signup)
    .post("/refresh-token", refreshToken);
