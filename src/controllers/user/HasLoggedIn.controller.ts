import { FastifyReply, FastifyRequest } from "fastify";

export class HasLoggedInController {
  public static async handle(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(200).send({
      id: request.user.id,
      email: request.user.email,
      name: request.user.name,
      avatarUrl: request.user.avatarUrl ?? undefined,
    });
  }
}
