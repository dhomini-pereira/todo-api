import { User } from "@prisma/client";

declare module "socket.io" {
  interface Socket {
    user: Omit<User, "password">;
  }
}

declare global {
  namespace Express {
    interface Request {
      user: Omit<User, "password">;
    }
  }
}

(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};
