import { Request, Response } from "express";
import { database } from "../../configs/database.config";
import bcrypt from "bcrypt";
import { cache } from "../../configs/cache.config";
import { GenerateTokenUtil } from "../../utils/GenerateToken.util";

export class SignInController {
  public async handle(req: Request, res: Response) {
    const data = req.body;

    if (!data || !data.email || !data.password) {
      res.status(400).json({ errorcl: "Existem campos vazios!" });
      return;
    }

    const user = await database.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        active: true,
        password: true,
      },
    });

    if (!user || !bcrypt.compareSync(data.password, user.password)) {
      res.status(400).json({ error: "E-Mail ou senha inválidos!" });
      return;
    }

    if (!user.active) {
      res.status(400).json({ error: "Conta não ativada!" });
      return;
    }

    const refreshToken = GenerateTokenUtil.generate(
      { userId: user.id },
      process.env.SECRET_REFRESH_JWT as string,
      "7d"
    );
    const accessToken = GenerateTokenUtil.generate(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      process.env.SECRET_ACCESS_JWT as string,
      "30m"
    );

    await cache.set(`refreshToken:${user.id}`, refreshToken, {
      ex: 60 * 60 * 24 * 7,
    });

    res.status(200).send({ accessToken, refreshToken });
    return;
  }
}
