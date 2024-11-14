import { cache } from "../../configs/cache.config";
import { database } from "../../configs/database.config";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export class ResetPasswordController {
  async handle(req: Request, res: Response) {
    const data = req.body;

    if (!data || !data.code || !data.password || !data.userId) {
      res.status(400).send({ error: "Código ou senha não informada!" });
      return;
    }

    const code = await cache.get(`forgotPassword:${data.userId}`);

    if (!code) {
      res.status(400).send({ error: "Código expirado!" });
      return;
    }

    if (code != data.code) {
      res.status(400).send({ error: "Código inválido!" });
      return;
    }

    await cache.del(`forgotPassword:${data.userId}`);

    await database.user.update({
      where: {
        id: data.userId,
      },
      data: {
        password: bcrypt.hashSync(data.password, 15),
      },
    });

    res.sendStatus(204);
    return;
  }
}
