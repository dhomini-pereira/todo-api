import { Request, Response } from "express";
import { database } from "@/configs/database.config";
import { Server } from "socket.io";

export class DeleteTaskController {
  constructor(private socket: Server) {
    this.handle = this.handle.bind(this);
  }
  async handle(req: Request, res: Response) {
    const params = req.params;

    if (!params || !params.id || !params.taskId) {
      res.status(400).send({ error: "Dados inválidos!" });
      return;
    }

    const deletedTask = await database.task.delete({
      where: {
        id: Number(params.taskId),
        workareaId: Number(params.id),
      },
    });

    res.sendStatus(204);
    this.socket.to(`workarea_${params.id}`).emit("delete_task", deletedTask);
    return;
  }
}
