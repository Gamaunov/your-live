export const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Твоё Лайв',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        basicAuth: {
          type: 'http',
          scheme: 'basic',
        },
      },
    },
  },
  apis: ['**/*router.ts'],
};
