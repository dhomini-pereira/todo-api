import { Request, Response } from "express";
import { cache } from "../../../configs/cache.config";
import { GenerateTokenUtil } from "../../../utils/GenerateToken.util";
import { database } from "../../../configs/database.config";

export class RefreshTokenController {
  public async handle(req: Request, res: Response) {
    const { userId, refreshToken } = req.body;

    if (!userId || !refreshToken) {
      res.status(401).send({ error: "Missing refresh token" });
      return;
    }

    const user = await database.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(401).send({ error: "User not found" });
      return;
    }

    const refresh = await cache.get(`refreshToken:${userId}`);

    if (refresh !== refreshToken) {
      res.status(401).send({ error: "Invalid refresh token" });
      return;
    }

    const accessToken = GenerateTokenUtil.generate(user, "access", "30m");

    res.status(200).send({ accessToken });
    return;
  }
}
