import { database } from "@/configs/database.config";
import { Task } from "@prisma/client";
import { Server, Socket } from "socket.io";

export class ChangeTaskTypeController {
  async handle(io: Server, socket: Socket, data: Task) {
    const workareaId = Number(socket.handshake.query.workareaId);
    const status = data.status;

    const task = await database.task.update({
      where: {
        id: data.id,
      },
      data: {
        status: status,
      },
    });

    return io.to(`workarea_${workareaId}`).emit("change_task_type", task);
  }
}
