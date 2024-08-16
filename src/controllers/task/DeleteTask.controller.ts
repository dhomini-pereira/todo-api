import { FastifyReply, FastifyRequest } from "fastify";
import { TaskRepo } from "../../repos/Task.repo";

export class DeleteTaskController {
  public static async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const id = Number((request.params as { id: string }).id);

    const payload = await new TaskRepo().delete(id, userId);

    return reply.send(payload);
  }
}
