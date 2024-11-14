import { AddWorkareaMemberController } from "../controllers/workarea/AddWorkareaMember.controller";
import { ChangeWorkareaMemberRoleController } from "../controllers/workarea/ChangeWorkareaMemberRole.controller";
import { CreateWorkareaController } from "../controllers/workarea/CreateWorkarea.controller";
import { DeleteWorkareaController } from "../controllers/workarea/DeleteWorkarea.controller";
import { GetWorkareaController } from "../controllers/workarea/GetWorkarea.controller";
import { ListWorkareaMembersController } from "../controllers/workarea/ListWorkareaMembers.controller";
import { ListWorkareasController } from "../controllers/workarea/ListWorkareas.controller";
import { RemoveWorkareaMemberController } from "../controllers/workarea/RemoveWorkareaMember.controller";
import { UpdateWorkareaController } from "../controllers/workarea/UpdateWorkarea.controller";
import { Router } from "express";

export const WorkareaRouter = Router();

WorkareaRouter.get("/", new ListWorkareasController().handle);
WorkareaRouter.post("/", new CreateWorkareaController().handle);
WorkareaRouter.put("/:id", new UpdateWorkareaController().handle);
WorkareaRouter.delete("/:id", new DeleteWorkareaController().handle);
WorkareaRouter.post("/:id/member", new AddWorkareaMemberController().handle);
WorkareaRouter.get("/:id/members", new ListWorkareaMembersController().handle);
WorkareaRouter.delete(
  "/:id/member/:memberId",
  new RemoveWorkareaMemberController().handle
);
WorkareaRouter.patch(
  "/:id/member/:memberId",
  new ChangeWorkareaMemberRoleController().handle
);
WorkareaRouter.get("/:id", new GetWorkareaController().handle);
