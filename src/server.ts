import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { HasLoggedInMiddleware } from "./middlewares/HasLoggedIn.middleware";
import { AuthRouter } from "./routes/Auth.routes";
import { WorkareaRouter } from "./routes/Workarea.routes";
import { InviteRouter } from "./routes/Invite.routes";
import { CreateTaskController } from "./controllers/ws/CreateTask.controller";
import "@/configs/modules.config";
import { UserRouter } from "./routes/User.routes";
import { UpdateTaskController } from "./controllers/ws/UpdateTask.controller";
import { ChangeTaskTypeController } from "./controllers/ws/ChangeTaskType.controller";
import { ListTasksController } from "./controllers/ws/ListTasks.controller";
import { DeleteTaskController } from "./controllers/ws/DeleteTask.controller";
import { database } from "./configs/database.config";

const app = express();
const server = createServer(app);
const io = new Server(server);

io.use(new HasLoggedInMiddleware().ws);
app.use(express.json());
app.use(cors());
app.use("/auth", AuthRouter);
app.use("/workarea", new HasLoggedInMiddleware().http, WorkareaRouter);
app.use("/invite", new HasLoggedInMiddleware().http, InviteRouter);
app.use("/user", new HasLoggedInMiddleware().http, UserRouter);

io.on("connection", async (socket) => {
  const workareaId = socket.handshake.query.workareaId;

  const workarea = await database.workarea.findFirst({
    where: {
      OR: [
        {
          memberWorkarea: {
            some: {
              workareaId: Number(workareaId),
              userId: socket.user.id,
            },
          },
        },
        {
          id: Number(workareaId),
          ownerId: socket.user.id,
        },
      ],
    },
  });

  if (!workarea) return socket.disconnect();

  socket.join(`workarea_${workareaId}`);

  socket.on("create_task", (data) =>
    new CreateTaskController().handle(io, socket, data)
  );

  socket.on("update_task", (data) =>
    new UpdateTaskController().handle(io, socket, data)
  );

  socket.on("change_task_type", (data) =>
    new ChangeTaskTypeController().handle(io, socket, data)
  );

  socket.on("list_tasks", () => new ListTasksController().handle(io, socket));

  socket.on("delete_task", (data) =>
    new DeleteTaskController().handle(io, socket, data)
  );

  socket.on("disconnect", () => {
    socket.leave(`workarea_${workareaId}`);
  });
});

server.listen(3000, () => {
  console.log(`Listen on port: 3000`);
});
