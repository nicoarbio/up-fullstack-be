import { Router } from "express";
import { editUserProfile, getUserProfile } from "../controller/profile.controller.js";

export default Router()
    .get("/profile", getUserProfile)
    .put("/profile", editUserProfile);
