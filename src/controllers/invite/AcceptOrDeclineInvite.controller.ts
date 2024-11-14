import { database } from "../../configs/database.config";
import { Request, Response } from "express";

export class AcceptOrDeclineInviteController {
  async handle(req: Request, res: Response) {
    const data = req.body;
    const user = req.user;

    if (!data || data.accepted == null || !data.workareaId) {
      res.status(400).send({ error: "Dados inválidos!" });
      return;
    }

    if (data.accepted) {
      await database.memberWorkarea.create({
        data: {
          userId: user.id,
          workareaId: data.workareaId,
        },
      });
    }

    await database.invite.delete({
      where: {
        userId_workareaId: {
          userId: user.id,
          workareaId: data.workareaId,
        },
      },
    });

    res.sendStatus(204);
    return;
  }
}
