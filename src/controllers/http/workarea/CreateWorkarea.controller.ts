import { database } from "@/configs/database.config";
import { Request, Response } from "express";

export class CreateWorkareaController {
  async handle(req: Request, res: Response) {
    const data = req.body;
    const user = req.user;

    if (!data) {
      res.status(400).send({ error: "Dados inválidos!" });
      return;
    }

    if (!data.name) {
      res.status(400).send({ error: "Nome é obrigatório!" });
      return;
    }

    if (!data.type) {
      res.status(400).send({ error: "Tipo é obrigatório!" });
      return;
    }

    await database.workarea.create({
      data: {
        name: data.name,
        type: data.type,
        ownerId: user.id,
      },
    });

    res.sendStatus(201);
    return;
  }
}
