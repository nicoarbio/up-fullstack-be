import { Router } from "express";
import { authenticate, authenticateAdmin } from "@middleware/authentication.middleware";
import { withValidation } from "@middleware/validateRequest.middleware";
import { body, param, ValidationChain } from "express-validator";
import { getRefund, processRefund, processStormRefund, registerCashRefund } from "@controller/refund.controller";

const validateRefundId: ValidationChain[] = [
    param("id")
        .exists().isMongoId().withMessage("El ID del reembolso es requerido")
];

const validateRefundIdAndReason: ValidationChain[] = [
    param("bookingId")
        .exists().isMongoId().withMessage("El ID del turno es requerido"),
    body("reason")
        .optional().isString()
        .isLength({ max: 1000 }).withMessage("El motivo del reembolso no puede tener más de 1000 caracteres")
];

const validateStormRefundId: ValidationChain[] = [
    param("bookingId")
        .exists().isMongoId().withMessage("El ID del turno es requerido"),
];

export default Router()
    .post("/refund", authenticate, withValidation(validateRefundIdAndReason), processRefund)
    .post("/refund/storm", authenticateAdmin, withValidation(validateStormRefundId), processStormRefund)
    .get("/refund/:id", authenticate, withValidation(validateRefundId), getRefund)
    .post("/refund/:id/register-cash", authenticateAdmin, withValidation(validateRefundId), registerCashRefund);
