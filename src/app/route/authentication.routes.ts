import { Router } from "express";
import { handleGoogleOAuth, login, refreshToken, signup } from "@controller/authentication.controller";

export default Router()
    .post("/auth/login", login)
    .post("/auth/refresh", refreshToken)
    .post("/auth/signup", signup)
    .post("/oauth/google", handleGoogleOAuth);
