import { FastifyReply, FastifyRequest } from "fastify";
import { IdentifyService } from "../services/Identify.service";

export class AuthGuardMiddleware {
  public static async handle(
    request: FastifyRequest,
    reply: FastifyReply,
    done: (err?: Error | undefined) => void
  ) {
    const token = request.headers.authorization;
    if (!token) return reply.status(401).send({ message: "Token is missing" });

    if (!token.startsWith("Bearer "))
      return reply.status(401).send({ message: "Invalid Token" });

    const payload = new IdentifyService().verify(token);

    request.user = payload;

    return done();
  }
}
