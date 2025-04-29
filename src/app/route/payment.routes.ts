import { Router } from "express";
import { getPayment, processCashPayment, processRefund, processStormRefund, updateMPPaymentStatus } from "@controller/payment.controller";
import { authenticate, authenticateAdmin } from "@middleware/authentication.middleware";
import { withValidation } from "@middleware/validateRequest.middleware";
import { body, param, ValidationChain } from "express-validator";
import { Currency } from "@enum/payment.enum";

const validateCashPayment: ValidationChain[] = [
    body("orderId")
        .exists().isMongoId().withMessage("El ID de la orden es requerido"),
    body("amount")
        .exists().isNumeric().withMessage("El monto es requerido")
        .custom(value => {
            if (value <= 0) {
                throw new Error("El monto debe ser mayor a 0");
            }
            return true;
        }),
    body("currency")
        .custom(value => {
            if (!Object.values(Currency).includes(value)) {
                throw new Error("La moneda no es válida");
            }
            return true;
        })
]

const validatePaymentGetter: ValidationChain[] = [
    param("id")
        .exists().isMongoId().withMessage("El ID del payment es requerido")
]

export default Router()
    .post("/payment/cash", authenticateAdmin, withValidation(validateCashPayment), processCashPayment)
    .get("/payment/:id", authenticate, withValidation(validatePaymentGetter), getPayment)
    .post("/payment/refund", authenticate, processRefund)
    .post("/payment/refund/storm", authenticate, processStormRefund)
    .put("/payment/status/webhook/mercado_pago", updateMPPaymentStatus);
