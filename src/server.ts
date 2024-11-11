import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { HasLoggedInMiddleware } from "./middlewares/HasLoggedIn.middleware";
import { AuthRouter } from "./routes/Auth.routes";
import { WorkareaRouter } from "./routes/Workarea.routes";
import { User } from "@prisma/client";
import { InviteRouter } from "./routes/Invite.routes";

const app = express();
const server = createServer(app);
const io = new Server(server);

io.use(new HasLoggedInMiddleware().ws);
app.use(express.json());
app.use("/auth", AuthRouter);
app.use("/workarea", new HasLoggedInMiddleware().http, WorkareaRouter);
app.use("/invite", new HasLoggedInMiddleware().http, InviteRouter);

server.listen(3000, () => {
  console.log(`Listen on port: 3000`);
});
