import { database } from "@/configs/database.config";
import { Request, Response } from "express";

export class ListWorkareaMembersController {
  async handle(req: Request, res: Response) {
    const workareaId = Number(req.params.id);
    const userId = req.user.id;

    const workarea = await database.workarea.findFirst({
      where: {
        OR: [
          {
            id: workareaId,
            ownerId: userId,
          },
          {
            memberWorkarea: {
              some: {
                userId: userId,
                workareaId: workareaId,
              },
            },
          },
        ],
      },
    });

    if (!workarea) {
      res
        .status(403)
        .send({ error: "Você não faz parte desta área de trabalho!" });
      return;
    }

    const members = await database.user.findMany({
      distinct: ["id"],
      select: {
        id: true,
        username: true,
        email: true,
        imageURL: true,
        createdAt: true,
        updatedAt: true,
        memberWorkarea: {
          select: {
            role: true,
          },
        },
      },
      where: {
        OR: [
          {
            workareas: {
              some: {
                id: workareaId,
              },
            },
          },
          {
            memberWorkarea: {
              some: {
                workareaId: workareaId,
              },
            },
          },
        ],
      },
    });

    res.status(200).send(members);
    return;
  }
}
