import { FastifyReply, FastifyRequest } from "fastify";
import { UserRepo } from "../../repos/User.repo";

export class HasLoggedInController {
  public static async handle(request: FastifyRequest, reply: FastifyReply) {
    const user = await new UserRepo().readOne(request.user.id);

    return reply.status(200).send({
      id: user?.id,
      email: user?.email,
      name: user?.name,
      avatarUrl: user?.avatarUrl,
    });
  }
}
