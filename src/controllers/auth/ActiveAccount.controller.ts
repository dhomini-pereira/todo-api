import { cache } from "@/configs/cache.config";
import { database } from "@/configs/database.config";
import { Request, Response } from "express";

export class ActiveAccountController {
  async handle(req: Request, res: Response) {
    const data = req.body;

    if (!data || !data.code || !data.userId) {
      res.status(400).send({ error: "Código ou ID do usuário não informado!" });
      return;
    }

    const codeReview = await cache.get(`activeAccount:${data.userId}`);

    if (!codeReview) {
      res.status(400).send({ error: "Código expirado!" });
      return;
    }

    if (data.code != codeReview) {
      res.status(400).send({ error: "Código inválido!" });
      return;
    }

    await cache.del(`activeAccount:${data.userId}`);

    await database.user.update({
      where: {
        id: data.userId,
      },
      data: {
        active: true,
      },
    });

    res.sendStatus(204);
    return;
  }
}
