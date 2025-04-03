import express, { Request, Response } from "express";

export default express.Router()
    .post("/payment", processPayment)
    .patch("/payment/status", updatePaymentStatus)
    .post("/refund", processRefund);

function processPayment(req: Request, res: Response) {

}

function updatePaymentStatus(req: Request, res: Response) {

}

function processRefund(req: Request, res: Response) {

}
