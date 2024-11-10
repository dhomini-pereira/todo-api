import jwt from "jsonwebtoken";

export class ValidateTokenUtil {
  validate(token: string, secret: string) {
    return jwt.verify(token, secret);
  }
}
