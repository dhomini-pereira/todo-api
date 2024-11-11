import { NextFunction, Request, Response } from "express";
import { ValidateTokenUtil } from "@/utils/ValidateToken.util";
import { ExtendedError, Socket } from "socket.io";
import { User } from "@prisma/client";
import { JsonWebTokenError } from "jsonwebtoken";

export class HasLoggedInMiddleware {
  ws(socket: Socket, next: (err?: ExtendedError) => void) {
    const token = socket.handshake.query.token;

    if (!token) {
      return next(new Error("Token não fornecido"));
    }

    try {
      const tokenValidated = new ValidateTokenUtil().validate(
        token as string,
        process.env.SECRET_ACCESS_JWT as string
      );

      if (!tokenValidated) {
        return next(new Error("Token inválido"));
      }

      socket.user = tokenValidated as User;
      return next();
    } catch (error) {
      return next(new Error("Erro ao validar o token"));
    }
  }

  http(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(401).json({ error: "Token não fornecido" });
        return;
      }

      const tokenValidated = new ValidateTokenUtil().validate(
        token as string,
        process.env.SECRET_ACCESS_JWT as string
      );

      req.user = tokenValidated as User;

      return next();
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        if (err.name === "TokenExpiredError") {
          res.status(401).json({ error: "Token expirado" });
          return;
        } else if (err.name === "JsonWebTokenError") {
          res.status(401).json({ error: "Token inválido" });
          return;
        } else {
          res.status(500).json({ error: "Erro interno do servidor" });
          return;
        }
      }
    }
  }
}
