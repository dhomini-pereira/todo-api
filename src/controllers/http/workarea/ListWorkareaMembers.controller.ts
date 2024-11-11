import { database } from "@/configs/database.config";
import { Request, Response } from "express";

export class ListWorkareaMembersController {
  async handle(req: Request, res: Response) {
    const userId = req.user.id;
    const workareaId = Number(req.params.id);

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
