import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from "express";
import { HOST } from "@config/config.properties";

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
        "docs/swagger/**/*.yaml"
    ]
};

const specs = swaggerJsdoc(options);

export default (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    console.log(`Swagger docs available at ${HOST}/api-docs`);
};
