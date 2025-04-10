import { Router } from "express";
import { processPayment, processRefund, updatePaymentStatus } from "@controller/payment.controller";

export default Router()
    .post("/payment", processPayment)
    .put("/payment/status", updatePaymentStatus)
    .post("/payment/refund", processRefund);
