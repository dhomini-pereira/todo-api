import { database } from "../../configs/database.config";
import { Request, Response } from "express";

export class GetUserController {
  async handle(req: Request, res: Response) {
    const user = req.user;

    const userData = await database.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        imageURL: true,
      },
    });

    res.status(200).send(userData);
    return;
  }
}
