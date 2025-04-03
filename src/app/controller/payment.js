import express from "express";

export default express.Router()
    .post("/payment", processPayment)
    .patch("/payment/status", updatePaymentStatus)
    .post("/refund", processRefund);

function processPayment(req, res) {

}

function updatePaymentStatus(req, res) {

}

function processRefund(req, res) {

}
