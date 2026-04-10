import swaggerJsDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Paradise AI API",
      version: "1.0.0",
    },
  },
  apis: ["./server/routes/*.ts"],
});
