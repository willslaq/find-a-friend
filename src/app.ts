import fastify from "fastify";
import { env } from "./env";
import fastifySwagger from "@fastify/swagger";
import { ZodError } from "zod";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { createLogger, format, transports } from "winston";

const logger = createLogger({
    level: "info",
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "error.log", level: "error" }),
    ]
})

export const app = fastify({
    logger: env.NODE_ENV !== "production",
})

app.register(fastifySwagger, {
        swagger:{ 
        info: {
            title: "Find a Friend API",
            description: "API for the application Find a Friend that connects people with pets",
            version: "0.1.0",
        },
        host: `${env.HOST}:${env.PORT}`,
        schemes: ["http", "https"],
        consumes: ["application/json"],
        produces: ["application/json"],
    }
})

app.register(fastifySwaggerUi, {
    routePrefix: "/documentation",
    uiConfig: {
        docExpansion: "full",
        deepLinking: true
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => swaggerObject,
    transformSpecificationClone: true
})

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply
        .status(400)
        .send({ message: "Validation error", issues: error.format() })
    }

    if (env.NODE_ENV !== "production") {
        console.error(error)
    } else {
        logger.error("Something went wrong")
    }

    return reply.status(500).send({ message: "Internal server error" })
})

app.ready((error) => {
    if (error) throw error
    app.swagger()
})