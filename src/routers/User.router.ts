import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { AuthGuardMiddleware } from "../middlewares/AuthGuard.middleware";
import { DeleteUserController } from "../controllers/user/DeleteUser.controller";
import { SignUpController } from "../controllers/user/SignUp.controller";
import { SignInController } from "../controllers/user/SignIn.controller";
import { UpdateUserController } from "../controllers/user/UpdateUser.controller";

export class UserRouter {
  router(
    app: FastifyInstance,
    _: FastifyPluginOptions,
    done: (err?: Error | undefined) => void
  ) {
    app.post("/signup", SignUpController.handle);

    app.post("/signin", SignInController.handle);

    app.put(
      "/",
      { preHandler: AuthGuardMiddleware.handle },
      UpdateUserController.handle
    );

    app.delete(
      "/",
      { preHandler: AuthGuardMiddleware.handle },
      DeleteUserController.handle
    );

    return done();
  }
}
