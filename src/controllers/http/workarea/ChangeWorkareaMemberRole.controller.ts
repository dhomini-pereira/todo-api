import { database } from "@/configs/database.config";
import { Request, Response } from "express";

export class ChangeWorkareaMemberRoleController {
  async handle(req: Request, res: Response) {
    const userId = req.user.id;
    const workareaId = Number(req.params.id);
    const memberId = req.params.memberId;
    const role = req.body.role;

    const user = await database.workarea.findFirst({
      where: {
        ownerId: userId,
        id: workareaId,
      },
    });

    if (!user) {
      res
        .status(403)
        .send({ error: "Você não é dono desta área de trabalho!" });
      return;
    }

    if (userId === memberId) {
      res.status(400).send({ error: "Você não pode alterar o próprio cargo!" });
    }

    await database.memberWorkarea.update({
      where: {
        userId_workareaId: {
          userId: memberId,
          workareaId,
        },
      },
      data: {
        role,
      },
    });

    res.sendStatus(204);
    return;
  }
}
