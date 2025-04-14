import { Router } from "express";
import { login, refreshToken, signup } from "@controller/authentication.controller";

export default Router()
    .post("/auth/login", login)
    .post("/auth/refresh", refreshToken)
    .post("/auth/signup", signup);
