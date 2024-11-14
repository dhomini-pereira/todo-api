import { database } from "../../configs/database.config";
import { storage } from "../../configs/storage.config";
import { DeleteFileService } from "../../services/DeleteFile.service";
import { Request, Response } from "express";

export class DeleteUserController {
  async handle(req: Request, res: Response) {
    const userId = req.user.id;

    const user = await database.user.findFirst({
      where: { id: userId },
    });

    if (user?.imageURL)
      await new DeleteFileService(storage).delete(user?.imageURL);

    await database.user.delete({
      where: {
        id: userId,
      },
    });

    res.sendStatus(204);
    return;
  }
}
