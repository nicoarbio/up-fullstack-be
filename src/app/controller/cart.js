import express from "express";

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Obtener el carrito del usuario actual
 *     responses:
 *       200:
 *         description: El carrito
 */
export default express.Router()
    .get("/cart", getCart)
    .delete("/cart", cleanCart)
    .post("/cart/services", addItems)
    .delete("/cart/service", deleteItem);

function getCart(req, res) {
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

function cleanCart(req, res) {

}

function addItems(req, res) {

}

function deleteItem(req, res) {

}
