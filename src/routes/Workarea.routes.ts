import { AddWorkareaMemberController } from "@/controllers/http/workarea/AddWorkareaMember.controller";
import { ChangeWorkareaMemberRoleController } from "@/controllers/http/workarea/ChangeWorkareaMemberRole.controller";
import { CreateWorkareaController } from "@/controllers/http/workarea/CreateWorkarea.controller";
import { DeleteWorkareaController } from "@/controllers/http/workarea/DeleteWorkarea.controller";
import { ListWorkareaMembersController } from "@/controllers/http/workarea/ListWorkareaMembers.controller";
import { ListWorkareasController } from "@/controllers/http/workarea/ListWorkareas.controller";
import { RemoveWorkareaMemberController } from "@/controllers/http/workarea/RemoveWorkareaMember.controller";
import { UpdateWorkareaController } from "@/controllers/http/workarea/UpdateWorkarea.controller";
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
