import { FastifyReply, FastifyRequest } from "fastify";
import { UserRepo } from "../../repos/User.repo";

export class DeleteUserController {
  public static async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id as string;

    const payload = await new UserRepo().delete(userId);

    return reply.send(payload);
  }
}
