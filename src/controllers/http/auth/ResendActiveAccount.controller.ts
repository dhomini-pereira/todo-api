import { cache } from "@/configs/cache.config";
import { database } from "@/configs/database.config";
import { SendEmailService } from "@/services/SendEmail.service";
import { Request, Response } from "express";

export class ResendActiveAccountController {
  async handle(req: Request, res: Response) {
    const data = req.body;

    if (!data || !data.userId) {
      res.status(400).send({ error: "ID do usuário não informado!" });
      return;
    }

    const user = await database.user.findFirst({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      res.status(404).send({ error: "Usuário não encontrado!" });
      return;
    }

    if (user.active) {
      res.status(400).send({ error: "Conta já ativada!" });
      return;
    }

    const oldCode = await cache.get(`activeAccount:${user.id}`);

    if (oldCode) await cache.del(`activeAccount:${user.id}`);

    const code = String(Math.floor(100000 + Math.random() * 900000)).padStart(
      6,
      "0"
    );

    await cache.set(`activeAccount:${user.id}`, code, "EX", 60 * 15);

    await new SendEmailService().send(
      user.email,
      "Ativação de Conta",
      "ActiveEmail.hbs",
      { code: code, userId: user.id }
    );

    res.sendStatus(204);
    return;
  }
}
