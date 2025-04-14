import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi, { SwaggerUiOptions } from 'swagger-ui-express';
import { Express } from "express";
import { HOST } from "@config/config.properties";

const swaggerSpec = swaggerJsdoc({
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
});


const options: SwaggerUiOptions = {
    swaggerOptions: {
        validatorUrl : null,
        oauth: {
            clientId: "",
            clientSecret: "",
            appName: "TropicalHub",
            scopeSeparator: ",",
            additionalQueryStringParams: {}
        }
    }
};

export default (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));
    console.log(`Swagger docs available at ${ HOST }/api-docs`);
};
