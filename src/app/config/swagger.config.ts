import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi, { SwaggerUiOptions } from 'swagger-ui-express';
import { Express } from "express";
import { HOST } from "@config/config.properties";

const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Sistema de Gestión de Alquiler de Productos de Playa',
            description: 'Para un parador en el caribe.\n\n' +
                'Para obtener el googleJWT token necesario para iniciar sesión con Google utilizar: ' +
                '<a target="_blank"  href="https://nicoarbio.github.io/get-googlejwt-from-clientid/?clientId=205278716679-sas68d5f4trinhumfutpc6i1jdu6ed7a.apps.googleusercontent.com">esta herramienta.</a>',
            version: '1.0.0',
        },
    },
    failOnErrors: true,
    apis: [
        "docs/swagger/**/*.yaml"
    ]
});

const options: SwaggerUiOptions = {
    customSiteTitle: "TropicalHub | Swagger API Docs",
    swaggerOptions: {
        persistAuthorization: true
    }
};

export default (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));
    console.log(`Swagger docs available at ${ HOST }api-docs`);
};
