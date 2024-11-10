import { database } from "@/configs/database.config";
import { Request, Response } from "express";

export class AddWorkareaMemberController {
  async handle(req: Request, res: Response) {
    const userId = req.user.id;
    const workareaId = Number(req.params.id);
    const data = req.body;

    if (!data.member) {
      res.status(400).send({ error: "E-mail ou username é obrigatório!" });
      return;
    }

    const user = await database.workarea.findFirst({
      where: {
        OR: [
          {
            ownerId: userId,
            id: workareaId,
          },
          {
            memberWorkarea: {
              some: {
                workareaId: workareaId,
                userId: userId,
                role: "LEADER",
              },
            },
          },
        ],
      },
    });

    if (!user) {
      res
        .status(403)
        .send({ error: "Você não é dono/líder desta área de trabalho" });
      return;
    }

    const member = await database.user.findFirst({
      where: {
        OR: [
          {
            email: data.member,
          },
          {
            username: data.member,
          },
        ],
      },
    });

    if (!member) {
      res.status(404).send({ error: "Usuário não encontrado!" });
      return;
    }

    await database.invite.create({
      data: {
        userId: member.id,
        workareaId: workareaId,
      },
    });

    res.sendStatus(201);
    return;
  }
}
