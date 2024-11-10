import { Request, Response } from "express";
import { database } from "../../../configs/database.config";
import bcrypt from "bcrypt";
import { cache } from "../../../configs/cache.config";
import { GenerateTokenUtil } from "../../../utils/GenerateToken.util";

export class SignInController {
  public async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Existem campos vazios!" });
      return;
    }

    const user = await database.user.findUnique({
      where: {
        email,
        password: bcrypt.hashSync(password, 15),
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        active: true,
      },
    });

    if (!user) {
      res.status(401).json({ message: "E-Mail ou senha inválidos!" });
      return;
    }

    if (!user.active) {
      res.status(401).json({ message: "Conta não ativada!" });
      return;
    }

    const refreshToken = GenerateTokenUtil.generate(
      { userId: user.id },
      "refresh",
      "7d"
    );
    const accessToken = GenerateTokenUtil.generate(user, "access", "30m");

    await cache.set(
      `refreshToken:${user.id}`,
      refreshToken,
      "EX",
      60 * 60 * 24 * 7
    );

    res.status(200).send({ accessToken, refreshToken });
    return;
  }
}
