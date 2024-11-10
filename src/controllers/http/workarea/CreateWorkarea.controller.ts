import { database } from "@/configs/database.config";
import { Request, Response } from "express";

export class CreateWorkareaController {
  async handle(req: Request, res: Response) {
    const data = req.body;
    const user = req.user;

    await database.workarea.create({
      data: {
        name: data.name,
        type: data.type,
        ownerId: user.id,
      },
    });

    res.sendStatus(201);
    return;
  }
}
