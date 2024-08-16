import { FastifyReply, FastifyRequest } from "fastify";
import sha256 from "sha256";
import { z } from "zod";
import { UserRepo } from "../../repos/User.repo";

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z
    .string()
    .min(8)
    .transform((pass) => sha256.x2(pass))
    .optional(),
});

type UserSchema = z.infer<typeof userSchema>;

export class UpdateUserController {
  public static async handle(request: FastifyRequest, reply: FastifyReply) {
    const user: UserSchema = userSchema.parse(request.body);

    if (!user.email && !user.name && !user.password)
      return reply
        .status(400)
        .send({ message: "There must be at least one field" });

    const payload = await new UserRepo().update(user);

    return reply.status(200).send(payload);
  }
}
