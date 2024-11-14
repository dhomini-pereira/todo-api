import { database } from "../../configs/database.config";
import { Request, Response } from "express";

export class ListTasksController {
  async handle(req: Request, res: Response) {
    const params = req.params;

    if (!params || !params.id) {
      res.status(400).send({ error: "Área de trabalho não informada" });
      return;
    }

    const workareaId = Number(req.params.id);

    const tasks = await database.task.findMany({
      where: {
        workareaId,
      },
    });

    res.status(200).send(tasks);
    return;
  }
}
