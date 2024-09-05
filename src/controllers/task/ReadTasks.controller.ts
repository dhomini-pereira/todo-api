import { FastifyReply, FastifyRequest } from "fastify";
import { TaskRepo } from "../../repos/Task.repo";
import { database } from "../../config/database.config";

export class ReadTasksController {
  public static async handle(request: FastifyRequest, reply: FastifyReply) {
    const { page } = request.query as { page: number };
    const userId = request.user.id;

    const [tasks, count] = await Promise.all([
      new TaskRepo().read({ page, userId }),
      database.task.count({ where: { userId } }),
    ]);

    return reply.send({
      total: count.valueOf(),
      tasks,
    });
  }
}
