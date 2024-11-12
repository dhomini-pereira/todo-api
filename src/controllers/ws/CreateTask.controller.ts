import { database } from "@/configs/database.config";
import { Task } from "@prisma/client";
import { Server, Socket } from "socket.io";

export class CreateTaskController {
  async handle(io: Server, socket: Socket, data: Task) {
    const workareaId = Number(socket.handshake.query.workareaId);

    if (!data || !data.title) return socket.emit("error", "Dados inválidos");

    const task = await database.task.create({
      data: {
        ...data,
        workareaId: workareaId,
      },
    });

    return io.to(`workarea_${workareaId}`).emit("create_task", task);
  }
}
