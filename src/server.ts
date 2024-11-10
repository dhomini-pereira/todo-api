import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { HasLoggedIn } from "./middlewares/HasLoggedIn.middleware";
import { AuthRouter } from "./routes/Auth.routes";
import { WorkareaRouter } from "./routes/Workarea.routes";
import { User } from "@prisma/client";

declare module "socket.io" {
  interface Socket {
    user: User;
  }
}

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

const app = express();
const server = createServer(app);
const io = new Server(server);

io.use(new HasLoggedIn().ws);
app.use(express.json());
app.use("/auth", AuthRouter);
app.use("/workarea", new HasLoggedIn().http, WorkareaRouter);

server.listen(3000, () => {
  console.log(`Listen on port: 3000`);
});
