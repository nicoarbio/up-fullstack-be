import { Router } from "express";
import { getUserProfile } from "@controller/profile.controller";
import { authenticate } from "@middleware/authentication.middleware";

export default Router()
    .get("/profile", authenticate, getUserProfile);
