import { AcceptOrDeclineInviteController } from "@/controllers/http/invite/AcceptOrDeclineInvite.controller";
import { ListInvitesController } from "@/controllers/http/invite/ListInvites.controller";
import { Router } from "express";

export const InviteRouter = Router();

InviteRouter.get("/", new ListInvitesController().handle);
InviteRouter.post("/", new AcceptOrDeclineInviteController().handle);
