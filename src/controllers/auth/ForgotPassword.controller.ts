import { cache } from "../../configs/cache.config";
import { database } from "../../configs/database.config";
import { SendEmailService } from "../../services/SendEmail.service";
import { GenerateCodeUtil } from "../../utils/GenerateCode.util";
import { Request, Response } from "express";

export class ForgotPasswordController {
  async handle(req: Request, res: Response) {
    const data = req.body;

    if (!data || !data.email) {
      res.status(400).send({ error: "E-mail não informado!" });
      return;
    }

    const user = await database.user.findFirst({
      where: {
        email: data.email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        active: true,
      },
    });

    if (!user) {
      res.status(400).send({ error: "E-mail não cadastrado!" });
      return;
    }

    if (!user.active) {
      res.status(400).send({ error: "Conta não ativada!" });
      return;
    }

    const code = new GenerateCodeUtil().generate();

    await cache.set(`forgotPassword:${user.id}`, code, { ex: 60 * 5 });

    await new SendEmailService().send(
      user.email,
      "Recuperação de senha",
      "ForgotPassword.hbs",
      { code: code, userId: user.id }
    );

    res.sendStatus(204);
    return;
  }
}
