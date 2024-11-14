import { Request, Response } from "express";
import { cache } from "../../configs/cache.config";
import { GenerateTokenUtil } from "../../utils/GenerateToken.util";
import { database } from "../../configs/database.config";
import { decode } from "jsonwebtoken";

export class RefreshTokenController {
  public async handle(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).send({ error: "Refresh Token não enviado" });
      return;
    }

    const userInfo = decode(refreshToken) as { userId: string };

    if (!userInfo) {
      res.status(401).send({ error: "Refresh Token inválido" });
      return;
    }
    
    const user = await database.user.findFirst({
      where: {
        id: userInfo.userId,
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

    const refresh = await cache.get(`refreshToken:${userInfo.userId}`);

    if (!refresh) {
      res.status(401).send({ error: "Refresh Token expiredo" });
      return;
    }

    if (refresh !== refreshToken) {
      res.status(401).send({ error: "Refresh Token inválido" });
      return;
    }

    const accessToken = GenerateTokenUtil.generate(
      user,
      process.env.SECRET_ACCESS_JWT as string,
      "30m"
    );

    res.status(200).send({ accessToken });
    return;
  }
}
