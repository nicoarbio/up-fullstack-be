import express from "express";

export default express.Router()
    .get("/cart", getCart)
    .delete("/cart", cleanCart)
    .post("/cart/services", addItems)
    .delete("/cart/service", deleteItem);

function getCart(req, res) {

}

function cleanCart(req, res) {

}

function addItems(req, res) {

}

function deleteItem(req, res) {

}
