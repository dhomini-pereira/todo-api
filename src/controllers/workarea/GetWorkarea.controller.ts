import { database } from "../../configs/database.config";
import { Request, Response } from "express";

export class GetWorkareaController {
  async handle(req: Request, res: Response) {
    const user = req.user;
    const workareaId = Number(req.params.id);

    const workarea = await database.workarea.findFirst({
      where: {
        OR: [
          {
            ownerId: user.id,
            id: workareaId,
          },
          {
            memberWorkarea: {
              some: {
                userId: user.id,
                workareaId: workareaId,
              },
            },
          },
        ],
      },
    });

    if (!workarea) {
      res.status(403).send({
        error: "Você não faz parte desta área de trabalho!",
      });
      return;
    }

    res.status(200).send(workarea);
    return;
  }
}
