import { email } from "../configs/email.config";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";

export class SendEmailService {
  async send(
    destiny: string,
    subject: string,
    filename: string,
    data: any
  ): Promise<void> {
    const filePath = path.join(__dirname, "../", "templates", filename);
    const source = fs.readFileSync(filePath).toString();

    const template = handlebars.compile(source);

    const html = template(data);

    await email.sendMail({
      from: process.env.USER_EMAIL,
      to: destiny,
      subject: subject,
      html,
    });
  }
}
