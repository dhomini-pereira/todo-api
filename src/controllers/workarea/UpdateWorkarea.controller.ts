import { database } from "../../configs/database.config";
import { Request, Response } from "express";

export class UpdateWorkareaController {
  async handle(req: Request, res: Response) {
    const data = req.body;
    const workareaId = Number(req.params.id);
    const userId = req.user.id;

    if (!data || !data.name) {
      res.status(400).send({ error: "Nome é obrigatório!" });
      return;
    }

    const user = await database.workarea.findFirst({
      where: {
        id: workareaId,
      },
    });

    if (!user) {
      res.status(403).send({ error: "Esta área de trabalho não existe!" });
      return;
    }

    if (user.ownerId !== userId) {
      res.status(403).send({ error: "Você não é dono desta área de trabalho" });
      return;
    }

    await database.workarea.update({
      where: {
        id: workareaId,
      },
      data: {
        name: data.name,
      },
    });

    res.sendStatus(204);
    return;
  }
}
