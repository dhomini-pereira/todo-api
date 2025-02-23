import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { HasLoggedInMiddleware } from "./middlewares/HasLoggedIn.middleware";
import { AuthRouter } from "./routes/Auth.routes";
import { WorkareaRouter } from "./routes/Workarea.routes";
import { InviteRouter } from "./routes/Invite.routes";
import "./configs/modules.config";
import { UserRouter } from "./routes/User.routes";
import { database } from "./configs/database.config";
import { ListTasksController } from "./controllers/task/ListTasks.controller";
import { UpdateTaskController } from "./controllers/task/UpdateTask.controller";
import { CreateTaskController } from "./controllers/task/CreateTask.controller";
import { DeleteTaskController } from "./controllers/task/DeleteTask.controller";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["*"],
    credentials: true,
  },
});

io.use(new HasLoggedInMiddleware().ws);
app.use(express.json());
app.use(cors());
app.use("/auth", AuthRouter);
app.use("/workarea", new HasLoggedInMiddleware().http, WorkareaRouter);
app.use("/invite", new HasLoggedInMiddleware().http, InviteRouter);
app.use("/user", new HasLoggedInMiddleware().http, UserRouter);
app.get(
  "/workarea/:id/tasks",
  new HasLoggedInMiddleware().http,
  new ListTasksController().handle
);

app.post(
  "/workarea/:id/task",
  new HasLoggedInMiddleware().http,
  new CreateTaskController(io).handle
);

app.put(
  "/workarea/:id/task",
  new HasLoggedInMiddleware().http,
  new UpdateTaskController(io).handle
);

app.delete(
  "/workarea/:id/task",
  new HasLoggedInMiddleware().http,
  new DeleteTaskController(io).handle
);

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

  socket.on("disconnect", () => {
    socket.leave(`workarea_${workareaId}`);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Listen on port: ${process.env.PORT || 3000}`);
});
