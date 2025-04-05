import { Router } from "express";
import { getAllServices } from "../controller/bookings.controller.js";

export default Router()
    .get("/services", getAllServices);
