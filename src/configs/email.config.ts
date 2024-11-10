import nodemailer from "nodemailer";

export const email = nodemailer.createTransport({
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.PASS_EMAIL,
  },
  port: 587,
  host: "smtp.gmail.com",
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});
