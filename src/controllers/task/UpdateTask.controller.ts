import { Request, Response } from "express";
import { database } from "../../configs/database.config";
import { Task } from "@prisma/client";
import { Server } from "socket.io";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class UpdateTaskController {
  constructor(private socket: Server) {
    this.handle = this.handle.bind(this);
  }
  async handle(req: Request, res: Response) {
    try {
      const params = req.params;

      if (!params || !params.id) {
        res.status(400).send({ error: "Dados inválidos!" });
        return;
      }
      const data: Partial<Omit<Task, "id">> & { id: number } = req.body;

      const workareaId = Number(params.id);

      if (!data || !data.id) {
        res.status(400).send({ error: "Dados inválidos!" });
        return;
      }

      if (
        !data.title &&
        !data.description &&
        !data.assignedId &&
        !data.timeEstimate &&
        !data.status
      ) {
        res.status(400).send({ error: "Dados inválidos!" });
        return;
      }

      const task = await database.task.update({
        where: {
          id: data.id,
        },
        data: data,
      });

      res.sendStatus(200);
      this.socket.to(`workarea_${workareaId}`).emit("update_task", task);
      return;
    } catch (err: any) {
      this.error(res, err);
    }
  }

  error(res: Response, err: any): void {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        res.status(400).send({ error: "Tarefa não encontrada!" });
        return;
      } else {
        res.status(500).json({ error: "Erro interno do servidor!" });
        return;
      }
    } else {
      res.status(500).send({ error: "Erro interno do servidor!" });
      return;
    }
  }
}
