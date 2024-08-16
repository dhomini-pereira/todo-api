import { FastifyReply, FastifyRequest } from "fastify";
import { TaskRepo } from "../../repos/Task.repo";

export class ReadTaskController {
  public static async handle(request: FastifyRequest, reply: FastifyReply) {
    const id: number = Number((request.params as { id: string }).id);

    const payload = await new TaskRepo().readOne(id, request.user.id);

    return reply.send(payload);
  }
}
