import { Router } from "express";
import { getUserProfile, updateUserProfile } from "@controller/profile.controller";
import { authenticate } from "@middleware/authentication.middleware";
import { withValidation } from "@middleware/validateRequest.middleware";
import { body } from 'express-validator';

export const profileUpdateValidation = [
    body('name')
        .optional()
        .isString().withMessage('El nombre debe ser una cadena')
        .isLength({ min: 1 }).withMessage('El nombre no puede estar vacío'),

    body('lastname')
        .optional()
        .isString().withMessage('El apellido debe ser una cadena')
        .isLength({ min: 1 }).withMessage('El apellido no puede estar vacío'),

    body('phoneNumber')
        .optional()
        .isString().withMessage('El teléfono debe ser una cadena'),
];

export default Router()
    .get("/profile", authenticate, getUserProfile)
    .put("/profile", authenticate, withValidation(profileUpdateValidation), updateUserProfile);
