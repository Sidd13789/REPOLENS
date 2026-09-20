import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CodeTimeMachine API",
      version: "1.0.0",
      description:
        "GitHub Repository Evolution & Analytics Platform — REST API reference.",
    },
    servers: [{ url: "/api" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
  apis: ["./routes/*.js"], // reads the JSDoc @openapi comments in route files
};

export const swaggerSpec = swaggerJsdoc(options);
