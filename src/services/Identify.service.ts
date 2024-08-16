import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "-TEST";

export class IdentifyService {
  verify(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }

  associate(payload: any) {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: "30m",
    });
  }
}
