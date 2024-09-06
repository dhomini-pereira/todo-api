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

const config = {
  port: process.env.STAGE === "DEV" ? 4000 : Number(process.env.PORT),
  host: process.env.STAGE === "DEV" ? "localhost" : "0.0.0.0",
};

app.listen(config, (err, address) => {
  console.log(`Server is listening on ${address}`);
});
