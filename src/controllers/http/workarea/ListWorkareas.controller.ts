import { database } from "@/configs/database.config";
import { Request, Response } from "express";

export class ListWorkareasController {
  async handle(req: Request, res: Response) {
    const userId = req.user.id;

    const workareas = await database.workarea.findMany({
      distinct: ["id"],
      select: {
        id: true,
        name: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        OR: [
          {
            memberWorkarea: {
              some: {
                userId,
              },
            },
          },
          {
            ownerId: userId,
          },
        ],
      },
    });

    res.status(200).send(workareas);
    return;
  }
}
