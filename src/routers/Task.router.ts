import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { ReadTasksController } from "../controllers/task/ReadTasks.controller";
import { AuthGuardMiddleware } from "../middlewares/AuthGuard.middleware";
import { ReadTaskController } from "../controllers/task/ReadTask.controller";
import { DeleteTaskController } from "../controllers/task/DeleteTask.controller";
import { UpdateTaskController } from "../controllers/task/UpdateTask.controller";
import { CreateTaskController } from "../controllers/task/CreateTask.controller";

export class TaskRouter {
  router(
    app: FastifyInstance,
    _: FastifyPluginOptions,
    done: (err?: Error | undefined) => void
  ) {
    app.post(
      "/",
      { preHandler: AuthGuardMiddleware.handle },
      CreateTaskController.handle
    );

    app.get(
      "/",
      { preHandler: AuthGuardMiddleware.handle },
      ReadTasksController.handle
    );

    app.get(
      "/:id",
      { preHandler: AuthGuardMiddleware.handle },
      ReadTaskController.handle
    );

    app.delete(
      "/:id",
      { preHandler: AuthGuardMiddleware.handle },
      DeleteTaskController.handle
    );

    app.put(
      "/",
      { preHandler: AuthGuardMiddleware.handle },
      UpdateTaskController.handle
    );
    done();
  }
}
