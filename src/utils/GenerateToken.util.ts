import jwt from "jsonwebtoken";

export class GenerateTokenUtil {
  public static generate(data: any, secret: string, expires: string) {
    return jwt.sign(data, secret, {
      expiresIn: expires,
    });
  }
}
