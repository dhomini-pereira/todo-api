import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { HasLoggedInMiddleware } from "./middlewares/HasLoggedIn.middleware";
import { AuthRouter } from "./routes/Auth.routes";
import { WorkareaRouter } from "./routes/Workarea.routes";
import { InviteRouter } from "./routes/Invite.routes";
import { CreateTaskController } from "./controllers/ws/CreateTask.controller";
import "@/configs/modules.config";
import { UserRouter } from "./routes/User.routes";

const app = express();
const server = createServer(app);
const io = new Server(server)

io.use(new HasLoggedInMiddleware().ws);
app.use(express.json());
app.use("/auth", AuthRouter);
app.use("/workarea", new HasLoggedInMiddleware().http, WorkareaRouter);
app.use("/invite", new HasLoggedInMiddleware().http, InviteRouter);
app.use("/user", new HasLoggedInMiddleware().http, UserRouter);

io.on("connection", (socket) => {
  const workareaId = socket.handshake.query.workareaId;

  socket.join(`workarea_${workareaId}`);

  socket.on("create_task", (data) =>
    new CreateTaskController().handle(io, socket, data)
  );

  socket.on("disconnect", () => {
    socket.leave(`workarea_${workareaId}`);
  });
});

server.listen(3000, () => {
  console.log(`Listen on port: 3000`);
});
