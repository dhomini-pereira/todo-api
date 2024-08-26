import { Task } from "@prisma/client";
import { database } from "../config/database.config";

export class TaskRepo {
  private readonly LIMIT = 10;
  create(task: Omit<Task, "id" | "status" | "createdAt">) {
    return database.task.create({
      data: {
        title: task.title,
        description: task.description,
        userId: task.userId,
      },
    });
  }

  read(options: { page: number; userId: string }) {
    return database.task.findMany({
      where: {
        userId: options.userId,
      },
      skip: (options.page - 1) * this.LIMIT,
      take: this.LIMIT,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
      },
    });
  }

  readOne(id: number, userId: string) {
    return database.task.findFirst({
      where: { id, userId },
    });
  }

  delete(id: number, userId: string) {
    return database.task.delete({
      where: { id, userId },
    });
  }

  update(
    task: Partial<Omit<Task, "createdAt">> & { id: number; userId: string }
  ) {
    return database.task.update({
      where: { id: task.id, userId: task.userId },
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
      },
    });
  }
}
