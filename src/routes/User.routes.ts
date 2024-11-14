import { DeleteUserController } from "../controllers/user/DeleteUser.controller";
import { GetUserController } from "../controllers/user/GetUser.controller";
import { UpdateUserController } from "../controllers/user/UpdateUser.controller";
import { Router } from "express";

export const UserRouter = Router();

UserRouter.put("/", new UpdateUserController().handle);
UserRouter.delete("/", new DeleteUserController().handle);
UserRouter.get("/", new GetUserController().handle);
