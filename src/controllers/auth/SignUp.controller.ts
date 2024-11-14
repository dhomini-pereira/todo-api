import { Request, Response } from "express";
import { database } from "../../configs/database.config";
import bcrypt from "bcrypt";
import { SendEmailService } from "@/services/SendEmail.service";
import { cache } from "@/configs/cache.config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { GenerateCodeUtil } from "@/utils/GenerateCode.util";

export class SignUpController {
  public async handle(req: Request, res: Response) {
    try {
      const data = req.body;

      if (!data || !data.username || !data.email || !data.password) {
        res.status(400).json({ error: "Existem campos vazios!" });
        return;
      }

      const user = await database.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: bcrypt.hashSync(data.password, 15),
        },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const code = new GenerateCodeUtil().generate();

      await cache.set(`activeAccount:${user.id}`, code, "EX", 60 * 15);

      await new SendEmailService().send(
        user.email,
        "Ativação de Conta",
        "ActiveEmail.hbs",
        { code: code, userId: user.id }
      );

      res.status(201).json(user);
      return;
    } catch (err) {
      return this.error(res, err);
    }
  }

  error(res: Response, err: any): void {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        if ((err.meta?.target as string[])?.includes("email")) {
          res.status(400).json({ error: "E-mail já cadastrado!" });
          return;
        }

        if ((err.meta?.target as string[])?.includes("username")) {
          res.status(400).json({ error: "Nome de usuário já cadastrado!" });
          return;
        }
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
