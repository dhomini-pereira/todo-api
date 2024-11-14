import { database } from "@/configs/database.config";
import { Request, Response } from "express";

export class ListInvitesController {
  async handle(req: Request, res: Response) {
    const userId = req.user.id;

    const invites = await database.invite.findMany({
      where: {
        userId: userId,
      },
      include: {
        workarea: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(200).send(invites);
    return;
  }
}
