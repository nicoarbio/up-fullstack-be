import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { getDirname } from "../utils/pathHelper.js";
import { Express } from "express";

const dir = getDirname(import.meta.url);

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Sistema de Gestión de Alquiler de Productos de Playa',
            description: 'Para un parador en el caribe',
            version: '1.0.0',
        },
    },
    failOnErrors: true,
    apis: [
        path.join(dir, "./../../../docs/swagger/**/*.yaml")
    ]
};

const specs = swaggerJsdoc(options);

export default (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
