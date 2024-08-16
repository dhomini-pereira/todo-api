import { User } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import sha256 from "sha256";
import { z } from "zod";
import { UserRepo } from "../../repos/User.repo";
import { IdentifyService } from "../../services/Identify.service";

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .transform((pass) => sha256.x2(pass)),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

export class SignUpController {
  public static async handle(request: FastifyRequest, reply: FastifyReply) {
    const user: SignUpSchema = signUpSchema.parse(request.body);

    const payload = await new UserRepo().signUp(user);

    const token = new IdentifyService().associate(payload);

    return reply.send({ token });
  }
}
