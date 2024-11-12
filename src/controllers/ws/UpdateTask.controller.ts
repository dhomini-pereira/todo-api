import { database } from "@/configs/database.config";
import { Task } from "@prisma/client";
import { Server, Socket } from "socket.io";

export class UpdateTaskController {
  async handle(
    io: Server,
    socket: Socket,
    data: Partial<Omit<Task, "id">> & { id: number }
  ) {
    const workareaId = Number(socket.handshake.query.workareaId);

    if (!data || !data.id) return socket.emit("error", "Dados inválidos");

    if (
      !data.title &&
      !data.description &&
      !data.assignedId &&
      !data.timeEstimate
    ) {
      return socket.emit("error", "Dados inválidos");
    }

    const task = await database.task.update({
      where: {
        id: data.id,
      },
      data: data,
    });

    return io.to(`workarea_${workareaId}`).emit("update_task", task);
  }
}
