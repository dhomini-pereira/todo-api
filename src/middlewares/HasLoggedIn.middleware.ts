import { NextFunction, Request, Response } from "express";
import { ValidateTokenUtil } from "@/utils/ValidateToken.util";
import { ExtendedError, Socket } from "socket.io";
import { User } from "@prisma/client";

export class HasLoggedIn {
  ws(socket: Socket, next: (err?: ExtendedError) => void) {
    const token = socket.handshake.query.token;

    if (!token) {
      return next(new Error("Token não fornecido"));
    }

    const tokenValidated = new ValidateTokenUtil().validate(
      token as string,
      process.env.SECRET_ACCESS_JWT as string
    );

    socket.user = tokenValidated as User;

    return next();
  }

  http(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    const tokenValidated = new ValidateTokenUtil().validate(
      token as string,
      process.env.SECRET_ACCESS_JWT as string
    );

    req.user = tokenValidated as User;

    return next();
  }
}
