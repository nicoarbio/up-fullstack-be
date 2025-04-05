import { Request, Response } from "express";

export async function getCart(req: Request, res: Response) {
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

export async function cleanCart(req: Request, res: Response) {

}

export async function addItems(req: Request, res: Response) {

}

export async function deleteItem(req: Request, res: Response) {

}
