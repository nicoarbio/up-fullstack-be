import { Router } from "express";
import { getCart, cleanCart, addItems, deleteItem } from "../controller/cart.controller.js";

export default Router()
    .get("/cart", getCart)
    .delete("/cart", cleanCart)
    .post("/cart/services", addItems)
    .delete("/cart/services", deleteItem);
