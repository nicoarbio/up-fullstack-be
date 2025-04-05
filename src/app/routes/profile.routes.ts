import { Router } from "express";
import { editUserProfile, getUserProfile } from "../controller/profile.controller.js";

export default Router()
    .post("/profile", getUserProfile)
    .patch("/profile", editUserProfile);
