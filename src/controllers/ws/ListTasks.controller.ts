import { database } from "@/configs/database.config";
import { Server, Socket } from "socket.io";

export class ListTasksController {
  async handle(io: Server, socket: Socket) {
    const workareaId = Number(socket.handshake.query.workareaId);

    const tasks = await database.task.findMany({
      where: {
        workareaId,
      },
    });

    return io.to(`workarea_${workareaId}`).emit("list_tasks", tasks);
  }
}
