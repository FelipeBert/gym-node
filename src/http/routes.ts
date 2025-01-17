import type { FastifyInstance } from "fastify";
import { register } from "./controllers/registerController";
import { authenticate } from "./controllers/authenticateController";
import { profile } from "./controllers/profileController";

export async function appRoutes(app: FastifyInstance){
    app.post('/users', register)
    app.post('/sessions', authenticate)
    app.get('/me', profile)
}