import { database } from "@/configs/database.config";
import { Server, Socket } from "socket.io";

export class DeleteTaskController {
  async handle(io: Server, socket: Socket, data: { id: number }) {
    const workareaId = Number(socket.handshake.query.workareaId);
    if (!data || !data.id) {
      return socket.emit("error", "Dados inválidos");
    }

    const task = await database.task.delete({
      where: {
        id: data.id,
      },
    });

    return io.to(`workarea_${workareaId}`).emit("delete_task", task);
  }
}
