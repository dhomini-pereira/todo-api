import { Request, Response } from "express";
import { database } from "../../../configs/database.config";
import bcrypt from "bcrypt";
import { SendEmailService } from "@/services/SendEmail.service";
import { cache } from "@/configs/cache.config";

export class SignUpController {
  public async handle(req: Request, res: Response) {
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

    res.status(201).json(user);
    return;
  }
}
