import { Task } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { TaskRepo } from "../../repos/Task.repo";

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).nullable(),
  userId: z.string().uuid(),
});

type TaskSchema = z.infer<typeof taskSchema>;

export class CreateTaskController {
  public static async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;

    const task: TaskSchema = taskSchema.parse({
      ...(request.body as any),
      userId,
    });

    const payload = await new TaskRepo().create(task);

    return reply.send(payload);
  }
}
