import fastify from "fastify";
import cors from "@fastify/cors";
import { UserRouter } from "./routers/User.router";
import { TaskRouter } from "./routers/Task.router";

declare module "fastify" {
  interface FastifyRequest {
    user?: any;
  }
}
const app = fastify();

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

app.register(new UserRouter().router, {
  prefix: "/user",
});

app.register(new TaskRouter().router, {
  prefix: "/task",
});

app.listen(
  { port: Number(process.env.PORT) ?? 4000, host: "0.0.0.0" },
  (err, address) => {
    console.log(`Server is listening on ${address}`);
  }
);
