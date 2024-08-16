import { FastifyReply, FastifyRequest } from "fastify";
import sha256 from "sha256";

import { z } from "zod";
import { UserRepo } from "../../repos/User.repo";
import { IdentifyService } from "../../services/Identify.service";

const signInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(1)
    .transform((pass) => sha256.x2(pass)),
});

type SignInSchema = z.infer<typeof signInSchema>;

export class SignInController {
  public static async handle(request: FastifyRequest, reply: FastifyReply) {
    const signIn: SignInSchema = signInSchema.parse(request.body);

    const payload = await new UserRepo().signIn(signIn);

    if (!payload)
      reply.status(401).send({ message: "E-Mail or password incorrect" });

    const token = new IdentifyService().associate(payload);

    return reply.status(200).send({ token });
  }
}
