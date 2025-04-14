import { Router } from "express";
import { editUserProfile, getUserProfile } from "@controller/profile.controller";
import { authenticate } from "@middleware/authentication.middleware";

export default Router()
    .get("/profile", authenticate, getUserProfile)
    .put("/profile", authenticate, editUserProfile);
