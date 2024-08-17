import fastify from "fastify";
import { UserRouter } from "./routers/User.router";
import { TaskRouter } from "./routers/Task.router";

declare module "fastify" {
  interface FastifyRequest {
    user?: any;
  }
}
const app = fastify();

app.register(new UserRouter().router, {
  prefix: "/user",
});

app.register(new TaskRouter().router, {
  prefix: "/task",
});

app.listen({ port: Number(process.env.PORT) ?? 4000 }, (err, address) => {
  console.log(`Server is listening on ${address}`);
});
