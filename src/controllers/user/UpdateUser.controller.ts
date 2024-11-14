import { database } from "@/configs/database.config";
import { storage } from "@/configs/storage.config";
import { DeleteFileService } from "@/services/DeleteFile.service";
import { UploadFileService } from "@/services/UploadFile.service";
import { S3Client } from "@aws-sdk/client-s3";
import { User } from "@prisma/client";
import { Request, Response } from "express";

export class UpdateUserController {
  async handle(req: Request, res: Response) {
    let data = req.body as Partial<
      Omit<User, "id" | "updatedAt" | "createdAt" | "active" | "email">
    >;
    const userId = req.user.id;

    if (!data.username && !data.password && !data.imageURL) {
      res.status(400).send({ error: "Preencha pelo menos um campo!" });
      return;
    }

    const user = await database.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).send({ error: "Usuário não encontrado!" });
      return;
    }

    if (data.imageURL) {
      if (user.imageURL)
        await new DeleteFileService(storage).delete(user.imageURL);

      const url = await new UploadFileService(storage).upload(
        `${user.id}.${new Date().getTime()}`,
        data.imageURL,
        "image/jpg"
      );
      data.imageURL = url;
    }

    const userUpdated = await database.user.update({
      where: {
        id: userId,
      },
      data,
    });

    res.status(200).send(userUpdated);
    return;
  }
}
