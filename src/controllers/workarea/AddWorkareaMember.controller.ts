import { database } from "../../configs/database.config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Request, Response } from "express";

export class AddWorkareaMemberController {
  async handle(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const workareaId = Number(req.params.id);
      const data = req.body;

      if (!data || !data.member) {
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
          .send({ error: "Você não é dono/líder desta área de trabalho!" });
        return;
      }

      if (user.type === "PERSONAL") {
        res
          .status(400)
          .send({
            error:
              "Você não pode convidar usuários em uma área de trabalho PERSONAL!",
          });
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

      if (member.id === userId) {
        res.status(400).send({ error: "Você não pode convidar você mesmo!" });
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
    } catch (err) {
      return this.error(res, err);
    }
  }

  error(res: Response, err: any): void {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.status(400).send({ error: "Usuário já convidado!" });
        return;
      } else {
        res.status(500).send({ error: "Erro interno do servidor!" });
        return;
      }
    } else {
      res.status(500).send({ error: "Erro interno do servidor!" });
      return;
    }
  }
}
