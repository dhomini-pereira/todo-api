import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { TaskRepo } from "../../repos/Task.repo";

const taskSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).nullish(),
  status: z.enum(["DONE", "PENDING", "CANCELED"]).optional(),
  userId: z.string().uuid(),
});

type TaskSchema = z.infer<typeof taskSchema>;

export class UpdateTaskController {
  public static async handle(request: FastifyRequest, reply: FastifyReply) {
    const task: TaskSchema = taskSchema.parse({
      ...(request.body as any),
      id: Number((request.params as any).id),
      userId: request.user.id,
    });

    if (!task.title && !task.description && !task.status)
      return reply.status(400).send({
        message: "There must be at least one field",
      });

    const payload = new TaskRepo().update(task);

    return reply.send(payload);
  }
}
