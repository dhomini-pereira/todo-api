import { database } from "@/configs/database.config";
import { Request, Response } from "express";

export class RemoveWorkareaMemberController {
  async handle(req: Request, res: Response) {
    const userId = req.user.id;
    const workareaId = Number(req.params.id);
    const memberId = req.params.memberId;

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

    const memberWorkarea = await database.memberWorkarea.findFirst({
      where: {
        userId: memberId,
        workareaId,
      },
    });

    if (!memberWorkarea) {
      res.status(404).send({ error: "Este usuário não está nesta workarea!" });
      return;
    }

    await database.memberWorkarea.delete({
      where: {
        userId_workareaId: {
          userId: memberId,
          workareaId,
        },
      },
    });

    res.sendStatus(204);
    return;
  }
}
