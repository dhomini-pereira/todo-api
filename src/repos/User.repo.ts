import { User } from "@prisma/client";
import { database } from "../config/database.config";

export class UserRepo {
  signUp(user: Omit<User, "id">) {
    return database.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: false,
      },
    });
  }

  signIn(user: Omit<User, "id" | "name" | "avatarUrl">) {
    return database.user.findFirst({
      where: {
        email: user.email,
        password: user.password,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        password: false,
      },
    });
  }

  read() {
    return database.user.findMany();
  }

  readOne(id: string) {
    return database.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: false,
      },
    });
  }

  delete(id: string) {
    return database.user.delete({
      where: {
        id,
      },
    });
  }

  update(user: Partial<User> & { id: string }) {
    return database.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: false,
      },
    });
  }
}
