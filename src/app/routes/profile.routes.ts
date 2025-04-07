import { Router } from "express";
import { editUserProfile, getUserProfile } from "../controller/profile.controller.js";

export default Router()
    .get("/profile", getUserProfile)
    .patch("/profile", editUserProfile);
