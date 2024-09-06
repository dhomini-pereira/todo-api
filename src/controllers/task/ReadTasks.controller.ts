import { FastifyReply, FastifyRequest } from "fastify";
import { TaskRepo } from "../../repos/Task.repo";
import { database } from "../../config/database.config";

enum Status {
  CANCELED = "CANCELED",
  PENDING = "PENDING",
  DONE = "DONE",
}

export class ReadTasksController {
  public static async handle(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as {
      page: number;
      status?: Status;
      text?: string;
    };
    const userId = request.user.id;

    const [tasks, count] = await Promise.all([
      new TaskRepo().read({ ...query, userId }),
      database.task.count({
        where: {
          userId,
          AND: {
            status: query?.status,
            OR: [
              {
                title: {
                  contains: query?.text,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: query?.text,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      }),
    ]);

    return reply.send({
      total: count.valueOf(),
      tasks,
    });
  }
}
