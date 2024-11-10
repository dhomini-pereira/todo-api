import { DeleteUserController } from "@/controllers/http/user/DeleteUser.controller";
import { UpdateUserController } from "@/controllers/http/user/UpdateUser.controller";
import { Router } from "express";

export const UserRouter = Router();

UserRouter.put("/", new UpdateUserController().handle);
UserRouter.delete("/", new DeleteUserController().handle);
