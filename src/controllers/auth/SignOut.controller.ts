import { Request, Response } from "express";
import { cache } from "../../configs/cache.config";

export class SignOutController {
  async handle(req: Request, res: Response) {
    const { id } = req.user;

    await cache.del(`refreshToken:${id}`);
    res.sendStatus(204);
    return;
  }
}
