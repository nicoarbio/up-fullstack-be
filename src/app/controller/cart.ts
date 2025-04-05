import express, { Request, Response } from "express";

export default express.Router()
    .get("/cart", getCart)
    .delete("/cart", cleanCart)
    .post("/cart/services", addItems)
    .delete("/cart/service", deleteItem);

function getCart(req: Request, res: Response) {
    res.send({
        id: "cartID#1",
        items: [
            {
                id: "serviceID#1",
                name: "Servicio de Playa",
                price: 100,
                quantity: 2
            },
            {
                id: "serviceID#2",
                name: "Alquiler de Sombrilla",
                price: 50,
                quantity: 1
            }
        ]
    });
}

function cleanCart(req: Request, res: Response) {

}

function addItems(req: Request, res: Response) {

}

function deleteItem(req: Request, res: Response) {

}
