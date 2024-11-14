import { database } from "@/configs/database.config";
import { Request, Response } from "express";

export class DeleteWorkareaController {
  async handle(req: Request, res: Response) {
    const userId = req.user.id;
    const workareaId = Number(req.params.id);

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
      res
        .status(403)
        .send({ error: "Você não é dono desta área de trabalho!" });
      return;
    }

    await database.workarea.delete({
      where: {
        id: workareaId,
      },
    });
    res.sendStatus(204);
    return;
  }
}
