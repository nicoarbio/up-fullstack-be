import { Router } from "express";
import { login, signup } from "../controller/authentication.controller.js";

export default Router()
    .post("/login", login)
    .post("/signup", signup);
