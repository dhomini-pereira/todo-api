import { Request, Response } from "express";
import { Server } from "socket.io";
import { database } from "../../configs/database.config";

export class CreateTaskController {
  constructor(private socket: Server) {
    this.handle = this.handle.bind(this);
  }
  async handle(req: Request, res: Response) {
    const data = req.body;
    const params = req.params;

    if (!params || !params.id) {
      res.status(400).send({ error: "Área de trabalho não informada" });
      return;
    }

    const workareaId = Number(params.id);

    if (!data || !data.title) {
      res.status(400).send({ error: "Dados inválidos" });
      return;
    }

    const task = await database.task.create({
      data: {
        ...data,
        workareaId: workareaId,
      },
    });
    res.sendStatus(204);
    this.socket.to(`workarea_${workareaId}`).emit("create_task", task);
    return;
  }
}
